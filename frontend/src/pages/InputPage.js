import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserInputContext } from '../contexts/UserInputContext';

function InputPage() {
  const navigate = useNavigate();
  const { inputText, setInputText } = useContext(UserInputContext);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!inputText.trim()) {
      setError('문장을 입력해주세요.');
      return;
    }
    setError('');
    navigate('/tone');
  };

  return (
      <div
          className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white flex flex-col items-center px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-4 text-center drop-shadow">
              전달하고 싶은 핵심 문장을 입력해주세요
          </h2>

          {/* 예시 박스 */}
          <div
              className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm sm:text-base rounded-xl px-4 py-3 mb-6 max-w-xl shadow-sm">
              예시: <span className="text-gray-800 dark:text-white font-medium">"택배가 일주일째 도착하지 않았습니다"</span>
          </div>

          {/* 입력 박스 */}
          <textarea
              rows="5"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="여기에 문장을 입력하세요..."
              className="w-full max-w-xl p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-base rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <button
              onClick={handleNext}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg ring-2 ring-blue-300 transition"
          >
              👉 다음 단계로 이동
          </button>
          <br/>
          <p style={{
              fontSize: "0.9em",
              color: "gray",
              fontWeight: "bold",
              textAlign: "center"
          }}>
              일정 시간 사용하지 않으면 간혹 챗봇이 동작하지 않는 경우가 있습니다.<br/>
              새로고침 후 다시 시도해 주세요.
              <br/>
              If you don't use it for a certain period of time, the chatbot may not work. <br/>
              Please refresh and try again.
          </p>
      </div>
  );
}

export default InputPage;
