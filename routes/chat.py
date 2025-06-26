import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from utils.connection_manager import manager

router = APIRouter()

@router.websocket("/ws/chat")
async def chat_websocket_endpoint(websocket: WebSocket):
    # 사용자 임시 ID 생성
    user_id = str(uuid.uuid4())[:6]  # UUID 앞 6자리만 사용 (예: 5783bf)
    await manager.connect(websocket, user_id)

    # 1. 최초 ID 전송
    await websocket.send_text(f"__id__:{user_id}")
    # 2. 기존 대화내역 전송
    await manager.send_history(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            message_with_id = f"{user_id} : {data}"
            await manager.broadcast(message_with_id)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, user_id)
