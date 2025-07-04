from fastapi import APIRouter, Depends
from schemas.rumbleChat import ChatMessageCreate, ChatMessageResponse
from services.rumbleChat_db import save_chat_message, load_last_messages

router = APIRouter()

@router.post("/chat-message")
def post_message(msg: ChatMessageCreate):
    save_chat_message(msg.session_id, msg.role, msg.content)
    return {"status": "saved"}

@router.get("/chat-history/{session_id}", response_model=list[ChatMessageResponse])
def get_history(session_id: str):
    return load_last_messages(session_id)
