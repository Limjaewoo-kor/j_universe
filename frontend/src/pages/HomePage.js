// HomePage.js
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Buymeacoffee from '../components/buymeacoffee';
import heroImage from '../assets/hero-writing.svg'; // 이미지 파일 위치
import { checkLocalGptLimit, getRemainingGptCalls } from "../utils/checkLocalGptLimit";

export default function HomePage() {
  const navigate = useNavigate();
  const [remainingCalls, setRemainingCalls] = useState(10);
  const handleStartClick = () => {
    navigate('/purpose');
  };
  useEffect(() => {
    setRemainingCalls(getRemainingGptCalls());
  }, []);

  return (
      <div
          className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen px-2 sm:px-4 py-8 sm:py-12 text-gray-800 dark:text-white">
        <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto mb-12 md:mb-16">
          {/* 이미지 왼쪽 */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <img
                src={heroImage}
                alt="AI writing"
                className="w-4/5 max-w-xs sm:max-w-md md:max-w-sm"
            />
          </div>
          {/* 텍스트 오른쪽 */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-700 dark:text-blue-300 mb-4 sm:mb-6 drop-shadow">
              말해조 🗣️
            </h1>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              핵심만 입력하면, AI가<br/>
              정중하고 자연스러운 문장을 완성해드립니다.
            </p>
            <button
                onClick={handleStartClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-xl shadow-lg ring-2 ring-blue-300 transition"
            >
              👉 지금 시작하기
            </button>
          </div>
        </section>

        {/* 💡 기능 미리보기 Section */}
        <section className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">말해조는 이렇게 작동해요</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              ['🎯', '목적 선택', '요청/문의/감사 등'],
              ['✍️', '문장 입력', '핵심만 간단히 작성'],
              ['🎨', '톤 설정', '공손/중립/친근 등'],
              ['✨', '문장 생성', 'AI가 자동 완성!'],
            ].map(([emoji, title, desc]) => (
                <div
                    key={title}
                    className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow-md flex flex-col items-center"
                >
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{emoji}</div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base">{title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">{desc}</p>
                </div>
            ))}
          </div>
        </section>

        {/* 💬 말풍선 대화 예시 */}
        <section className="max-w-3xl mx-auto mb-12 sm:mb-20">
          <h2 className="text-base sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">예시
            대화</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start">
              <div
                  className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white px-3 py-2 rounded-xl max-w-[90%] sm:max-w-[75%] text-xs sm:text-base">
                안녕하세요 OOO입니다.
                이번 시험에 대한 결과는 평소보다 좀 더 빠르게 받아보고싶어요. 최대한 빨리 받아본다면 언제쯤 될까요?
              </div>
            </div>
            <div className="flex items-start justify-end">
              <div
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-xl max-w-[90%] sm:max-w-[75%] text-xs sm:text-base">
                안녕하세요 OOO입니다.
                이번 시험 결과를 평소보다 조금 더 빠르게 받아보고 싶습니다.
                가능한 한 빠른 시일 내에 결과를 받아볼 수 있다면,
                대략 언제쯤 가능할지 알려주시면 감사하겠습니다.
              </div>
            </div>
            <div className="flex items-start">
              <div
                  className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white px-3 py-2 rounded-xl max-w-[90%] sm:max-w-[75%] text-xs sm:text-base">
                어제 있었던 커피를 쏟은 일은 제가 잘못했습니다.
              </div>
            </div>
            <div className="flex items-start justify-end">
              <div
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-xl max-w-[90%] sm:max-w-[75%] text-xs sm:text-base">
                어제 커피를 쏟은 일에 대해 사과드리며, 제 불찰로 인행 불편을 드린 점 진심으로 사과드립니다. 앞으로 더욱 주의하겠습니다.
              </div>
            </div>
          </div>
        </section>
        {/* 남은 GPT 횟수 표시 */}
        <p className="text-sm mb-2 text-yellow-500 font-semibold text-center">
          📌 오늘 남은 문장 생성 사용 가능 횟수: {remainingCalls}회
        </p>
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
        <div style={{textAlign: "center", padding: '30px 20px'}}>
          {/* 콘텐츠 */}
          <Buymeacoffee/>
        </div>
      </div>
  );
}
