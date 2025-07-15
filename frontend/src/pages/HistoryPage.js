import React, { useEffect, useState } from 'react';

function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('messageHistory') || '[]');
    setHistory(stored);
  }, []);

  const handleClearHistory = () => {
    if (!window.confirm('정말로 모든 히스토리를 삭제하시겠습니까?')) return;
    localStorage.removeItem('messageHistory');
    setHistory([]);
  };

  const handleDeleteItem = (indexToDelete) => {
    const updated = history.filter((_, idx) => idx !== indexToDelete);
    localStorage.setItem('messageHistory', JSON.stringify(updated));
    setHistory(updated);
  };

return (
  <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 px-6 py-12 flex flex-col items-center text-gray-800 dark:text-white">
    <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-6 text-center drop-shadow">
      📜 저장된 문장 히스토리(쿠키)
    </h2>

    {history.length > 0 && (
      <button
        onClick={handleClearHistory}
        className="mb-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl shadow transition ring-2 ring-red-300"
      >
        🗑️ 전체 삭제
      </button>
    )}

    {history.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-300">저장된 문장이 없습니다.</p>
    ) : (
      <ul className="w-full max-w-3xl space-y-6">
        {history.map((item, idx) => (
          <li
            key={idx}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-blue-100 dark:border-gray-700 transition hover:shadow-lg"
          >
            {/* ❌ 개별 삭제 버튼 */}
            <button
              onClick={() => handleDeleteItem(idx)}
              className="absolute top-3 right-4 text-red-500 hover:text-red-700 text-sm"
              title="삭제"
            >
              ❌
            </button>

            <p className="mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">🎯 목적:</span> {item.purpose}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">📝 입력:</span> {item.inputText}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">🎤 말투:</span> {item.tone}
            </p>
            <p className="mb-2 whitespace-pre-line">
              <span className="font-semibold text-gray-700 dark:text-gray-200">✅ 결과:</span><br />
              {item.resultText}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

}

export default HistoryPage;
