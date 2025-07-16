from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

# models/user.py
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nickname = Column(String(50))

    gpt_usage = relationship("GptUsage", uselist=False, back_populates="user")
