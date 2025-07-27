import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import FeedbackForm from "./FeedbackForm";

const Header = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [userEmail, setUserEmail] = useState('');
  const [usageCount, setUsageCount] = useState(null);
  const [dailyLimit, setDailyLimit] = useState(null);
  const [userNickname, setUserNickname] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const nickname = localStorage.getItem("nickname");
    const usage = localStorage.getItem("usage_count");
    const limit = localStorage.getItem("daily_limit");
    if (email) setUserEmail(email);
    if (nickname) setUserNickname(nickname);
    if (usage) setUsageCount(parseInt(usage));
    if (limit) setDailyLimit(parseInt(limit));
  }, [isLoggedIn]);

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
    <header className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="mb-2 md:mb-0 text-center md:text-left">
        <h1 className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-300">J_Uni 말해조 🗣️</h1>
        <nav
            className="mt-1 flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-gray-700 dark:text-gray-300 items-center">
          <Link to="/" className="hover:text-blue-400">J_Uni_home</Link>
          <Link to="/home" className="hover:text-blue-400">말해조 홈</Link>
          <Link to="/history" className="hover:text-blue-400">history</Link>
          <Link to="/templates" className="hover:text-blue-400">template</Link>
          {isLoggedIn && (
              <Link to="/profile" className="hover:text-blue-400">mypage</Link>
          )}
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
              어서오세요, <span className="text-yellow-400">{userNickname || userEmail}</span> 님
          </div>
        )}
        {isLoggedIn ? (
            <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-full"
            >
              Sign out
            </button>
        ) : (
            <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-full"
            >
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
  );
};

export default Header;
