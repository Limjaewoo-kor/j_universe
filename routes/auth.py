from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import user as user_schema
from models import user as user_model
from passlib.context import CryptContext
from auth.jwt_handler import create_access_token
from .token import get_current_user
from database import get_db

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 회원가입
@router.post("/signup")
def signup(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    # 이메일 중복 확인
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 비밀번호 해싱 후 사용자 저장
    hashed_pw = pwd_context.hash(user.password)
    new_user = user_model.User(email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "Signup successful", "user": new_user.email}

# 로그인
@router.post("/login")
def login(form_data: user_schema.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter(user_model.User.email == form_data.email).first()

    if not db_user or not pwd_context.verify(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 로그인 성공 시 토큰 발급
    token = create_access_token(data={"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

# 로그인한 사용자 정보 반환
@router.get("/me")
def get_user_info(current_user: user_model.User = Depends(get_current_user)):
    return {"email": current_user.email, "id": current_user.id}
