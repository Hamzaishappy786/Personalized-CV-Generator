"""
QLoRA fine-tune for CV extraction on a GTX 1050 4GB.

Model: Qwen/Qwen2.5-0.5B-Instruct
Task: messy bio text -> structured CV JSON

Install:
  pip install torch transformers peft bitsandbytes accelerate datasets
"""

import json
from pathlib import Path

import torch
from datasets import Dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    Trainer,
    TrainingArguments,
)

MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"
DATA_PATH = Path("files/data.jsonl")
OUTPUT_DIR = Path("model/checkpoints/qwen-0.5b-cv-lora")
MAX_LEN = 512
USE_4BIT = True

SYSTEM_PROMPT = (
    "Extract structured CV information from the user's bio. "
    "Respond with only valid JSON that matches the CV schema."
)


def load_examples(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return [json.loads(line) for line in handle if line.strip()]


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
    full = tokenizer(
        full_text,
        truncation=True,
        max_length=MAX_LEN,
        padding="max_length",
        add_special_tokens=False,
    )

    labels = full["input_ids"].copy()
    prompt_len = min(len(prompt_ids), len(labels))
    labels[:prompt_len] = [-100] * prompt_len

    return {
        "input_ids": full["input_ids"],
        "attention_mask": full["attention_mask"],
        "labels": labels,
    }


def main():
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    if tokenizer.pad_token is None:
      tokenizer.pad_token = tokenizer.eos_token

    examples = load_examples(DATA_PATH)
    print(f"Loaded {len(examples)} examples")

    dataset = Dataset.from_list([build_example(tokenizer, ex) for ex in examples])
    split = dataset.train_test_split(test_size=0.1, seed=42)

    quant_config = None
    if USE_4BIT:
        quant_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
        )

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=quant_config,
        torch_dtype=torch.float16,
        device_map="auto",
    )

    if USE_4BIT:
        model = prepare_model_for_kbit_training(model)

    lora_config = LoraConfig(
        r=8,
        lora_alpha=16,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    training_args = TrainingArguments(
        output_dir=str(OUTPUT_DIR),
        num_train_epochs=3,
        per_device_train_batch_size=1,
        per_device_eval_batch_size=1,
        gradient_accumulation_steps=8,
        learning_rate=2e-4,
        fp16=True,
        logging_steps=10,
        save_strategy="epoch",
        eval_strategy="epoch",
        save_total_limit=2,
        report_to="none",
        optim="paged_adamw_8bit" if USE_4BIT else "adamw_torch",
        gradient_checkpointing=True,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=split["train"],
        eval_dataset=split["test"],
    )

    trainer.train()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f"Saved LoRA adapter to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
