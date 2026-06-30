from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

import torch
from torch import nn


class LoRALinear(nn.Module):
    def __init__(self, base_layer: nn.Linear, rank: int, alpha: int, dropout: float):
        super().__init__()
        if not isinstance(base_layer, nn.Linear):
            raise TypeError("LoRALinear expects an nn.Linear base layer")

        self.base_layer = base_layer
        self.rank = rank
        self.alpha = alpha
        self.scale = alpha / rank
        self.dropout = nn.Dropout(dropout)

        self.lora_A = nn.Linear(base_layer.in_features, rank, bias=False)
        self.lora_B = nn.Linear(rank, base_layer.out_features, bias=False)

        nn.init.kaiming_uniform_(self.lora_A.weight, a=5 ** 0.5)
        nn.init.zeros_(self.lora_B.weight)

        for param in self.base_layer.parameters():
            param.requires_grad = False

    def forward(self, x):
        base_output = self.base_layer(x)
        lora_output = self.lora_B(self.lora_A(self.dropout(x))) * self.scale
        return base_output + lora_output


def _replace_linear_layers(module: nn.Module, target_modules: Iterable[str], rank: int, alpha: int, dropout: float):
    for child_name, child in list(module.named_children()):
        if isinstance(child, nn.Linear) and child_name in target_modules:
            setattr(module, child_name, LoRALinear(child, rank=rank, alpha=alpha, dropout=dropout))
        else:
            _replace_linear_layers(child, target_modules, rank, alpha, dropout)


def inject_lora(model: nn.Module, target_modules: Iterable[str], rank: int = 8, alpha: int = 16, dropout: float = 0.05):
    for param in model.parameters():
        param.requires_grad = False
    _replace_linear_layers(model, target_modules, rank, alpha, dropout)
    return model


def iter_lora_state_dict(model: nn.Module) -> dict[str, torch.Tensor]:
    return {name: tensor.detach().cpu() for name, tensor in model.state_dict().items() if "lora_" in name}


def save_lora_adapter(model: nn.Module, output_dir: Path, metadata: dict) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    torch.save(iter_lora_state_dict(model), output_dir / "adapter_model.bin")
    (output_dir / "adapter_config.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")


def load_lora_adapter(model: nn.Module, adapter_dir: Path) -> dict:
    metadata_path = adapter_dir / "adapter_config.json"
    weights_path = adapter_dir / "adapter_model.bin"
    if not metadata_path.exists() or not weights_path.exists():
        raise FileNotFoundError("Adapter files not found")

    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    inject_lora(
        model,
        metadata.get("target_modules", ["q_proj", "k_proj", "v_proj", "o_proj"]),
        rank=int(metadata.get("rank", 8)),
        alpha=int(metadata.get("alpha", 16)),
        dropout=float(metadata.get("dropout", 0.05)),
    )
    state_dict = torch.load(weights_path, map_location="cpu")
    model.load_state_dict(state_dict, strict=False)
    return metadata
