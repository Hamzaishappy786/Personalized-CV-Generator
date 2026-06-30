from __future__ import annotations

import json
import os
from functools import lru_cache
from pathlib import Path

os.environ["TRANSFORMERS_NO_TF"] = "1"
os.environ["TRANSFORMERS_NO_FLAX"] = "1"
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

from backend.app.schemas.cv_schema import CVData
from backend.app.services.generation_service import generate_cv_data
from backend.app.services.json_utils import extract_json_object
from backend.app.services.lora_adapter import load_lora_adapter
from backend.app.services.schema_normalizer import normalize_cv_dict

MODEL_NAME = os.getenv("CV_MODEL_NAME", "Qwen/Qwen2.5-0.5B-Instruct")
ADAPTER_PATH = Path(os.getenv("CV_ADAPTER_PATH", "model/checkpoints/qwen-0.5b-cv-lora"))


def _fallback(text: str) -> CVData:
    return generate_cv_data(text)


@lru_cache(maxsize=1)
def _load_model():
    if not ADAPTER_PATH.exists():
        return None

    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token

        base_model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.float16,
            low_cpu_mem_usage=True,
        )
        base_model.generation_config.do_sample = False
        base_model.generation_config.temperature = None
        base_model.generation_config.top_p = None
        base_model.generation_config.top_k = None
        load_lora_adapter(base_model, ADAPTER_PATH)
        if torch.cuda.is_available():
            base_model = base_model.to("cuda")
        base_model.eval()
        return tokenizer, base_model
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
        with torch.no_grad():
            output = model.generate(
                **inputs,
                max_new_tokens=384,
                do_sample=False,
            )
        result = tokenizer.decode(output[0][inputs["input_ids"].shape[1] :], skip_special_tokens=True)
        data = normalize_cv_dict(extract_json_object(result))
        return CVData.model_validate(data)
    except Exception:
        return _fallback(text)
