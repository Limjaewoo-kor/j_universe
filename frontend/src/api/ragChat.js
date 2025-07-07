// api/ragChat.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function askRagChatStream(question, onChunk) {
  const response = await fetch(`${API_BASE_URL}/rag-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (response.status === 429) {
    throw new Error("429: Too many requests");
  }

  if (!response.ok) {
    throw new Error(`서버 오류: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("No response body for stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let partial = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    partial += chunk;
    onChunk(partial); // 누적된 전체 텍스트 전달
  }

  return partial;
}
