# services/middleware.py

from datetime import datetime, timedelta, date

# → 여기만 한 개만 정의
ip_call_logs: dict[str, list[datetime]] = {}
GPT_PROTECTED_PATHS = [
    "/generate",
    "/calculate/stream",
    "/calculate/split",
    "/calculate/interest",
    "/calculate/exchange",
    "/calculate/convert",
    "/rag-chat",
]
