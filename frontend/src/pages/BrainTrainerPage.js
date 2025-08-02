import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import FeedbackForm from "../components/FeedbackForm";
import {useAuth} from "../contexts/authContext";

export default function BrainTrainerPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remainingCalls, setRemainingCalls] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const QUIZ_KEY = "brain_trainer_quiz";
  const [showFeedback, setShowFeedback] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const { isLoggedIn, setIsLoggedIn, userEmail, setUserEmail } = useAuth();
  const navigate = useNavigate();

  const [ageGroup, setAgeGroup] = useState("50대");
  const [selectedTypes, setSelectedTypes] = useState(["상식", "산수", "이야기 기억력"]);
  const [difficulty, setDifficulty] = useState("보통");

  const [visiblePassages, setVisiblePassages] = useState({});



  const isValidQuiz = (quiz) => {
    return quiz.choices && quiz.choices.length > 0 && quiz.answer;
  };



  // 1. 남은 호출 횟수 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/gpt-usage`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => setRemainingCalls(data.remaining))
      .catch((err) => console.error("사용 가능 횟수 조회 실패", err));
  }, []);

  // 2. 저장된 퀴즈 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(QUIZ_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQuestions(parsed);
      } catch (e) {
        console.error("로컬스토리지 파싱 실패:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("nickname");
    localStorage.removeItem("usage_count");
    localStorage.removeItem("daily_limit");
    setIsLoggedIn(false);
    setUserEmail("");
    navigate("/login");
  };

  const generateQuiz = async () => {
    if (remainingCalls <= 0) {
      alert("오늘의 사용 가능 횟수를 모두 소진하셨습니다.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/brain-trainer/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ageGroup,
          quizTypes: selectedTypes,
          difficulty,
        }),
      });
      const data = await response.json();

      const formatted = data.questions.map((q) => ({
        ...q,
        userAnswer: null,
        isCorrect: null,
      }));

      setQuestions(formatted);
      localStorage.setItem(QUIZ_KEY, JSON.stringify(formatted));

      setRemainingCalls((prev) => Math.max(0, prev - 2));
    } catch (error) {
      console.error("문제 생성 실패:", error);
      setQuestions([{
        question: "문제를 생성하는 데 실패했습니다.",
        choices: [],
        answer: ""
      }]);
    } finally {
      setLoading(false);
    }
  };


  const handleAnswer = (qIndex, choice) => {
    setQuestions((prev) => {
      const updated = prev.map((q, i) =>
        i === qIndex && q.userAnswer === null
          ? {
              ...q,
              userAnswer: choice,
              isCorrect: choice === q.answer,
            }
          : q
      );
      localStorage.setItem(QUIZ_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const correctCount = questions.filter((q) => q.isCorrect === true).length;
  const allAnswered = questions.every((q) => q.userAnswer !== null);

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-white">
        <header
            className="w-full flex flex-col md:flex-row justify-between items-center px-4 py-4 border-b bg-white dark:bg-gray-800">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-300">두뇌트레이너</h1>
            
            <nav className="mt-2 text-sm">
              <Link to="/" className="hover:text-blue-400">J_Uni_home</Link>
              <span className="mx-2">|</span>
              <Link to="/brain-trainer" className="hover:text-blue-400">두뇌트레이너 홈</Link>
              <span className="mx-2">|</span>
              <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => setShowFeedback(true)}>
                Feedback
              </button>
              {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)}/>}
            </nav>
          </div>

          <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
            {isLoggedIn && (
                <div className="text-sm font-semibold text-green-300">
                  어서오세요, <span className="text-yellow-400">{userNickname}</span> 님
                </div>
            )}
            <div className="flex gap-2">
              {isLoggedIn ? (
                  <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-full">
                    Sign out
                  </button>
              ) : (
                  <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-full">
                    Sign in
                  </Link>
              )}
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-gray-400 mb-2">
            오늘의 퀴즈로 두뇌를 깨워보세요!
            <br/>(상식, 계산, 이야기 기반)
          </p>

          {/* ✅ 남은 횟수 표시 */}
          <p className="text-sm text-yellow-300 mb-6 font-semibold text-center">
            📌 오늘 남은 퀴즈 사용 가능 횟수(count): {remainingCalls ?? "로딩 중..."}회
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
            {/* 나이대 선택 */}
            <div>
              <label className="block text-sm mb-1">👤 나이대</label>
              <select
                  className="text-black px-3 py-1 rounded"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
              >
                <option>10대</option>
                <option>20대</option>
                <option>30대</option>
                <option>40대</option>
                <option>50대</option>
                <option>60대</option>
                <option>70대</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">🔥 난이도</label>
              <select
                  className="text-black px-3 py-1 rounded"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
              >
                <option>쉬움</option>
                <option>보통</option>
                <option>어려움</option>
              </select>
            </div>


            {/* 유형 선택 */}
            <div>
              <label className="block text-sm mb-1">📚 퀴즈 유형</label>
              <div className="flex gap-2 text-sm">
                {["상식", "산수", "이야기 기억력"].map((type) => (
                    <label key={type} className="flex items-center gap-1">
                      <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTypes([...selectedTypes, type]);
                            } else {
                              setSelectedTypes(selectedTypes.filter((t) => t !== type));
                            }
                          }}
                      />
                      {type}
                    </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            (퀴즈 생성시 횟수가 2회씩 차감됩니다.)
          </div>

          <div className="flex justify-center mb-6">
            <button
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
                onClick={generateQuiz}
                disabled={loading}
            >
              {loading ? "문제 생성 중..." : "오늘의 퀴즈 받기"}
            </button>
          </div>

          {questions.length > 0 && isValidQuiz(questions[0]) ? (
              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div key={i} className="bg-gray-800 p-4 mb-4 rounded-lg shadow">
                    {/* 이야기 기억력일 경우 지문 먼저 출력 */}
                    {q.type === "이야기 기억력" && (
                      <>
                        {!visiblePassages[i] ? (
                          <button
                            onClick={() => {
                              setVisiblePassages(prev => ({ ...prev, [i]: true }));
                              setTimeout(() => {
                                setVisiblePassages(prev => ({ ...prev, [i]: false }));
                              }, 5000);
                            }}
                            className="text-sm text-yellow-300 underline mb-2"
                          >
                            📝 지문 보기 (5초간)
                          </button>
                        ) : (
                          <div className="text-sm text-gray-300 mb-2 italic">
                            📝 지문: {q.passage}
                          </div>
                        )}
                      </>
                    )}

                    {/* 문제 본문 */}
                    <p className="mb-1 font-semibold">{i + 1}. {q.question}</p>

                    {/* 유형 표시 */}
                    {q.type && (
                      <p className="text-xs text-gray-400 mb-2">
                        🧩 유형:{" "}
                        <span className={
                          q.type === "상식" ? "text-green-400" :
                          q.type === "산수" ? "text-blue-400" :
                          q.type === "이야기 기억력" ? "text-purple-400" : "text-gray-400"
                        }>
                          {q.type}
                        </span>
                      </p>
                    )}
                      <div className="flex flex-col gap-2">
                        {q.choices.map((choice, j) => {
                          const isSelected = q.userAnswer === choice;
                          const isCorrect = choice === q.answer;
                          const isWrong = isSelected && !isCorrect;
                          return (
                              <button
                                  key={j}
                                  className={`border px-4 py-2 rounded text-left ${
                                      isSelected
                                          ? isCorrect
                                              ? "bg-green-600 border-green-600"
                                              : "bg-red-600 border-red-600"
                                          : "hover:bg-gray-700 border-gray-600"
                                  }`}
                                  onClick={() => handleAnswer(i, choice)}
                                  disabled={q.userAnswer !== null}
                              >
                                {choice}
                              </button>
                          );
                        })}
                      </div>

                      {q.userAnswer !== null && (
                          <p className="mt-2 text-sm">
                            {q.userAnswer === q.answer ? (
                                <span className="text-green-400">정답입니다!</span>
                            ) : (
                                <span className="text-red-400">오답입니다. 정답: {q.answer}</span>
                            )}
                          </p>
                      )}
                    </div>
                ))}
                {allAnswered && (
                    <div className="mt-10 text-center text-lg font-semibold text-yellow-400">
                      전체 정답률: {correctCount} / {questions.length} (
                      {Math.round((correctCount / questions.length) * 100)}%)
                    </div>
                )}
              </div>
          ) : questions.length > 0 ? (
              <p className="text-red-400 text-center mt-10 text-lg font-semibold">
                ❌ 퀴즈를 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.
              </p>
          ) : null}
        </div>
      </div>
  );
}
