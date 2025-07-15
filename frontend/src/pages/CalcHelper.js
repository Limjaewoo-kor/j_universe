import React, { useState } from 'react';
import BasicCalcTab from './tabs/BasicCalcTab';
import SplitCalcTab from './tabs/SplitCalcTab';
import InterestCalcTab from './tabs/InterestCalcTab';
import ExchangeCalcTab from './tabs/ExchangeCalcTab';
import UnitConvertTab from './tabs/UnitConvertTab';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/authContext";
import Buymeacoffee from "../components/buymeacoffee";
import { useEffect } from 'react';


const CalcHelperPage = () => {
  const [tab, setTab] = useState('basic');
  const { isLoggedIn, setIsLoggedIn, userEmail, setUserEmail } = useAuth();
  const navigate = useNavigate();
  const [remainingCalls, setRemainingCalls] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/gpt-usage`, {
      headers: {
        "Authorization": token
          ? `Bearer ${token}`
          : ""
      }
     })
     .then(res => res.json())
     .then(data => {
       setRemainingCalls(data.remaining);
     });
  }, [tab /* 탭 바뀔 때마다 */, /* 로그인 상태가 바뀔 수도 있으니 */]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("usage_count");
    localStorage.removeItem("daily_limit");
    setIsLoggedIn(false);
    setUserEmail("");
    navigate("/login");
  };

  const renderTab = () => {
    switch (tab) {
      case 'basic': return <BasicCalcTab />;
      case 'split': return <SplitCalcTab />;
      case 'interest': return <InterestCalcTab />;
      case 'exchange': return <ExchangeCalcTab />;
      case 'unit': return <UnitConvertTab />;
      default: return <BasicCalcTab />;
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-white">
        <header className="w-full flex flex-col md:flex-row justify-between items-center px-4 py-4 border-b bg-white dark:bg-gray-800">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-300">J_Uni 말로하는 계산기</h1>
            <nav className="mt-2 text-sm">
              <Link to="/" className="hover:text-blue-400">J_Uni_home</Link>
              <span className="mx-2">|</span>
              <Link to="/calc-helper" className="hover:text-blue-400">말로하는 계산기 홈</Link>
            </nav>
          </div>

          <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
            {isLoggedIn && (
              <div className="text-sm font-semibold text-green-300">
                어서오세요, <span className="text-yellow-400">{userEmail}</span> 님
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
                    {/*<Link*/}
                    {/*  to="/signup"*/}
                    {/*  className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full"*/}
                    {/*>*/}
                    {/*  Sign up*/}
                    {/*</Link>*/}
            </div>
          </div>
        </header>

        {/* ✅ 내부는 max-w-6xl로 제한 */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* 탭 버튼 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setTab('basic')}
                    className={`px-4 py-2 rounded ${tab === 'basic' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>
              💬 말로하는 계산
            </button>
            <button onClick={() => setTab('split')}
                    className={`px-4 py-2 rounded ${tab === 'split' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>
              나누기 계산
            </button>
            <button onClick={() => setTab('interest')}
                    className={`px-4 py-2 rounded ${tab === 'interest' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>
              이자 계산
            </button>
            <button onClick={() => setTab('exchange')}
                    className={`px-4 py-2 rounded ${tab === 'exchange' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>
              환율 계산
            </button>
            <button onClick={() => setTab('unit')}
                    className={`px-4 py-2 rounded ${tab === 'unit' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>
              단위 변환
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            {renderTab()}
          </div>
        </div>
        <br/>
        {/* 호출 횟수 표시 */}
        <p className="text-sm text-yellow-300 mb-4 font-semibold text-center">
          📌 오늘 남은 계산 가능 횟수(count): {remainingCalls}회
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

export default CalcHelperPage;
