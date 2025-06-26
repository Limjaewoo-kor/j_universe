import React, { useEffect, useState, useRef } from 'react';
import { createWebSocketConnection } from '../api/websocket';
import ChatBox from '../components/chat/ChatBox';
import ChatInput from '../components/chat/ChatInput';
import RagChatBox from '../components/chat/RagChatBox';
import RagChatInput from '../components/chat/RagChatInput';
import FeedbackForm from '../components/FeedbackForm'; // 경로 맞게 수정
import { askRagChat } from "../api/ragChat";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/authContext";


const ChatPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [messages, setMessages] = useState([]);
    const [ragMessages, setRagMessages] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userCount, setUserCount] = useState(1); // 추가
    const socketRef = useRef(null);
    const [showFeedback, setShowFeedback] = useState(false); // 추가

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
        localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
        setIsLoggedIn(false); // 로그아웃 후 상태 변경
        navigate('/login'); // 로그인 페이지로 리다이렉트
    };

    return (
        <div>
            <header
                className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-blue-600 dark:text-blue-300">Rumble Guide Chatbot ️</h1>
                    <nav className="mt-1 space-x-4 text-sm text-gray-700 dark:text-gray-300">
                        <Link to="/" className={"hover:text-blue-400"}>J_Universe_home</Link>
                        <Link to="/chat" className="hover:text-blue-400">Rumble_Guide_home</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setShowFeedback(true)}>
                        Feedback
                    </button>
                    <div
                        className="text-gray-700 dark:text-gray-200"
                        style={{fontSize: '14px'}}
                    >
                        Feedback시 캐릭터명을 내용 하단에 포함해주시면 좋습니다. <br/>
                        When providing feedback, please include the character name at the bottom of the content.
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-full"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-full"
                            >
                                Sign in
                            </Link>
                            {/*<Link*/}
                            {/*  to="/signup"*/}
                            {/*  className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full"*/}
                            {/*>*/}
                            {/*  Sign up*/}
                            {/*</Link>*/}
                        </>
                    )}

                </div>
            </header>

            {/* 피드백 폼 모달 */}
            {showFeedback && (
                <FeedbackForm onClose={() => setShowFeedback(false)}/>
            )}


            <div className="flex gap-14 w-full max-w-6xl mx-auto pt-8">
                <div className="flex-1">
                    <div style={{fontSize: '25px', fontWeight: 'bold'}}>
                        User Chat Room
                        <div className="text-gray-700 dark:text-gray-200"
                             style={{fontSize: '14px'}}>
                            Current Users in Chat Room: {userCount}
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <ChatBox messages={messages} myId={userId}/>
                    <ChatInput sendMessage={sendMessage}/>
                    채팅방 접속자들에게 질문해보세요.<br/>
                    Ask questions to chat room users.
                </div>
                <div className="flex-1">
                    <div style={{fontSize: '25px', fontWeight: 'bold'}}>
                        Rumble Guide Chatbot
                        <div className="text-gray-700 dark:text-gray-200"
                             style={{fontSize: '14px'}}>
                            챗봇에 추가하실 정보가 있다면 Feedback을 작성해주세요. <br/>
                            If you have any information to add to the chatbot, please write a feedback.
                        </div>
                    </div>
                    <br/>
                    <RagChatBox messages={ragMessages}/>
                    <RagChatInput sendMessage={sendRagMessage}/>
                    질문 예시 ) 오메가 블레이드가 뭐야? <br/>
                    Example questions ) What is Omega Blade?
                </div>
            </div>
            <br/>
            <br/>
            <div className="flex gap-6 w-full max-w-4xl mx-auto pt-8">


            </div>
        </div>
    );
};

export default ChatPage;
