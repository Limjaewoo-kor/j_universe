// api/ragChat.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function askRagChat(question) {
  const response = await fetch(`${API_BASE_URL}/rag-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const data = await response.json();
  return data.answer;
}
