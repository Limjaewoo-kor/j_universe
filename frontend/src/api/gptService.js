const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export async function generatePoliteMessage({ purpose, inputText, tone, length, emoji }) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({
      purpose,
      input: inputText,
      tone,
      length,
      emoji,
    }),
  });

  if (response.status === 429) {
    throw new Error("429: Too many requests");
  }

  if (!response.ok) {
    throw new Error(`서버 오류: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}
