from sqlalchemy import Column, Integer, String, Text, DateTime, func
from database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True, index=True)
    project = Column(String(50), nullable=False)
    username = Column(String(50), nullable=True)
    feedback_text = Column(Text, nullable=False)
    type = Column(String(30), nullable=True)  # ← 여기 추가!
    created_at = Column(DateTime, server_default=func.now())
