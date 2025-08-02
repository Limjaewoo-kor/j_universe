from fastapi import APIRouter, Request
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()

router = APIRouter()

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

@router.post("/brain-trainer/quiz")
async def generate_quiz(request: Request):
    body = await request.json()
    age_group = body.get("ageGroup", "50대")
    quiz_types = body.get("quizTypes", ["상식", "산수", "이야기 기억력"])
    difficulty = body.get("difficulty", "보통")

    types_text = "\n".join([f"- {t}" for t in quiz_types])

    # 예시 문제 생성
    example_problems = {
        "상식": {
            "type": "상식",
            "question": "대한민국의 수도는 어디인가요?",
            "choices": ["서울", "부산", "대전", "대구"],
            "answer": "서울"
        },
        "산수": {
            "type": "산수",
            "question": "15 더하기 27은?",
            "choices": ["32", "40", "42", "45"],
            "answer": "42"
        },
        "이야기 기억력": {
            "type": "이야기 기억력",
            "passage": "민수는 도서관에 가서 책을 세 권 빌렸습니다.",
            "question": "민수는 어디에 갔나요?",
            "choices": ["서점", "도서관", "학교", "영화관"],
            "answer": "도서관"
        }
    }

    examples = ",\n  ".join([
        json.dumps(example_problems[t], ensure_ascii=False, indent=2)
        for t in quiz_types if t in example_problems
    ])

    # 이중 중괄호 없이 순수 문자열 프롬프트
    prompt_text = f"""
    {age_group}를 위한 퀴즈 5개를 만들어주세요. 각 문제는 다음 중 하나의 유형을 가져야 합니다:
    {types_text}
    
    문제 난이도는 "{difficulty}" 수준에 맞게 설정해주세요.
    
    아래 형식에 맞게 JSON 배열로 출력해주세요:
    
    [
        {examples}
    ]
    
    주의사항:
    - 반드시 JSON 형식을 지켜주세요.
    - 각 문제는 명확하고 중복되지 않도록 해주세요.
    - "이야기 기억력" 유형의 문제는 짧은 이야기 형식의 문장을 포함해야 하며, 정답은 반드시 지문 속에 실제로 등장한 내용 중 하나여야 합니다.
    - 정답은 지문에 등장한 요소 중 하나여야 합니다.
    - "이야기 기억력" 유형은 반드시 다음 필드를 포함해야 합니다:
    - "passage": 짧은 이야기 지문 (1~3문장)
    - "question": 지문을 바탕으로 기억력을 요하는 질문
    - 문제 난이도는 나이가 60대 이상은 쉽고 친숙하게, 그 외에는 적당히 나이에 맞게 조절해주세요.
    """

    MAX_RETRIES = 3

    for attempt in range(MAX_RETRIES):
        try:
            result = llm.invoke(prompt_text)
            content = result.content.strip()  # AIMessage에서 content 추출

            if "```" in content:
                content = content.split("```")[-1]

            questions = json.loads(content)

            if (
                isinstance(questions, list)
                and all(
                    isinstance(q, dict)
                    and "type" in q
                    and "question" in q
                    and "choices" in q
                    and "answer" in q
                    and (q["type"] != "이야기 기억력" or "passage" in q)
                    for q in questions
                )
            ):
                return {"questions": questions}

            raise ValueError("퀴즈 JSON 구조 검증 실패")

        except Exception as e:
            print(f"[RETRY {attempt+1}] 오류 발생: {e}")

    return {
        "questions": [{
            "type": "상식",
            "question": "문제를 생성하는 데 실패했습니다.",
            "choices": [],
            "answer": ""
        }]
    }
