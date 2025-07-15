import React, { useContext, useEffect, useState } from 'react';
import { UserInputContext } from '../contexts/UserInputContext';
import { generatePoliteMessage } from '../api/gptService';
import useClipboard from '../hooks/useClipboard';
import ReactGA from 'react-ga4';

function ResultPage() {
  const {
    purpose,
    inputText,
    tone,
    setTone,
    resultText,
    setResultText,
  } = useContext(UserInputContext);

  const [loading, setLoading] = useState(false);
  const [copied, copyToClipboard] = useClipboard();
  const [remainingCalls, setRemainingCalls] = useState(null);


  const fetchResult = async (customTone = tone) => {
    console.log("🔥 fetchResult() called");
    setLoading(true);

    ReactGA.event({
      category: 'Button',
      action: 'Click generate',
      label: 'Result Generation',
    });

    try {
      const response = await generatePoliteMessage({
        purpose,
        inputText,
        tone: customTone,
      });
      setResultText(response);
    } catch (error) {
      if (error.message.includes("429")) {
        alert("서버 기준 일일 사용 횟수를 초과하였습니다.\n내일 다시 이용해 주세요.");
        setResultText("요청 횟수를 초과하여 문장을 생성할 수 없습니다.");
      } else {
        alert("사용 횟수를 초과하였거나 서버와의 연결에 실패했습니다.");
        setResultText("문장 생성에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSaveToHistory = () => {
    const history = JSON.parse(localStorage.getItem('messageHistory') || '[]');
    const newEntry = { purpose, inputText, tone, resultText, timestamp: new Date().toISOString() };
    const updated = [newEntry, ...history].slice(0, 20);
    localStorage.setItem('messageHistory', JSON.stringify(updated));
    alert('히스토리에 저장되었습니다!');
  };

  const handleSaveTemplate = () => {
    const name = prompt('이 템플릿의 이름을 입력하세요:');
    if (!name) return;
    const template = { name, purpose, inputText, tone };
    const saved = JSON.parse(localStorage.getItem('templates') || '[]');
    const updated = [template, ...saved].slice(0, 20);
    localStorage.setItem('templates', JSON.stringify(updated));
    alert('템플릿이 저장되었습니다!');
  };

  const handleFeedback = (isLike) => {
    const feedbackList = JSON.parse(localStorage.getItem('feedback') || '[]');
    const existingIndex = feedbackList.findIndex(item => item.resultText === resultText);

    if (existingIndex !== -1) {
      const existing = feedbackList[existingIndex];
      if (existing.liked === isLike) {
        const updated = [...feedbackList];
        updated.splice(existingIndex, 1);
        localStorage.setItem('feedback', JSON.stringify(updated));
        alert('피드백이 취소되었습니다.');
        return;
      } else {
        feedbackList[existingIndex] = {
          ...existing,
          liked: isLike,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('feedback', JSON.stringify(feedbackList));
        alert(isLike ? '좋아요로 변경되었습니다 😊' : '싫어요로 변경되었습니다 🙏');
        return;
      }
    }

    const newEntry = {
      purpose,
      inputText,
      tone,
      resultText,
      liked: isLike,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...feedbackList];
    localStorage.setItem('feedback', JSON.stringify(updated));
    alert(isLike ? '좋아요가 저장되었습니다 😊' : '피드백 감사합니다 🙏');
  };


  useEffect(() => {
    const fetchUsage = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}/gpt-usage`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : ""
          }
        });
        const data = await res.json();
        setRemainingCalls(data.remaining);
      } catch (err) {
        console.error("GPT 사용량 조회 실패:", err);
      }
    };
    fetchUsage();
  }, []);

return (
    <div
        className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center px-6 py-12 text-gray-800 dark:text-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-8 text-center drop-shadow">
        AI가 생성한 문장입니다
      </h2>

      {loading ? (
          <p className="text-gray-600 dark:text-gray-300">⏳ 잠시만 기다려주세요...</p>
      ) : (
          <div
              className="w-full max-w-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl p-6 shadow-xl border border-blue-100 dark:border-gray-700 mb-6 whitespace-pre-line leading-relaxed">
            {resultText}
          </div>
      )}

      <button
          onClick={() => copyToClipboard(resultText)}
          className="mb-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow ring-2 ring-blue-300 transition"
      >
        {copied ? '✅ 복사됨!' : '📋 복사하기'}
      </button>

      {/* 다시 쓰기 옵션 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 max-w-2xl w-full mb-10">
        <h4 className="text-lg font-bold text-gray-700 dark:text-white mb-4">
          다른 방식으로 다시 써볼까요?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => fetchResult('아주 공손하게')}
                  className="py-2 px-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600 shadow-sm">
            더 공손하게
          </button>
          <button onClick={() => fetchResult('더 간략하게')}
                  className="py-2 px-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600 shadow-sm">
            더 간단하게
          </button>
          <button onClick={() => fetchResult('더 단도직입적으로')}
                  className="py-2 px-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600 shadow-sm">
            더 직접적으로
          </button>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <button
            onClick={handleSaveToHistory}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-xl shadow ring-2 ring-green-300"
        >
          히스토리에 저장
        </button>
        <button
            onClick={handleSaveTemplate}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-xl shadow ring-2 ring-yellow-300"
        >
          템플릿으로 저장
        </button>
      </div>
      <br/>
      {/* 남은 GPT 횟수 표시 */}
      <p className="text-sm mb-2 text-yellow-500 font-semibold text-center">
        📌 오늘 남은 문장 생성 사용 가능 횟수(count): {remainingCalls}회
      </p>
      <br/>
      <p style={{
        fontSize: "0.9em",
        color: "gray",
        fontWeight: "bold",
        textAlign: "center"
      }}>
        일정 시간 사용하지 않으면 간혹 기능이 동작하지 않는 경우가 있습니다.<br/>
        약 1분 후에 화면을 새로고침 하신 후 다시 시도해 주세요.
        <br/>
        If you do not use it for a certain period of time, the function may not work occasionally.<br/>
        Please refresh the screen after about 1 minutes and try again.
      </p>

      {/* 피드백 */}
      {/*<div className="text-center">*/}
      {/*  <h4 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">*/}
      {/*    이 문장이 마음에 드셨나요?*/}
      {/*  </h4>*/}
      {/*  <div className="flex justify-center gap-6 text-3xl">*/}
      {/*    <button onClick={() => handleFeedback(true)} className="hover:scale-110 transition">*/}
      {/*      👍*/}
      {/*    </button>*/}
      {/*    <button onClick={() => handleFeedback(false)} className="hover:scale-110 transition">*/}
      {/*      👎*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
);

}

export default ResultPage;
