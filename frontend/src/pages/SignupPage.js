import React, { useEffect } from 'react';
import Signup from '../components/Signup';

const SignupPage = () => {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-2">
      <div className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-center text-2xl font-bold mb-6 text-blue-600 dark:text-blue-300">SIGNUP</h2>
        <Signup />
      </div>
    </div>
  );
};

export default SignupPage;
