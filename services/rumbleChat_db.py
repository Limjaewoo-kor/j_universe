from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def save_chat_message(session_id: str, role: str, content: str):
    with SessionLocal() as db:
        db.execute(
            text("INSERT INTO chat_messages (session_id, role, content) VALUES (:sid, :r, :c)"),
            {"sid": session_id, "r": role, "c": content}
        )
        db.commit()

def load_last_messages(session_id: str, limit: int = 50):
    with SessionLocal() as db:
        result = db.execute(
            text("""
                SELECT role, content, created_at FROM chat_messages 
                WHERE session_id = :sid
                ORDER BY created_at DESC
                LIMIT :lim
            """),
            {"sid": session_id, "lim": limit}
        )
        # ✅ created_at도 함께 반환
        return [
            {"role": row[0], "content": row[1], "created_at": row[2]}
            for row in reversed(result.fetchall())
        ]
