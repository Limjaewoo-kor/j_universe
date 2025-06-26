import React, { useState } from 'react';
import loginAPI from '../api/login';  // 로그인 API 호출

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginAPI(email, password);
      localStorage.setItem('token', data.access_token);  // 로그인 성공 후 토큰 저장
      window.location.href = '/profile';  // 로그인 후 마이페이지로 이동
    } catch (err) {
      setError(err.message || '로그인 실패');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
        />
        <br/>
        <br/>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
        />
        <br/>
        <br/>
        <button type="submit">로그인</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Login;
