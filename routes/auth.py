from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import user as user_schema
from models import user as user_model, gpt_usage
from passlib.context import CryptContext
from auth.jwt_handler import create_access_token
from database import get_db
from fastapi.security import OAuth2PasswordBearer
from auth.jwt_handler import decode_access_token
from models.user import User

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
    new_user = user_model.User(
        email=user.email,
        hashed_password=hashed_pw,
        nickname=user.nickname
    )
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

    token = create_access_token(data={"sub": db_user.email})

    # GPT 사용 횟수 조회
    usage = db.query(gpt_usage.GptUsage).filter(gpt_usage.GptUsage.user_id == db_user.id).first()
    usage_count = usage.usage_count if usage else 0
    daily_limit = usage.daily_limit if usage else 25  # 기본값 25

    return {
        "access_token": token,
        "token_type": "bearer",
        "usage_count": usage_count,
        "daily_limit": daily_limit,
        "email": db_user.email,
        "nickname": db_user.nickname
    }



# 로그인한 사용자 정보 반환
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    email = decode_access_token(token)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "email": user.email,
        "nickname": user.nickname
    }
