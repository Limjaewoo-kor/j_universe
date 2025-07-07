import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const Header = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="mb-2 md:mb-0 text-center md:text-left">
        <h1 className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-300">J_Uni 말해조 🗣️</h1>
        <nav className="mt-1 flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-gray-700 dark:text-gray-300 items-center">
          <Link to="/" className="hover:text-blue-400">J_Uni_home</Link>
          <Link to="/home" className="hover:text-blue-400">말해조 홈</Link>
          <Link to="/history" className="hover:text-blue-400">history</Link>
          <Link to="/templates" className="hover:text-blue-400">template</Link>
          {isLoggedIn && (
            <Link to="/profile" className="hover:text-blue-400">mypage</Link>
          )}
        </nav>
      </div>
      <div className="flex items-center gap-2 mt-2 md:mt-0">
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
          {/*   <Link*/}
          {/*  to="/signup"*/}
          {/*  className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full"*/}
          {/*>*/}
          {/*  Sign up*/}
          {/*</Link>*/}
          {/*<button*/}
          {/*  onClick={toggleTheme}*/}
          {/*  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform"*/}
          {/*  title="테마 전환"*/}
          {/*>*/}
          {/*  {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-gray-800" />}*/}
          {/*</button>*/}
      </div>
    </header>
  );
};

export default Header;
