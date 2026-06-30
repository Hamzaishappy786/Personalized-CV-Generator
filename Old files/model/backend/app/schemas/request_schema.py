from pydantic import BaseModel
from typing import Optional


class ParseRequest(BaseModel):
    text: str
    template_id: Optional[str] = None


class ExportRequest(BaseModel):
    text: str
    template_id: Optional[str] = None
    format: str = "pdf"
