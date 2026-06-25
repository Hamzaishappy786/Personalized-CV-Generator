"""
QLoRA fine-tune for CV-extraction task on GTX 1050.

Model: Qwen2.5-0.5B-Instruct (swap to Llama-3.2-1B-Instruct if you have the 4GB Ti)
Task: messy bio text -> structured CV JSON

pip install torch transformers peft bitsandbytes accelerate datasets

If bitsandbytes/CUDA complains about Pascal (GTX 1050 is compute capability 6.1),
fall back to fp16 LoRA without 4-bit quantization (load_in_4bit=False below) --
the 0.5B model is small enough to fit without quantization anyway.
"""

import json
import torch
from datasets import Dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    Trainer,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"
DATA_PATH = "data.jsonl"   # combine sample_data.jsonl + generate_data.py output here
OUTPUT_DIR = "./cv-extractor-lora"
MAX_LEN = 768
USE_4BIT = True  # set False if bitsandbytes has issues with Pascal GPUs

SYSTEM_PROMPT = (
    "Extract structured CV information from the user's bio. "
    "Respond with ONLY valid JSON matching the CV schema, no other text."
)

# ---------- Load & format dataset ----------

def load_examples(path):
    examples = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                examples.append(json.loads(line))
    return examples

def format_example(ex, tokenizer):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": ex["input"]},
        {"role": "assistant", "content": json.dumps(ex["output"], ensure_ascii=False)},
    ]
    text = tokenizer.apply_chat_template(messages, tokenize=False)
    return {"text": text}

# ---------- Main ----------

def main():
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    raw_examples = load_examples(DATA_PATH)
    print(f"Loaded {len(raw_examples)} examples")

    formatted = [format_example(ex, tokenizer) for ex in raw_examples]
    dataset = Dataset.from_list(formatted)

    def tokenize_fn(batch):
        out = tokenizer(
            batch["text"],
            truncation=True,
            max_length=MAX_LEN,
            padding="max_length",
        )
        out["labels"] = out["input_ids"].copy()
        return out

    dataset = dataset.map(tokenize_fn, batched=True, remove_columns=["text"])
    dataset = dataset.train_test_split(test_size=0.1, seed=42)

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
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=3,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=8,
        learning_rate=2e-4,
        fp16=True,
        logging_steps=10,
        save_strategy="epoch",
        eval_strategy="epoch",
        report_to="none",
        optim="paged_adamw_8bit" if USE_4BIT else "adamw_torch",
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        eval_dataset=dataset["test"],
    )

    trainer.train()
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f"Saved LoRA adapter to {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
