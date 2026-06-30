"""
Smoke test for the saved LoRA adapter.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

os.environ["TRANSFORMERS_NO_TF"] = "1"
os.environ["TRANSFORMERS_NO_FLAX"] = "1"
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app.schemas.cv_schema import CVData
from backend.app.services.json_utils import extract_json_object
from backend.app.services.lora_adapter import load_lora_adapter
from backend.app.services.schema_normalizer import normalize_cv_dict

BASE_MODEL = "Qwen/Qwen2.5-0.5B-Instruct"
ADAPTER_PATH = ROOT / "model" / "checkpoints" / "qwen-0.5b-cv-lora"
SYSTEM_PROMPT = (
    "Extract structured CV information from the user's bio. "
    "Respond with only valid JSON matching the CV schema."
)


def main():
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=torch.float16,
        low_cpu_mem_usage=True,
    )
    model.generation_config.do_sample = False
    model.generation_config.temperature = None
    model.generation_config.top_p = None
    model.generation_config.top_k = None
    load_lora_adapter(model, ADAPTER_PATH)
    model.to(device)
    model.half()
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
                max_new_tokens=256,
                do_sample=False,
            )

        result = tokenizer.decode(
            output[0][inputs["input_ids"].shape[1] :], skip_special_tokens=True
        )
        repaired = normalize_cv_dict(extract_json_object(result))
        print(f"INPUT: {bio}")
        print(f"OUTPUT: {result}")
        try:
            parsed = CVData.model_validate(repaired)
            print("repaired:", parsed.model_dump())
        except json.JSONDecodeError:
            print("INVALID JSON")
        except Exception as exc:
            print(f"REPAIR FAILED: {exc}")
        print("-" * 60)


if __name__ == "__main__":
    main()
