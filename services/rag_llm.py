from glob import glob
import re
import os
from typing import AsyncGenerator, Literal
from pydantic import BaseModel, Field

from langchain_core.prompts import PromptTemplate
from langchain_core.messages import AIMessage
from langchain.schema import Document
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_postgres.vectorstores import PGVector



# .env 로드
try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass

# Embedding 모델 및 DB 연결
embeddingModel = OpenAIEmbeddings(model='text-embedding-3-large')
CONNECTION_STRING = os.getenv("DATABASE_URL")


vectorstore = PGVector(
    connection=CONNECTION_STRING,
    embeddings=embeddingModel,
    collection_name="documents",
    use_jsonb=True
)

#최초 실행 시 초기화쿼리
vectorstore.create_tables_if_not_exists()
vectorstore.create_collection()

retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# GPT 모델
model = ChatOpenAI(model="gpt-4o")

# RAG 프롬프트
rag_generate_system = """
너는 디지몬 슈퍼럼블 게임의 전문가로서, 주어진 context를 참고하여 질문에 답변한다.
반드시 질문과 동일한 언어(한국어, 영어, 일본어 등)로 답변하라.
질문 언어로 반드시 답변하며, context에 같은 아이템의 한글/영문/일어 이름이 다르게 표기되어 있더라도
질문과 문서의 의미가 같으면 질문 언어로 자연스럽게 번역해서 답변하라.

예시:
- (한국어 질문) 발두르몬의 깃털이 뭐야?
  → 발두르몬의 깃털은 워그레이몬과 메탈가루몬을 오메가몬으로 진화할 때 사용합니다.
- (영어 질문) What is Baldurmon's feather?
  → Baldurmon's feather is used to evolve WarGreymon and MetalGarurumon into Omegamon.

아래 질문에 답하라.

질문: {question}
context: {context}
답변:
"""



rag_prompt = PromptTemplate(
    input_variables=["question", "context"],
    template=rag_generate_system
)
rag_chain = rag_prompt | model

# 문서 relevance 프롬프트 평가 체인
class GradeDocuments(BaseModel):
    binary_score: Literal["yes", "no"] = Field(
        description="문서가 질문과 관련이 있는지 여부를 'yes' 또는 'no'로 평가합니다."
    )

grader_prompt = PromptTemplate.from_template("""
당신은 검색된 문서가 사용자 질문과 관련이 있는지 평가하는 평가자입니다.
문서에 사용자 질문과 관련된 키워드 또는 의미가 포함되어 있으면, 해당 문서를 관련성이 있다고 평가하십시오.
문서가 질문과 관련이 있는지 여부를 나타내기 위해 'yes' 또는 'no'로 이진 점수를 부여하십시오.

Retrieved document: {document}
User question: {question}
""")

structured_llm_grader = model.with_structured_output(GradeDocuments)
retrieval_grader = grader_prompt | structured_llm_grader


# 비동기 RAG 응답 스트리밍
async def generate_rag_answer_stream(question: str) -> AsyncGenerator[str, None]:
    docs = retriever.invoke(question)
    filtered_docs = []

    for doc in docs:
        result = retrieval_grader.invoke({"question": question, "document": doc.page_content})
        if result.binary_score == "yes":
            filtered_docs.append(doc)

    if not filtered_docs:
        yield "해당 질문과 관련된 정보를 찾을 수 없습니다."
        return

    context = "\n\n".join([doc.page_content for doc in filtered_docs])

    async for chunk in rag_chain.astream({"question": question, "context": context}):
        if isinstance(chunk, AIMessage):
            yield chunk.content
        else:
            yield str(chunk)



# PDF에서 Q/A 블록 추출 및 RAG DB 구축
def extract_qa_blocks(text):
    pattern = r'Q\..*?A\..*?(?=Q\.|$)'
    return re.findall(pattern, text, re.DOTALL)

def create_rag():
    pdf_files = glob('./data/*.pdf')
    all_chunks = []

    for pdf_path in pdf_files:
        loader = PyPDFLoader(pdf_path)
        pages = loader.load()
        for page in pages:
            qa_blocks = extract_qa_blocks(page.page_content)
            for block in qa_blocks:
                doc = Document(page_content=block.strip(), metadata=page.metadata)
                all_chunks.append(doc)

    vectorstore.add_documents(all_chunks)
    print(f"총 {len(all_chunks)}개의 QA 문서 블록을 저장했습니다.")


