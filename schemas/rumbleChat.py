from pydantic import BaseModel
from datetime import datetime

class ChatMessageCreate(BaseModel):
    session_id: str
    role: str
    content: str

class ChatMessageResponse(BaseModel):
    role: str
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
