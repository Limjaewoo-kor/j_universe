import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserInputContext } from '../contexts/UserInputContext';

function TonePage() {
  const navigate = useNavigate();
  const { tone, setTone } = useContext(UserInputContext);
  const [selectedTone, setSelectedTone] = useState(tone || '');
  const [error, setError] = useState('');
  const [length, setLength] = useState('중간');
  const [emoji, setEmoji] = useState(false);

  const toneOptions = [
    '아주 공손하게',
    '중립적인 톤으로',
    '딱딱한 비즈니스 어조로',
    '친근하게',
  ];

  const handleGenerate = () => {
    if (!selectedTone) {
      setError('말투를 선택해주세요.');
      return;
    }
    setTone(selectedTone);
    navigate('/result', {
      state: { length, emoji },
    });
  };

return (
    <div
        className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center px-6 py-12 text-gray-800 dark:text-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-8 text-center drop-shadow">
        어떤 말투로 작성할까요?
      </h2>

      {/* 말투 선택 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-10">
        {toneOptions.map((option) => (
            <button
                key={option}
                onClick={() => setSelectedTone(option)}
                className={`py-4 px-6 rounded-2xl text-base font-semibold transition shadow-md ${
                    selectedTone === option
                        ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                        : 'bg-white text-gray-800 hover:bg-blue-100 dark:bg-gray-700 dark:text-white dark:hover:bg-blue-600'
                }`}
            >
              {option}
            </button>
        ))}
      </div>

      {/* 문장 길이 / 이모지 옵션 */}
      <div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg p-6 w-full max-w-xl mb-6">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">세부 옵션</h4>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">문장 길이</label>
          <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="짧게">짧게</option>
            <option value="중간">중간</option>
            <option value="길게">길게</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">이모지 포함</label>
          <label className="inline-flex items-center">
            <input
                type="checkbox"
                checked={emoji}
                onChange={(e) => setEmoji(e.target.checked)}
                className="w-5 h-5 mr-2"
            />
            이모지를 문장에 포함할래요 😄
          </label>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
          onClick={handleGenerate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg ring-2 ring-blue-300 transition"
      >
        👉 문장 생성하기
      </button>
      <br/>
      <p style={{
        fontSize: "0.9em",
        color: "gray",
        fontWeight: "bold",
        textAlign: "center"
      }}>
        일정 시간 사용하지 않으면 간혹 기능이 동작하지 않는 경우가 있습니다.<br/>
        약 2~3분 후에 화면을 새로고침 하신 후 다시 시도해 주세요.
        <br/>
        If you do not use it for a certain period of time, the function may not work occasionally.<br/>
        Please refresh the screen after about 2-3 minutes and try again.
      </p>
    </div>
);

}

export default TonePage;
