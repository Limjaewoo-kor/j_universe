import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/authContext';
import login from '../api/login';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.access_token);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      alert('로그인 실패');
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  return (
      <div className="min-h-screen bg-[#181e29] flex flex-col">
        {/* ----- 헤더 바 ----- */}
        <div className="w-full bg-[#181e29] border-b border-gray-700 px-8 py-3">
          {/* 상단: 로고 */}
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-xl font-bold text-blue-400 mr-2">J_Universe</h1>
          </div>
          {/* 하단: 네비 */}
          <div className="text-xs text-gray-300">
            <nav className="space-x-4 text-sm text-gray-300">
              <Link to="/" className="hover:text-blue-400">J_Universe_home</Link>
              <Link to="/home" className="hover:text-blue-400">Malhaejo_home</Link>
              <Link to="/chat" className="hover:text-blue-400">Rumble_Guide_home</Link>
            </nav>
          </div>
        </div>
        {/* ----- 로그인 폼 (중앙 정렬) ----- */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="login-box">
            <h2 className="login-title">LOGIN</h2>
            <form onSubmit={handleLogin}>
              <div className="input-field">
                <input
                    type="email"
                    placeholder="emailId"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="login-button">Sign in</button>
            </form>
            <div className="footer">
              {/* <a href="/forgot-password">ID/PW 찾기</a> | <a href="/signup">회원가입</a> */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
