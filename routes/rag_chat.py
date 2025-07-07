from fastapi import APIRouter
from schemas.rag_chat import RagChatRequest
from fastapi.responses import StreamingResponse
from services.rag_llm import generate_rag_answer_stream

router = APIRouter()


@router.post("/rag-chat")
async def rag_chat_stream(request: RagChatRequest):
    return StreamingResponse(generate_rag_answer_stream(request.question), media_type="text/plain")
