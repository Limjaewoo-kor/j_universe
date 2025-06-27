import React, { useEffect, useState, useRef } from 'react';
import { createWebSocketConnection } from '../api/websocket';
import ChatBox from '../components/chat/ChatBox';
import ChatInput from '../components/chat/ChatInput';
import RagChatBox from '../components/chat/RagChatBox';
import RagChatInput from '../components/chat/RagChatInput';
import FeedbackForm from '../components/FeedbackForm';
import { askRagChat } from "../api/ragChat";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ChatPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [ragMessages, setRagMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userCount, setUserCount] = useState(1);
  const socketRef = useRef(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    socketRef.current = createWebSocketConnection((msg) => {
      if (typeof msg === "string" && msg.startsWith("__id__:")) {
        setUserId(msg.replace("__id__:", ""));
      } else if (typeof msg === "string" && msg.startsWith("__usercount__:")) {
        const count = parseInt(msg.replace("__usercount__:", ""), 10);
        setUserCount(count);
      } else {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });
    return () => socketRef.current.close();
  }, []);

  const sendMessage = (message) => {
    if (socketRef.current && message.trim()) {
      socketRef.current.send(message);
    }
  };

  const sendRagMessage = async (msg) => {
    if (!msg.trim()) return;
    setRagMessages((prev) => [...prev, { role: "user", content: msg }]);
    const answer = await askRagChat(msg);
    setRagMessages((prev) => [...prev, { role: "bot", content: answer }]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="flex flex-col md:flex-row justify-between items-center px-4 py-4 border-b bg-white dark:bg-gray-800">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-300">Rumble Guide Chatbot️</h1>
          <nav className="mt-2 text-sm">
            <Link to="/" className="hover:text-blue-400">J_Universe_home</Link>
            <span className="mx-2">|</span>
            <Link to="/chat" className="hover:text-blue-400">Rumble_Guide_home</Link>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setShowFeedback(true)}>
            Feedback
          </button>
          <p className="text-xs text-center md:text-left text-gray-600 dark:text-gray-300">
            Feedback시 캐릭터명을 내용 하단에 포함해주시면 좋습니다.<br />
            When providing feedback, please include the character name at the bottom.
          </p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
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

      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto px-4 py-6">

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-2">
            User Chat Room
          </h2>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
            Current Users in Chat Room: {userCount}
          </p>
          <ChatBox messages={messages} myId={userId} />
          <ChatInput sendMessage={sendMessage} />
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
            채팅방 접속자들에게 질문해보세요.<br />
            Ask questions to chat room users.
          </p>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-2">
            Rumble Guide Chatbot
          </h2>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
            챗봇에 추가하실 정보가 있다면 Feedback을 작성해주세요.<br />
            If you have information to add, please write feedback.
          </p>
          <RagChatBox messages={ragMessages} />
          <RagChatInput sendMessage={sendRagMessage} />
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
            질문 예시 ) 오메가 블레이드가 뭐야?<br />
            Example questions ) What is Omega Blade?
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
