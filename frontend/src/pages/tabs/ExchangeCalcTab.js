import React, { useState } from 'react';

const ExchangeCalcTab = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const handleSubmit = async () => {
    setResult('');
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/calculate/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input }),
    });

    if (!response.body) {
      setResult('응답이 없습니다.');
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      setResult(prev => prev + chunk);
    }

    setLoading(false);
  };

  return (
      <>
        <h2 className="text-xl font-bold mb-4">💱 환율 계산기</h2>
        <input
            type="text"
            className="w-full p-3 rounded bg-gray-700 mb-4"
            placeholder="예: 150달러는 환율 1320원 기준으로 얼마야?"
            value={input}
            onChange={e => setInput(e.target.value)}
        />
        <p className="text-sm text-gray-400 mt-2">
          환율을 포함해서 입력하세요. (기본값은 달러당 1350원입니다.)
        </p>
        <br/>
        <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-yellow-500 px-4 py-2 rounded text-black font-semibold"
        >
          {loading ? '계산 중...' : '계산하기'}
        </button>
        {result && (
            <div className="mt-6 bg-gray-900 p-4 rounded font-mono whitespace-pre-wrap">
              <strong>결과:</strong><br/>{result}
            </div>
        )}
      </>
  );
};

export default ExchangeCalcTab;
