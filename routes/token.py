# routes/token.py
from fastapi import HTTPException, Depends, status
from jose import JWTError, jwt
from datetime import datetime, timedelta
from models import user as user_model
from sqlalchemy.orm import Session
from database import get_db
import os
from fastapi.security import OAuth2PasswordBearer

# OAuth2PasswordBearer를 사용해 토큰을 가져옵니다
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 토큰을 검증하고 사용자 정보를 반환하는 함수
def verify_token(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        db_user = db.query(user_model.User).filter(user_model.User.email == user_email).first()
        if db_user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return db_user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# 현재 사용자 정보를 가져오는 의존성 함수
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        user = db.query(user_model.User).filter(user_model.User.email == email).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")