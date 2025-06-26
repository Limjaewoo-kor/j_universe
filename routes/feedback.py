from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.feedback import Feedback
from schemas.feedback import FeedbackCreate, FeedbackRead
from database import get_db

router = APIRouter()

@router.post("/feedback", response_model=FeedbackRead)
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = Feedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/feedbacks", response_model=list[FeedbackRead])
def get_feedbacks(db: Session = Depends(get_db)):
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()
