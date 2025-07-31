import React, { useEffect, useState, useRef } from 'react';
import { createWebSocketConnection } from '../api/websocket';
import ChatBox from '../components/chat/ChatBox';
import ChatInput from '../components/chat/ChatInput';
import RagChatBox from '../components/chat/RagChatBox';
import RagChatInput from '../components/chat/RagChatInput';
import FeedbackForm from '../components/FeedbackForm';
import { askRagChatStream } from "../api/ragChat";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Buymeacoffee from '../components/buymeacoffee';

const ChatPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [ragMessages, setRagMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userCount, setUserCount] = useState(1);
  const socketRef = useRef(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
  const [remainingCalls, setRemainingCalls] = useState(null);
  const [userNickname, setUserNickname] = useState("");
  const [chatbotInitStatus, setChatbotInitStatus] = useState(null); // null: 로딩중, false: OK, true: 실패


  useEffect(() => {
    const fetchUsage = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE_URL}/gpt-usage`, {
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

  useEffect(() => {
    socketRef.current = createWebSocketConnection((msg) => {
      if (typeof msg === "string" && msg.startsWith("__id__:")) {
        const randomId = msg.replace("__id__:", "");
        const nickname = localStorage.getItem("nickname");
        setUserId(nickname || randomId);
      } else if (typeof msg === "string" && msg.startsWith("__usercount__:")) {
        const count = parseInt(msg.replace("__usercount__:", ""), 10);
        setUserCount(count);
      } else {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000;

    const fetchChatHistory = (retryCount = 0) => {
      fetch(`${API_BASE_URL}/chat-history/rumbleChat`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const restored = data.map((m) => `${m.role} : ${m.content}`);
            setMessages(restored);
          } else if (retryCount < MAX_RETRIES) {
            setTimeout(() => fetchChatHistory(retryCount + 1), RETRY_DELAY);
          }
        })
        .catch((err) => {
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => fetchChatHistory(retryCount + 1), RETRY_DELAY);
          }
        });
    };

    fetchChatHistory();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const checkChatMessageHealth = async (retryCount = 0) => {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 5000;
      try {
        const res = await fetch(`${API_BASE_URL}/chat-message`, {
          method: "OPTIONS",
        });
        if (!res.ok) throw new Error("status not ok");
        setChatbotInitStatus(false);  // 정상 연결
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => checkChatMessageHealth(retryCount + 1), RETRY_DELAY);
        } else {
          setChatbotInitStatus(true);  // 실패
        }
      }
    };
    checkChatMessageHealth();
  }, []);


  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedNickname = localStorage.getItem("nickname");
    if (storedEmail) setUserEmail(storedEmail);
    if (storedNickname) setUserNickname(storedNickname);
  }, []);

  const token = localStorage.getItem('token');

  const sendMessage = (message) => {
    if (socketRef.current && message.trim()) {
      socketRef.current.send(message);
      const nickname = localStorage.getItem("nickname");

      fetch(`${API_BASE_URL}/chat-message`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          session_id: "rumbleChat",
          role: nickname || userId || "anonymous",
          content: message
        })
      });
    }
  };

  const sendRagMessage = async (msg) => {
    if (!msg.trim()) return;

    setRagMessages((prev) => [...prev, { role: "user", content: msg }]);
    let currentAnswer = "";

    try {
      setRagMessages((prev) => [...prev, { role: "bot", content: "" }]);
      await askRagChatStream(msg, (chunk) => {
        currentAnswer = chunk;
        setRagMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "bot", content: currentAnswer };
          return updated;
        });
      });
    } catch (err) {
      alert("서버와의 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
      console.error(err);
    }
  };

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

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <header
            className="flex flex-col md:flex-row justify-between items-center px-4 py-4 border-b bg-white dark:bg-gray-800">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-300">J_Uni Rumble Chatbot – 비공식 가이드</h1>
            <nav className="mt-2 text-sm">
              <Link to="/" className="hover:text-blue-400">J_Uni_home</Link>
              <span className="mx-2">|</span>
              <Link to="/chat" className="hover:text-blue-400">Rumble_Chatbot_home</Link>
            </nav>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            <button
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setShowFeedback(true)}>
              Feedback
            </button>
            <p className="text-xs text-center md:text-left text-gray-600 dark:text-gray-300">
              Feedback시 서버 및 캐릭터명을 내용 하단에 포함해주시면 좋습니다.<br/>
              When providing feedback, please include the server and character name at the bottom of the content.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
            {isLoggedIn && (
              <div className="text-sm font-semibold text-green-300">
                어서오세요, <span className="text-yellow-400">{userNickname || userEmail}</span> 님
              </div>
            )}
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

            {/*<Link*/}
            {/*  to="/signup"*/}
            {/*  className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full"*/}
            {/*>*/}
            {/*  Sign up*/}
            {/*</Link>*/}
          </div>
        </header>

        {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)}/>}

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto px-4 py-6">

          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-2">
              User Chat Room
            </h2>
            <br/>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
              Current Users in Chat Room: {userCount}
            </p>
              {messages.length === 0 && (
            <p className="text-sm text-yellow-400 font-semibold mb-2">
              ⚠️ 서버가 준비 중이거나 최초 로딩 중입니다. 잠시만 기다려 주세요...
            </p>
            )}
            <ChatBox messages={messages} myId={userId} />

            {userId && (
              <p className="text-sm text-gray-400 mb-1">
                나의 채팅방 ID: <span className="font-mono text-blue-300">{userId}</span>
              </p>
            )}

            <ChatInput sendMessage={sendMessage} />
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
              채팅방 접속자들에게 질문해보세요.<br/>
              Ask questions to chat room users.
            </p>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-2">
              Rumble Chatbot
            </h2>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
              가이드봇에 추가하실 정보가 있다면 Feedback을 작성해주세요.<br/>
              If you have information to add, please write feedback.
            </p>
            {chatbotInitStatus !== false && (
              <p className="text-sm text-yellow-400 font-semibold mb-2">
                ⚠️ 서버가 준비 중이거나 최초 로딩 중입니다. 잠시만 기다려 주세요...
              </p>
            )}
            <RagChatBox messages={ragMessages}/>
            <RagChatInput sendMessage={sendRagMessage}/>
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
              질문 예시 ) 오메가 블레이드가 뭐야?<br/>
              Example questions ) What is Omega Blade?
            </p>
          </div>
        </div>
        <p style={{
          fontSize: "0.85em",
          color: "gray",
          textAlign: "center"
        }}>
          본 사이트는 공식 가이드가 아닌 개인의 게임 플레이 경험을 바탕으로 제작된 커뮤니티 및 정보 공유 사이트로써 비공식 콘텐츠입니다.<br/>
          해당 챗봇은 직접 플레이하며 정리한 정보로 구성되어 있으며, 공식 디지몬슈퍼럼블 개발사와는 관련이 없습니다.<br/>
          This site is not an official guide, but unofficial content created based on personal gameplay
          experience. <br/>
          The content consists of information compiled through direct gameplay and is not affiliated with the official
          developer.
        </p>
        <br/>
        {/* 남은 GPT 횟수 표시 */}
        <p className="text-sm mb-2 text-yellow-500 font-semibold text-center">
          📌 오늘 남은 가이드봇 사용 가능 횟수(count): {remainingCalls}회
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
        <div style={{textAlign: "center", padding: '30px 20px'}}>
          {/* 콘텐츠 */}
          <Buymeacoffee/>
        </div>


      </div>
  );
};

export default ChatPage;
