#!/bin/bash

# 가상환경 또는 Python3 명시적으로 사용
pip install -r requirements.txt

# .env 파일이 존재하는 경우 환경 변수 적용 (옵션)
export $(cat .env | xargs)

# FastAPI 앱 실행 (main.py 기준으로)
uvicorn main:app --host 0.0.0.0 --port 8000
