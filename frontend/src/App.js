import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

import { UserInputProvider } from './contexts/UserInputContext';
import { ThemeProvider } from './contexts/ThemeContext';

import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';
import PurposePage from './pages/PurposePage';
import InputPage from './pages/InputPage';
import TonePage from './pages/TonePage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import TemplatePage from './pages/TemplatePage';
import FeedbackPage from './pages/FeedbackPage';
import NotFoundPage from './pages/NotFoundPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import FeedbackForm from "./components/FeedbackForm";
import FeedbackAdminPage from "./pages/FeedbackAdminPage";
import { AuthProvider } from "./contexts/authContext";

import Header from './components/Header';
import PdfUpload from "./pages/PdfUpload";

// ✅ 페이지 이동 시 GA 이벤트 전송
function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);
}

function AppWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // 기본값 light 테마
  const location = useLocation();

  document.body.classList.add('dark');

  // // 로그인 상태 체크 (localStorage에서 토큰 확인)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);  // 토큰이 있으면 로그인 상태로 설정, 없으면 로그인 상태 아님
  }, []);

  document.body.classList.add('dark');
  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(newTheme);
  //   localStorage.setItem('theme', newTheme);
  //   document.body.classList.toggle('dark', newTheme === 'dark'); // body에 dark 클래스를 추가하거나 제거
  // };
  //
  // useEffect(() => {
  //   // 페이지 로드 시 테마 설정
  //   document.body.classList.toggle('dark', theme === 'dark');
  // }, [theme]);

  const hideHeaderPaths = ['/', '/chat','/login'];
  const allPagePaths = [
    '/', '/chat', '/feedback', '/home', '/purpose', '/input',
    '/tone', '/result', '/history', '/templates',
    '/login', '/signup', '/profile'
  ];

  const isNotFoundPage = !allPagePaths.includes(location.pathname);
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname) && !isNotFoundPage;

  usePageTracking();

  return (
    <>
       {shouldShowHeader && (
        <Header
          // isLoggedIn={isLoggedIn}
          // setIsLoggedIn={setIsLoggedIn}
          // toggleTheme={toggleTheme}
        />
      )}
      {/*<Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} toggleTheme={toggleTheme} />*/}
      <Routes>
        <Route path="/" element={<MainPage />} />
         {/* chat 경로 추가 */}
        <Route path="/chat" element={<ChatPage />} />
        {/* feedback 경로 추가 */}
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/jw/feedbacks" element={<FeedbackAdminPage />} />
        <Route path="/jw/pdfupload" element={<PdfUpload />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/purpose" element={<PurposePage />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/tone" element={<TonePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/templates" element={<TemplatePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* 로그인/회원가입/프로필 경로 추가 */}
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* NotFoundPage 경로 추가 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UserInputProvider>
          <Router>
            <AppWrapper />
          </Router>
        </UserInputProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
