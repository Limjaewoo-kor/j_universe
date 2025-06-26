const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws/chat";

export function createWebSocketConnection(onMessageReceived) {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
        let msg = event.data;
        let parsed = null;
        try {
            parsed = JSON.parse(msg);
        } catch {
            // JSON이 아니면 일반 텍스트로 처리
            parsed = msg;
        }
        onMessageReceived(parsed);
    };

    socket.onclose = () => {
        console.log("Disconnected from WebSocket");
    };

    return socket;
}
