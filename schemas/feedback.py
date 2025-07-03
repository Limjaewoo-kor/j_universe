from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    project: str
    username: Optional[str] = None
    feedback_text: str
    type: Optional[str] = None  # ← 여기 추가!

class FeedbackRead(BaseModel):
    id: int
    project: str
    username: Optional[str] = None
    feedback_text: str
    type: Optional[str] = None  # ← 여기 추가!
    created_at: datetime

    model_config = {
        "from_attributes": True
    }