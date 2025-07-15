# from starlette.middleware.base import BaseHTTPMiddleware
# from fastapi import Request
# from auth.jwt_handler import decode_access_token  # 이미 구현됨
# from database import get_db
# from models.user import User
# from sqlalchemy.orm import Session
#
# class AuthMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request: Request, call_next):
#         authorization: str = request.headers.get("Authorization")
#         request.state.user = None  # 항상 초기화
#         print(">>> AuthMiddleware header:", request.headers.get("authorization"))
#
#
#         if authorization and authorization.startswith("Bearer "):
#             token = authorization.split(" ")[1]
#             try:
#                 email = decode_access_token(token)  # 이메일 반환
#                 if email:
#                     db: Session = next(get_db())
#                     user = db.query(User).filter(User.email == email).first()
#                     if user:
#                         request.state.user = user  # 사용자 설정
#             except Exception as e:
#                 print("❌ Token decoding failed:", e)
#                 pass  # 실패해도 비회원으로 간주
#
#         # 실패 시에도 계속 진행 (비회원 요청 허용)
#         return await call_next(request)
