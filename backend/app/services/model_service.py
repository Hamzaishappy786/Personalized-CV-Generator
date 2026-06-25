from __future__ import annotations

import json
import os
from functools import lru_cache
from pathlib import Path

from app.schemas.cv_schema import CVData
from app.services.generation_service import generate_cv_data

MODEL_NAME = os.getenv("CV_MODEL_NAME", "Qwen/Qwen2.5-0.5B-Instruct")
ADAPTER_PATH = Path(os.getenv("CV_ADAPTER_PATH", "model/checkpoints/qwen-0.5b-cv-lora"))


def _fallback(text: str) -> CVData:
    return generate_cv_data(text)


@lru_cache(maxsize=1)
def _load_model():
    try:
        import torch
        from peft import PeftModel
        from transformers import AutoModelForCausalLM, AutoTokenizer
    except Exception:
        return None

    if not ADAPTER_PATH.exists():
        return None

    try:
        tokenizer = AutoTokenizer.from_pretrained(str(ADAPTER_PATH))
        base_model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.float16,
            device_map="auto",
        )
        model = PeftModel.from_pretrained(base_model, str(ADAPTER_PATH))
        model.eval()
        return tokenizer, model
    except Exception:
        return None


def infer_cv_data(text: str) -> CVData:
    loaded = _load_model()
    if loaded is None:
        return _fallback(text)

    tokenizer, model = loaded
    messages = [
        {
            "role": "system",
            "content": (
                "Extract structured CV information from the user's bio. "
                "Respond with only valid JSON that matches the CV schema."
            ),
        },
        {"role": "user", "content": text},
    ]
    prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    try:
        import torch

        with torch.no_grad():
            output = model.generate(
                **inputs,
                max_new_tokens=384,
                temperature=0.1,
                do_sample=False,
            )
        result = tokenizer.decode(output[0][inputs["input_ids"].shape[1] :], skip_special_tokens=True)
        data = json.loads(result)
        return CVData.model_validate(data)
    except Exception:
        return _fallback(text)
