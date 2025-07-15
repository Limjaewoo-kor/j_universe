from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import date
from database import Base  # SQLAlchemy Base 클래스 (보통 db.py 등에 정의)

class GptUsage(Base):
    __tablename__ = "gpt_usage"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    last_used = Column(Date, nullable=False, default=date.today)
    usage_count = Column(Integer, nullable=False, default=0)
    daily_limit = Column(Integer, nullable=False, default=25)

    # 관계 설정 (선택적)
    user = relationship("User", back_populates="gpt_usage", lazy="joined")
