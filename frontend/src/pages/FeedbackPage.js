// src/pages/FeedbackPage.js

import React, {useEffect, useState, useContext, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserInputContext } from '../contexts/UserInputContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [sortMethod, setSortMethod] = useState('like');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { setPurpose, setInputText, setTone, setResultText } = useContext(UserInputContext);


  const loadFeedback = useCallback(() => {
    const stored = JSON.parse(localStorage.getItem('feedback') || '[]');
    const sorted = sortFeedback(stored, sortMethod);
    setFeedback(sorted);
  }, []);

  useEffect(() => {
    loadFeedback();
  }, [sortMethod]);

  const sortFeedback = (data, method) => {
    const sorted = [...data];
    if (method === 'like') {
      return sorted.sort((a, b) => {
        if (a.liked === b.liked) return new Date(b.timestamp) - new Date(a.timestamp);
        return b.liked - a.liked;
      });
    } else {
      return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  };

  const deleteFeedback = (index) => {
    const updated = feedback.filter((_, i) => i !== index);
    localStorage.setItem('feedback', JSON.stringify(updated));
    setFeedback(sortFeedback(updated, sortMethod));
  };

  const deleteAllFeedback = () => {
    if (!window.confirm('정말 모든 피드백을 삭제하시겠습니까?')) return;
    localStorage.removeItem('feedback');
    setFeedback([]);
  };

  const getChartData = () => {
    const like = feedback.filter(f => f.liked).length;
    const dislike = feedback.length - like;
    return [
      { name: '좋아요', value: like },
      { name: '싫어요', value: dislike },
    ];
  };

  const COLORS = ['#38bdf8', '#f87171'];

  const filteredFeedback = feedback.filter(f =>
    f.inputText.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10 flex flex-col items-center text-gray-800 dark:text-white">
    <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">
      사용자 피드백
    </h2>

    {/* 상단 컨트롤 영역 */}
    <div className="flex flex-wrap justify-between items-center gap-4 w-full max-w-3xl mb-6">
      <div>
        <label className="text-sm mr-2">정렬:</label>
        <select
          value={sortMethod}
          onChange={(e) => setSortMethod(e.target.value)}
          className="py-1 px-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="like">👍 좋아요 우선</option>
          <option value="time">🕒 최신순</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="입력문장 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="py-1 px-4 border border-gray-300 dark:border-gray-600 rounded w-full sm:w-64 dark:bg-gray-800 dark:text-white"
      />

      {feedback.length > 0 && (
        <button
          onClick={deleteAllFeedback}
          className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded shadow ring-1 ring-red-300"
        >
          🗑️ 전체 삭제
        </button>
      )}
    </div>

    {/* 피드백 통계 차트 */}
    {feedback.length > 0 && (
      <div className="w-full max-w-md h-64 mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={getChartData()}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {getChartData().map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: '0.5rem' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )}

    {/* 피드백 목록 */}
    {filteredFeedback.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">
        조건에 맞는 피드백이 없습니다.
      </p>
    ) : (
      <ul className="w-full max-w-3xl space-y-6">
        {filteredFeedback.map((item, idx) => (
          <li
            key={idx}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
          >
            {/* ❌ 개별 삭제 버튼 */}
            <button
              onClick={() => deleteFeedback(idx)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              title="삭제"
            >
              ❌
            </button>

            <p className={`font-semibold mb-2 ${item.liked ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {item.liked ? '👍 좋아요' : '👎 싫어요'}
            </p>

            <p className="mb-1 text-gray-700 dark:text-gray-200"><strong>🎯 목적:</strong> {item.purpose}</p>
            <p className="mb-1 text-gray-700 dark:text-gray-200"><strong>📝 입력:</strong> {item.inputText}</p>
            <p className="mb-1 text-gray-700 dark:text-gray-200"><strong>🎤 말투:</strong> {item.tone}</p>
            <p className="mb-3 whitespace-pre-line text-gray-700 dark:text-gray-200"><strong>✅ 결과:</strong><br />{item.resultText}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {new Date(item.timestamp).toLocaleString()}
            </p>

            <button
              onClick={() => {
                setPurpose(item.purpose);
                setInputText(item.inputText);
                setTone(item.tone);
                setResultText('');
                navigate('/result');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
            >
              다시 사용하기
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

}

export default FeedbackPage;
