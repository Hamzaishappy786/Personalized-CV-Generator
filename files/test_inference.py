"""
Test the fine-tuned CV-extractor adapter.

pip install torch transformers peft
"""

import json
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

BASE_MODEL = "Qwen/Qwen2.5-0.5B-Instruct"
ADAPTER_PATH = "./cv-extractor-lora"

SYSTEM_PROMPT = (
    "Extract structured CV information from the user's bio. "
    "Respond with ONLY valid JSON matching the CV schema, no other text."
)

def main():
    tokenizer = AutoTokenizer.from_pretrained(ADAPTER_PATH)
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL, torch_dtype=torch.float16, device_map="auto"
    )
    model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
    model.eval()

    test_inputs = [
        "im usman, software eng grad from giki 2020, worked 3 years at systems ltd as full stack dev react and django, also know docker kubernetes",
        "hi im fatima, marketing major from punjab university, did internship at unilever in brand management, good with excel and canva",
    ]

    for bio in test_inputs:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": bio},
        ]
        prompt = tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

        with torch.no_grad():
            output = model.generate(
                **inputs,
                max_new_tokens=400,
                temperature=0.1,
                do_sample=False,
            )

        result = tokenizer.decode(
            output[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True
        )
        print(f"INPUT: {bio}")
        print(f"OUTPUT: {result}")
        try:
            json.loads(result)
            print("valid JSON")
        except json.JSONDecodeError:
            print("INVALID JSON")
        print("-" * 60)

if __name__ == "__main__":
    main()
