# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# .env 파일에서 환경 변수 로드
try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass

DATABASE_URL = os.getenv("DATABASE_URL")

# 데이터베이스 엔진 생성
engine = create_engine(DATABASE_URL)

# 세션 로컬 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 데이터베이스 모델의 기본 클래스
Base = declarative_base()

# 데이터베이스 세션을 가져오는 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db  # 데이터베이스 세션을 반환
    finally:
        db.close()  # 세션을 닫음
