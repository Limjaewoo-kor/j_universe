#!/bin/bash
set -ex  # 오류 발생 시 종료, 명령 출력

pip install -r requirements.txt
export $(cat .env | xargs)

uvicorn main:app --host 0.0.0.0 --port 8000
