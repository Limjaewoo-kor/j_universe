# main.py
from typing import List

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from database import Base, engine
import os
from dotenv import load_dotenv
from routes import chat, rag_chat, feedback, upload, rumbleChat, auth
from services.rag_llm import generate_rag_answer, create_rag

load_dotenv()

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
openai_api_key = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")


app = FastAPI()

Base.metadata.create_all(bind=engine)
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(rag_chat.router)
app.include_router(feedback.router)
app.include_router(upload.router)
app.include_router(rumbleChat.router)

# CORS 설정 (로컬 React 연동용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:3000",
                   "https://j-universe.vercel.app"
                   "https://j-uni.com",
                   "https://www.j-uni.com",
                   ],  # Vite일 경우
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GPT 모델 설정
llm = ChatOpenAI(
    temperature=0.7,
    model_name="gpt-4o",  # 필요시 변경
    openai_api_key=openai_api_key # .env로 관리 권장
)

# 요청 모델
class GenerateRequest(BaseModel):
    purpose: str
    input: str
    tone: str
    length: str = "중간"
    emoji: bool = False


prompt_map = {
    "문의": PromptTemplate(
        input_variables=["input","tone","length","emoji"],
        template="""
        너는 사용자의 질문을 자연스럽고 공손한 표현으로 다듬어주는 도우미야.
        
        역할:
        - 화자: 사용자 본인
        - 청자: 특정 상대방 (예: 부장님, 고객 등)
        
         참고 예시:
        - 입력: 안녕하세요. 홍길동 부장입니다. 어제 시스템에서 예외가 발생해 로그를 확인 요청드립니다.
        - 출력: 안녕하세요. 홍길동 부장입니다. 어제 시스템에서 예외가 발생했는데, 관련 로그 확인을 부탁드릴 수 있을까요?
        
        입력 정보:
        - 원문: {input}
        - 말투 스타일: {tone}
        - 문장 길이: {length}
        - 이모지 포함 여부: {emoji}
        
        작성 조건:
        - 화자의 시점과 역할을 유지
        - 질문 의도 및 호칭이 자연스럽게 반영되도록 표현
        - 문맥 흐름이 매끄럽고 현실적인 대화처럼 작성
        - 답변을 포함하지 말 것
        - 존댓말 사용
        - 문장 길이와 이모지 포함 여부는 위 입력 정보에 따를 것
        - 작성자가 자기소개한 경우, 그대로 유지할 것
        """
    ),
    "요청": PromptTemplate(
        input_variables=["input","tone","length","emoji"],
        template="""
        너는 사용자의 요청 문장을 더 자연스럽고 공손하게 바꿔주는 도우미야.
        
        역할:
        - 화자: 요청을 하는 사용자 본인
        - 청자: 요청을 받는 상대방
        
        예시:
        입력: 자료 부탁드립니다.
        → 출력: 번거로우시겠지만, 관련 자료 공유 부탁드립니다.
        
        입력 정보:
        - 원문: {input}
        - 말투 스타일: {tone}
        - 문장 길이: {length}
        - 이모지 포함 여부: {emoji}
        
        작성 조건:
        - 화자의 시점을 유지하며, 요청의 핵심 의도는 그대로 전달
        - 구체적이고 명확한 표현으로 정리
        - 존댓말 사용
        - 문장 길이와 이모지 포함 여부는 위 입력 정보에 따를 것
        - 작성자가 자기소개한 경우, 그대로 유지할 것
        """
    ),
    "감사": PromptTemplate(
        input_variables=["input","tone","length","emoji"],
        template="""
        너는 사용자의 감사 표현을 진심이 담기도록 자연스럽게 다듬어주는 도우미야.
    
        역할:
        - 화자: 감사하는 사용자 본인
        - 청자: 감사받는 상대방
    
        예시:
        입력: 수고하셨습니다
        → 출력: 꼼꼼히 챙겨주셔서 진심으로 감사드립니다.
    
        입력 정보:
        - 원문: {input}
        - 말투 스타일: {tone}
        - 문장 길이: {length}
        - 이모지 포함 여부: {emoji}
    
        작성 조건:
        - 과장되지 않게 진심 어린 감정 전달
        - 뻔하거나 모호하지 않은 자연스러운 표현
        - 화자의 역할 및 상황이 반영된 감사 표현일 것
        - 문장 길이와 이모지 포함 여부는 위 입력 정보에 따를 것
        - 작성자가 자기소개한 경우, 그대로 유지할 것
        """
    ),
    "사과": PromptTemplate(
        input_variables=["input","tone","length","emoji"],
        template="""
        너는 사용자의 사과 표현을 정중하고 진심이 느껴지도록 다듬어주는 도우미야.
        
        역할:
        - 화자: 사과하는 사용자 본인
        - 청자: 사과를 받는 상대방
        
        예시:
        입력: 늦게 드려 죄송합니다
        → 출력: 전달이 늦어진 점 진심으로 사과드립니다.
        
        입력 정보:
        - 원문: {input}
        - 말투 스타일: {tone}
        - 문장 길이: {length}
        - 이모지 포함 여부: {emoji}
        
        작성 조건:
        - 진심이 느껴지되 지나치게 무겁지 않도록
        - 사과 이유가 자연스럽게 전달될 것
        - 존댓말 사용
        - 문장 길이와 이모지 포함 여부는 위 입력 정보에 따를 것
        - 작성자가 자기소개한 경우, 그대로 유지할 것
        """
    ),
    "항의": PromptTemplate(
        input_variables=["input","tone","length","emoji"],
        template="""
        너는 사용자의 항의 표현을 공손하면서도 단호하게 정리해주는 도우미야.
    
        역할:
        - 화자: 문제 상황을 전달하는 사용자 본인
        - 청자: 해당 상황의 책임자 또는 관련자
    
        예시:
        입력: 자꾸 오류가 발생합니다.
        → 출력: 동일한 오류가 반복되어 불편을 겪고 있어 확인 요청드립니다.
    
        입력 정보:
        - 원문: {input}
        - 말투 스타일: {tone}
        - 문장 길이: {length}
        - 이모지 포함 여부: {emoji}
    
        작성 조건:
        - 감정 표현은 자제하면서도 문제의 심각성은 명확히 전달
        - 해결을 유도하는 형태로 마무리
        - 존댓말 사용
        - 문장 길이와 이모지 포함 여부는 위 입력 정보에 따를 것
        - 작성자가 자기소개한 경우, 그대로 유지할 것
        """
    )
}


@app.get("/")
async def root():
    return {"message": "MainPage"}

@app.post("/generate")
async def generate_message(data: GenerateRequest):
    prompt = prompt_map.get(data.purpose)

    if not prompt:
        return {"result": "지원하지 않는 목적입니다."}

    if data.emoji :
        emoji_instruction = "이모지를 적절히 포함해줘"
    else :
        emoji_instruction ="이모지는 사용하지 말 것"

    filled_prompt = prompt.format(
        input=data.input,
        tone=data.tone,
        length = data.length,
        emoji = emoji_instruction
    )

    response  = llm.invoke(filled_prompt)

    return {"result": response.content.strip()}


@app.post("/rag-answer")
async def get_rag_answer(question: str):
    return {"answer": await generate_rag_answer(question)}


@app.get("/rag-create")
async def get_create_rag():
    print("create rag")
    create_rag()
    return {"create Complete"}

