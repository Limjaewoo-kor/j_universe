import React, { useEffect } from 'react';
import Profile from '../components/Profile';
import './ProfilePage.css';

const ProfilePage = () => {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 px-6 py-12 flex flex-col items-center text-gray-800 dark:text-white">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-300 mb-6">내 프로필</h2>
        <Profile />
      </div>
    </div>
  );
};

export default ProfilePage;
