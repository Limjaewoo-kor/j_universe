import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
      <div
          className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col justify-center items-center px-6 py-16 text-center">
          <div className="text-6xl sm:text-7xl font-extrabold text-blue-700 mb-4 drop-shadow">404</div>
          <p className="text-xl sm:text-2xl text-gray-800 mb-3">
              Oops! lost its way 🗣️
          </p>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
              The page you’re looking for doesn’t exist or may have moved.
          </p>
          <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow ring-2 ring-blue-300 transition"
          >
              🏠 Go back home
          </button>
      </div>
  );
}

export default NotFoundPage;
