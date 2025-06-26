import React, { useEffect } from 'react';
import Signup from '../components/Signup';
import './SignupPage.css'; // 스타일 적용

const SignupPage = () => {
  // 다크모드 상태에 따른 body 클래스를 관리
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">SIGNUP</h2>
        <Signup />
      </div>
    </div>
  );
};

export default SignupPage;
