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
        <header
            className="flex flex-col md:flex-row justify-between items-center px-4 py-4 border-b bg-white dark:bg-gray-800">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-300">Rumble Chatbot – 비공식 가이드</h1>
            <nav className="mt-2 text-sm">
              <Link to="/" className="hover:text-blue-400">J_Universe_home</Link>
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
            <ChatBox messages={messages} myId={userId}/>
            <ChatInput sendMessage={sendMessage}/>
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
              챗봇에 추가하실 정보가 있다면 Feedback을 작성해주세요.<br/>
              If you have information to add, please write feedback.
            </p>
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
          본 사이트는 공식 가이드가 아닌 개인의 게임 플레이 경험을 바탕으로 제작된 비공식 콘텐츠입니다.<br/>
          콘텐츠는 직접 플레이하며 정리한 정보로 구성되어 있으며, 공식 개발사와는 관련이 없습니다.<br/>
          This site is not an official guide, but unofficial content created based on personal gameplay
          experience. <br/>
          The content consists of information compiled through direct gameplay and is not affiliated with the official
          developer.
        </p>
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
        <div style={{textAlign: "center", padding: '30px 20px'}}>
          {/* 콘텐츠 */}
          <Buymeacoffee/>
        </div>


      </div>
  );
};

export default ChatPage;
