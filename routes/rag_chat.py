from fastapi import APIRouter
from schemas.rag_chat import RagChatRequest, RagChatResponse
from services.rag_llm import generate_rag_answer

router = APIRouter()

@router.post("/rag-chat", response_model=RagChatResponse)
async def rag_chat(request: RagChatRequest):
    answer = await generate_rag_answer(request.question)
    return RagChatResponse(answer=answer)
