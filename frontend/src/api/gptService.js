const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export async function generatePoliteMessage({ purpose, inputText, tone, length, emoji }) {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      purpose,
      input: inputText,
      tone,
      length,
      emoji,
    }),
  });

  if (!response.ok) {
    throw new Error('GPT API 호출 실패');
  }

  const data = await response.json();
  return data.result;
}
