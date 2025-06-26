from typing import Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.recent_messages: list[str] = []

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        await self.broadcast_user_count()   # 추가: 접속자수 브로드캐스트

    async def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        await self.broadcast_user_count()   # 추가: 접속자수 브로드캐스트

    async def broadcast(self, message: str):
        # 최근 메시지 관리 (최대 50개)
        self.recent_messages.append(message)
        if len(self.recent_messages) > 50:
            self.recent_messages.pop(0)
        for connection in self.active_connections.values():
            await connection.send_text(message)

    async def broadcast_user_count(self):
        count = len(self.active_connections)
        for connection in self.active_connections.values():
            await connection.send_text(f"__usercount__:{count}")

    async def send_history(self, websocket: WebSocket):
        for msg in self.recent_messages:
            await websocket.send_text(msg)

manager = ConnectionManager()
