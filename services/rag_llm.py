from glob import glob
import re
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate
from langchain.schema import Document
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field
from typing import Literal
import os
from dotenv import load_dotenv
from langchain_postgres.vectorstores import PGVector



# .env 로드
load_dotenv()

# Embedding 모델 및 DB 연결
embeddingModel = OpenAIEmbeddings(model='text-embedding-3-large')
CONNECTION_STRING = os.getenv("DATABASE_URL")


vectorstore = PGVector(
    connection=CONNECTION_STRING,
    embeddings=embeddingModel,
    collection_name="documents",
    use_jsonb=True
)

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
structured_llm_grader = model.with_structured_output(GradeDocuments)
grader_prompt = PromptTemplate.from_template("""
당신은 검색된 문서가 사용자 질문과 관련이 있는지 평가하는 평가자입니다.
문서에 사용자 질문과 관련된 키워드 또는 의미가 포함되어 있으면, 해당 문서를 관련성이 있다고 평가하십시오.
문서가 질문과 관련이 있는지 여부를 나타내기 위해 'yes' 또는 'no'로 이진 점수를 부여하십시오.

Retrieved document: {document}
User question: {question}
""")
retrieval_grader = grader_prompt | structured_llm_grader


def _generate_rag_sync(question: str) -> str:
    docs = retriever.invoke(question)
    filtered_docs = []
    for doc in docs:
        is_relevant = retrieval_grader.invoke({"question": question, "document": doc.page_content})
        if is_relevant.binary_score == "yes":
            filtered_docs.append(doc)
    if not filtered_docs:
        return "해당 질문과 관련된 정보를 찾을 수 없습니다."
    context = "\n\n".join([doc.page_content for doc in filtered_docs])
    response = rag_chain.invoke({"question": question, "context": context})
    return getattr(response, "content", str(response)).strip()


async def generate_rag_answer(question: str) -> str:
    return await run_in_threadpool(_generate_rag_sync, question)


def extract_qa_blocks(text):
    # "Q. ~ A. ~" 블록을 정규식으로 추출
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




# 청크사이즈와 청크 오버랩 기준으로 분할 + Chroma 사용 예시
# def create_rag() :
#     # http://localhost:8000/rag-create
#     pdf_files = glob('./data/*.pdf')
#
#     print(pdf_files)
#     embedding = OpenAIEmbeddings(model='text-embedding-3-large')
#     persist_directory = './chroma_store'
#
#     all_chunks = []
#     for pdf_path in pdf_files:
#         loader = PyPDFLoader(pdf_path)
#         docs = loader.load()
#
#         splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)
#         print(splitter)
#         chunks = splitter.split_documents(docs)
#         print(chunks)
#         all_chunks.extend(chunks)
#
#     vectorstore = Chroma.from_documents(
#         documents=all_chunks,
#         embedding=embedding,
#         persist_directory=persist_directory
#     )
