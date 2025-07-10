# middleware.py
from fastapi import Request, HTTPException
from datetime import datetime, timedelta

# 간단한 메모리 캐시 (Redis로 대체 가능)
ip_call_logs = {}

async def rate_limit_middleware(request: Request, call_next):
    ip = request.client.host
    now = datetime.now()
    window = timedelta(hours=24)
    max_calls = 25

    logs = ip_call_logs.get(ip, [])
    logs = [t for t in logs if now - t < window]
    if len(logs) >= max_calls:
        raise HTTPException(status_code=429, detail="일일 GPT 사용 횟수를 초과하였습니다.")
    logs.append(now)
    ip_call_logs[ip] = logs

    response = await call_next(request)
    return response
