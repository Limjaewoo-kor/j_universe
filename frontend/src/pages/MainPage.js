import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Buymeacoffee from "../components/buymeacoffee";
import FeedbackForm from "../components/FeedbackForm";

const menuList = [
  { label: "말해조(Malhaejo)", to: "/home", description: "사용자가 핵심 내용을 입력하면, 정중하고 공손한 비즈니스 문장 또는 민원 문서를 자동으로 생성해주는 AI 문장 생성 도우미입니다." },
  { label: "Rumble Chatbot", to: "/chat", description: "디지몬슈퍼럼블 가이드를 위해 직접 플레이하며 만든 비공식 챗봇으로 게임 정보 등의 질문에 대응합니다. 공식 디지몬슈퍼럼블 개발사와는 관련이 없습니다." },
  { label: "계산해(CalcForMe)", to: "/calc-helper", description: "사용자가 자연어로 입력한 계산(예: \"23500원을 30% 할인한 금액을 알려줘\")을 숫자로 변환하여 계산해주는 AI 계산기입니다." },
  { label: "두뇌트레이너(Brain Trainer)", to: "/brain-trainer", description: "10대 ~ 70대 연령별 사용자를 위한 상식, 산수, 기억력 기반의 일일 퀴즈 훈련 프로그램입니다. 가볍게 두뇌를 자극하세요!" },
  { label: "Empty", to: "/", description: "준비 중인 서비스" },
  { label: "Empty", to: "/", description: "준비 중인 서비스" },
  { label: "Empty", to: "/", description: "준비 중인 서비스" },
  { label: "Empty", to: "/", description: "준비 중인 서비스" },
];

export default function MainPage() {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen justify-center px-4 py-10 bg-gray-900 text-white">
      <h1 className="text-4xl sm:text-6xl font-bold mb-12 tracking-widest">J_Universe</h1>
      <button
          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => setShowFeedback(true)}>
        Feedback
      </button>
        <br/>
      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)}/>}
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {menuList.map((menu, idx) => (
          <div
            key={idx}
            className="flex items-center bg-gray-800 rounded-xl p-4 border border-gray-700 hover:bg-gray-700 transition"
          >
            <button
              className="w-32 h-12 sm:h-14 text-sm sm:text-base font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition shrink-0"
              onClick={() => navigate(menu.to)}
            >
              {menu.label.includes('(')
                ? menu.label.split('(')[0]
                : menu.label}
            </button>
            <div className="ml-4 text-left">
              <div className="text-base sm:text-lg font-semibold">{menu.label}</div>
              <div className="text-sm text-gray-400">{menu.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-10">
        <Buymeacoffee />
      </div>
    </div>
  );
}
