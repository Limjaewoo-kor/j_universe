from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from database import Base, engine
import os
from dotenv import load_dotenv
from routes import chat, rag_chat, feedback, upload, rumbleChat, auth
from services.rag_llm import create_rag
from langchain.schema import SystemMessage, HumanMessage
from fastapi.responses import StreamingResponse

load_dotenv()

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
openai_api_key = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")


app = FastAPI()

Base.metadata.create_all(bind=engine)
app.include_router(auth.router)
#rumbleChat
app.include_router(chat.router)
app.include_router(rag_chat.router)
app.include_router(feedback.router)
app.include_router(upload.router)
app.include_router(rumbleChat.router)
#Calc

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


#rumbleChatbot
@app.get("/rag-create")
async def get_create_rag():
    print("create rag")
    create_rag()
    return {"create Complete"}

#Calc

# 요청 모델
class CalcQuery(BaseModel):
    question: str



# POST 엔드포인트
@app.post("/calculate/stream")
async def stream_calculate(query: CalcQuery):
    messages = [
        SystemMessage(content="""
    너는 사용자의 자연어 계산 질문을 이해하고, 수식으로 바꿔서 결과까지 계산해주는 계산 도우미야.

    다음과 같이 답변해줘:
    - "2만5천원의 32% 할인은?" → "25000 * 0.68 = 17000"
    - "3루트2 곱하기 5루트8은?" → "3√2 * 5√8 = 약 60"
    - "8천원을 3명에게 나누면?" → "8000 ÷ 3 = 약 2666.67"

    계산 과정을 보여준 뒤, 마지막에 정답도 써줘.
    """),
        HumanMessage(content=query.question)
    ]

    def token_generator():
        for chunk in llm.stream(messages):
            yield chunk.content or ""  # 토큰 단위로 전달

    return StreamingResponse(token_generator(), media_type="text/plain")


@app.post("/calculate/split")
async def split_calculate(query: CalcQuery):
    messages = [
        SystemMessage(content="""
너는 사람 수와 금액을 입력하면 1인당 부담금액을 계산해주는 도우미야.

다음과 같이 답변해줘:
- "4명이서 87000원을 나누면?" → "87000 ÷ 4 = 21750원입니다."
- "3명이서 12만원 나눌 때 팁 10% 포함하면?" → "120000 * 1.1 ÷ 3 = 44000원입니다."

계산 과정을 수식으로 보여주고, 마지막에 결과만 정리해서 알려줘.
"""),
        HumanMessage(content=query.question)
    ]

    def token_generator():
        for chunk in llm.stream(messages):
            yield chunk.content or ""

    return StreamingResponse(token_generator(), media_type="text/plain")


@app.post("/calculate/interest")
async def interest_calculate(query: CalcQuery):
    messages = [
        SystemMessage(content="""
너는 사용자가 입력한 예금이나 적금 관련 질문을 바탕으로 이자 계산을 도와주는 금융 도우미야.

다음과 같은 방식으로 계산해줘:
- "연 4%로 2년간 1000만원 예금하면?" → "10000000 * (1 + 0.04 * 2) = 10800000원"
- "월 30만원씩 1년간 적금하면?" → "30만원 * 12개월 + 이자 = 총 얼마"

단리 기준으로 계산해줘. 복리는 무시해도 돼.
수식을 먼저 보여주고, 그 다음에 결과를 친절하게 정리해서 알려줘.
"""),
        HumanMessage(content=query.question)
    ]

    def token_generator():
        for chunk in llm.stream(messages):
            yield chunk.content or ""

    return StreamingResponse(token_generator(), media_type="text/plain")



@app.post("/calculate/exchange")
async def exchange_calculate(query: CalcQuery):
    messages = [
        SystemMessage(content="""
너는 환율 계산 도우미야. 사용자가 입력한 문장에서 '환율' 수치가 함께 주어진다면,
그 환율을 기준으로 달러 ↔ 원화 계산을 해줘.

예시:
- "10만원은 환율 1370원 기준 달러로 바꾸면?" → "100000 ÷ 1370 ≈ 72.99달러"
- "150달러는 환율 1320원 기준 원화로?" → "150 * 1320 = 198000원"
- "500달러를 환율 1420원으로 바꾸면?" → "500 * 1420 = 710000원"

항상 사용자가 말한 환율을 기준으로 계산해줘. 없으면 1350원으로 고정해도 돼.
"""),
        HumanMessage(content=query.question)
    ]

    def token_generator():
        for chunk in llm.stream(messages):
            yield chunk.content or ""

    return StreamingResponse(token_generator(), media_type="text/plain")




@app.post("/calculate/convert")
async def convert_calculate(query: CalcQuery):
    messages = [
        SystemMessage(content="""
너는 단위 변환 도우미야. 사용자의 요청에 따라 무게, 길이, 온도 등의 단위를 변환해줘.

다음 규칙에 따라 설명과 결과를 함께 알려줘:
- "1파운드는 몇 kg야?" → "1 파운드 ≈ 0.4536 kg"
- "100화씨는 섭씨로?" → "섭씨 = (100 - 32) × 5/9 = 37.78도"
- "3마일은 km로?" → "3마일 × 1.60934 = 4.828km"

가능한 단위 예시:
- 무게: 파운드, 킬로그램
- 길이: 마일, 킬로미터
- 온도: 섭씨, 화씨
- 부피: 갤런, 리터 등

항상 계산 과정을 간단히 보여준 뒤, 결과를 명확히 말해줘.
"""),
        HumanMessage(content=query.question)
    ]

    def token_generator():
        for chunk in llm.stream(messages):
            yield chunk.content or ""

    return StreamingResponse(token_generator(), media_type="text/plain")
