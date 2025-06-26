import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-writing.svg'; // 이미지 파일 위치

export default function HomePage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/purpose');
  };

 return (
  <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen px-4 sm:px-8 py-12 text-gray-800 dark:text-white">

    {/* 🧠 Hero Section */}
    <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto mb-16">
      {/* 이미지 왼쪽 */}
      <div className="md:w-1/2 mb-10 md:mb-0">
        <img
          src={heroImage}
          alt="AI writing"
          className="w-full max-w-sm sm:max-w-md mx-auto"
        />
      </div>

      {/* 텍스트 오른쪽 */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 dark:text-blue-300 mb-6 drop-shadow">
          말해조 🗣️
        </h1>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          핵심만 입력하면, AI가<br />
          정중하고 자연스러운 문장을 완성해드립니다.
        </p>
        <button
          onClick={handleStartClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg ring-2 ring-blue-300 transition"
        >
          👉 지금 시작하기
        </button>
      </div>
    </section>

    {/* 💡 기능 미리보기 Section */}
    <section className="max-w-5xl mx-auto text-center mb-20">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">말해조는 이렇게 작동해요</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          ['🎯', '목적 선택', '요청/문의/감사 등'],
          ['✍️', '문장 입력', '핵심만 간단히 작성'],
          ['🎨', '톤 설정', '공손/중립/친근 등'],
          ['✨', '문장 생성', 'AI가 자동 완성!'],
        ].map(([emoji, title, desc]) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center"
          >
            <div className="text-3xl mb-2">{emoji}</div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* 💬 말풍선 대화 예시 */}
    <section className="max-w-3xl mx-auto mb-20">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">예시 대화</h2>
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white px-4 py-2 rounded-xl max-w-[75%]">
            안녕하세요 OOO입니다.
            이번 시험에 대한 결과는 평소보다 좀 더 빠르게 받아보고싶어요. 최대한 빨리 받아본다면 언제쯤 될까요?
          </div>
        </div>
        <div className="flex items-start justify-end">
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-xl max-w-[75%]">
            안녕하세요 OOO입니다.
            이번 시험 결과를 평소보다 조금 더 빠르게 받아보고 싶습니다.
            가능한 한 빠른 시일 내에 결과를 받아볼 수 있다면,
            대략 언제쯤 가능할지 알려주시면 감사하겠습니다.
          </div>
        </div>
        <br/>
        <div className="flex items-start">
          <div className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white px-4 py-2 rounded-xl max-w-[75%]">
            어제 있었던 커피를 쏟은 일은 제가 잘못했습니다.
          </div>
        </div>
        <div className="flex items-start justify-end">
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-xl max-w-[75%]">
            어제 커피를 쏟은 일에 대해 사과드리며, 제 불찰로 인행 불편을 드린 점 진심으로 사과드립니다. 앞으로 더욱 주의하겠습니다.
          </div>
        </div>
      </div>
    </section>
  </div>
);

}
