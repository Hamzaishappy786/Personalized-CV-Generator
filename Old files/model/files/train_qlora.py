"""
Train a lightweight LoRA adapter for CV extraction on the local GTX 1050 setup.

This script uses a pure PyTorch training loop so it does not import
transformers.Trainer, which can pull in TensorFlow on some Windows installs.
"""

from __future__ import annotations

import json
import os
import random
import sys
from pathlib import Path

from tqdm import tqdm

os.environ["TRANSFORMERS_NO_TF"] = "1"
os.environ["TRANSFORMERS_NO_FLAX"] = "1"
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import torch
from torch import nn
from torch.optim import AdamW
from transformers import AutoModelForCausalLM, AutoTokenizer, get_linear_schedule_with_warmup

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app.services.lora_adapter import inject_lora, save_lora_adapter

MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"
DATA_PATH = ROOT / "files" / "data.jsonl"
SAMPLE_DATA_PATH = ROOT / "files" / "sample_data.jsonl"
NORMALIZED_DATA_PATH = ROOT / "files" / "data_normalized.jsonl"
OUTPUT_DIR = ROOT / "model" / "checkpoints" / "qwen-0.5b-cv-lora"
MAX_LEN = 512
TARGET_MODULES = ("q_proj", "k_proj", "v_proj", "o_proj")
LORA_RANK = 8
LORA_ALPHA = 16
LORA_DROPOUT = 0.05
EPOCHS = 3
GRADIENT_ACCUMULATION_STEPS = 8
LEARNING_RATE = 2e-4
SEED = 42

SYSTEM_PROMPT = (
    "Extract structured CV information from the user's bio. "
    "Respond with only valid JSON that matches the exact CV schema. "
    "Do not add top-level keys outside the schema. "
    "Do not output fields like degree or work_experience at the top level."
)


def seed_everything(seed: int) -> None:
    random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def load_examples(*paths: Path):
    examples = []
    for path in paths:
        if not path.exists():
            continue
        with path.open("r", encoding="utf-8") as handle:
            examples.extend(json.loads(line) for line in handle if line.strip())
    return examples


def build_example(tokenizer, example):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": example["input"]},
    ]
    prompt_text = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    response_text = json.dumps(example["output"], ensure_ascii=False)
    full_text = prompt_text + response_text + tokenizer.eos_token

    prompt_ids = tokenizer(prompt_text, add_special_tokens=False).input_ids
    encoded = tokenizer(
        full_text,
        truncation=True,
        max_length=MAX_LEN,
        padding="max_length",
        add_special_tokens=False,
    )

    labels = encoded["input_ids"].copy()
    prompt_len = min(len(prompt_ids), len(labels))
    labels[:prompt_len] = [-100] * prompt_len
    labels = [-100 if token == tokenizer.pad_token_id else token for token in labels]

    return {
        "input_ids": torch.tensor(encoded["input_ids"], dtype=torch.long),
        "attention_mask": torch.tensor(encoded["attention_mask"], dtype=torch.long),
        "labels": torch.tensor(labels, dtype=torch.long),
    }


def collate_batch(batch):
    return {
        "input_ids": torch.stack([item["input_ids"] for item in batch]),
        "attention_mask": torch.stack([item["attention_mask"] for item in batch]),
        "labels": torch.stack([item["labels"] for item in batch]),
    }


def split_dataset(items, test_ratio=0.1):
    split_index = max(1, int(len(items) * (1 - test_ratio)))
    train_items = items[:split_index]
    eval_items = items[split_index:] or items[-1:]
    return train_items, eval_items


def make_batches(items, batch_size):
    for index in range(0, len(items), batch_size):
        yield items[index : index + batch_size]


def main():
    seed_everything(SEED)

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    source_paths = [NORMALIZED_DATA_PATH] if NORMALIZED_DATA_PATH.exists() else [SAMPLE_DATA_PATH, DATA_PATH]
    examples = load_examples(*source_paths)
    if not examples:
        raise RuntimeError("No training examples found in files/data.jsonl or files/sample_data.jsonl")

    print(f"Loaded {len(examples)} examples")
    print("Sources: " + ", ".join(str(path) for path in source_paths))
    if NORMALIZED_DATA_PATH.exists():
        print("Using normalized training data")

    dataset = [build_example(tokenizer, ex) for ex in examples]
    random.shuffle(dataset)
    train_set, eval_set = split_dataset(dataset, test_ratio=0.1)
    print(f"Train samples: {len(train_set)}")
    print(f"Eval samples: {len(eval_set)}")

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float16,
        low_cpu_mem_usage=True,
    )
    model.config.use_cache = False
    model.gradient_checkpointing_enable()
    model.enable_input_require_grads()
    model = inject_lora(
        model,
        target_modules=TARGET_MODULES,
        rank=LORA_RANK,
        alpha=LORA_ALPHA,
        dropout=LORA_DROPOUT,
    )

    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total = sum(p.numel() for p in model.parameters())
    print(f"Trainable params: {trainable:,} / {total:,}")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    print(f"Using device: {device}")

    optimizer = AdamW([p for p in model.parameters() if p.requires_grad], lr=LEARNING_RATE)
    steps_per_epoch = max(1, len(train_set) // GRADIENT_ACCUMULATION_STEPS)
    total_steps = steps_per_epoch * EPOCHS
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=max(1, total_steps // 10),
        num_training_steps=total_steps,
    )
    scaler = torch.cuda.amp.GradScaler(enabled=torch.cuda.is_available())

    global_step = 0
    print("=" * 72)
    print("Training started")
    print(f"Epochs: {EPOCHS}")
    print(f"Gradient accumulation: {GRADIENT_ACCUMULATION_STEPS}")
    print(f"Learning rate: {LEARNING_RATE}")
    print(f"Output dir: {OUTPUT_DIR}")
    print("=" * 72)

    model.train()
    for epoch in range(1, EPOCHS + 1):
        print(f"\n--- Epoch {epoch}/{EPOCHS} ---")
        optimizer.zero_grad(set_to_none=True)
        running_loss = 0.0

        pbar = tqdm(make_batches(train_set, 1), total=len(train_set), desc=f"Epoch {epoch}/{EPOCHS}", leave=True)
        for batch_index, batch_items in enumerate(pbar, start=1):
            batch = collate_batch(batch_items)
            batch = {key: value.to(device) for key, value in batch.items()}

            with torch.cuda.amp.autocast(enabled=torch.cuda.is_available()):
                outputs = model(
                    input_ids=batch["input_ids"],
                    attention_mask=batch["attention_mask"],
                    labels=batch["labels"],
                )
                loss = outputs.loss / GRADIENT_ACCUMULATION_STEPS

            scaler.scale(loss).backward()
            running_loss += loss.item() * GRADIENT_ACCUMULATION_STEPS

            if batch_index % GRADIENT_ACCUMULATION_STEPS == 0 or batch_index == len(train_set):
                scaler.step(optimizer)
                scaler.update()
                scheduler.step()
                optimizer.zero_grad(set_to_none=True)
                global_step += 1
                
                # Update the progress bar description/postfix dynamically
                pbar.set_postfix({
                    "step": global_step,
                    "loss": f"{running_loss / max(1, min(batch_index, GRADIENT_ACCUMULATION_STEPS)):.4f}"
                })
                running_loss = 0.0

        model.eval()
        eval_losses = []
        with torch.no_grad():
            with torch.cuda.amp.autocast(enabled=torch.cuda.is_available()):
                eval_pbar = tqdm(make_batches(eval_set, 1), total=len(eval_set), desc="Evaluating", leave=False)
                for batch_items in eval_pbar:
                    batch = collate_batch(batch_items)
                    batch = {key: value.to(device) for key, value in batch.items()}
                    outputs = model(
                        input_ids=batch["input_ids"],
                        attention_mask=batch["attention_mask"],
                        labels=batch["labels"],
                    )
                    eval_losses.append(outputs.loss.item())

        if eval_losses:
            avg_val_loss = sum(eval_losses) / len(eval_losses)
            # Print a clean summary next to/below the finished epoch loading bar
            print(f"Epoch {epoch}/{EPOCHS} complete | eval_loss={avg_val_loss:.4f}")
        model.train()

    print("Saving adapter checkpoint...")
    metadata = {
        "base_model_name": MODEL_NAME,
        "target_modules": list(TARGET_MODULES),
        "rank": LORA_RANK,
        "alpha": LORA_ALPHA,
        "dropout": LORA_DROPOUT,
        "max_len": MAX_LEN,
    }
    save_lora_adapter(model, OUTPUT_DIR, metadata)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f"Saved adapter to {OUTPUT_DIR}")
    print("=" * 72)
    print("Training finished")
    print("=" * 72)


if __name__ == "__main__":
    main()
