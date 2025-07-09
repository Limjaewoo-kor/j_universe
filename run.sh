#!/bin/bash
set -ex

pip install -r requirements.txt >> setup.log 2>&1
export $(cat .env | xargs)

nohup uvicorn main:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
