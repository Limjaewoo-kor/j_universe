from pydantic import BaseModel

class RagChatRequest(BaseModel):
    question: str

class RagChatResponse(BaseModel):
    answer: str
