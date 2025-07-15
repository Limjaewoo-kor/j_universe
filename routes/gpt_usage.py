from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, date

from database import get_db
from services.middleware import ip_call_logs
from models.gpt_usage import GptUsage


router = APIRouter()

@router.get("/gpt-usage")
def get_remaining_usage(request: Request, db: Session = Depends(get_db)):
    now = datetime.now()
    today = date.today()
    user = getattr(request.state, "user", None)
    print(user)
    if user:
        usage = db.query(GptUsage).filter_by(user_id=user.id).first()
        if usage:
            if usage.last_used != today:
                return {"remaining": usage.daily_limit}
            return {
                "remaining": max(usage.daily_limit - usage.usage_count, 0)
            }
        else:
            return {"remaining": 10}  # 기본값

    else:
        ip = request.client.host
        max_calls = 10
        logs = ip_call_logs.get(ip, [])
        logs = [t for t in logs if now - t < timedelta(hours=24)]
        return {"remaining": max(max_calls - len(logs), 0)}

