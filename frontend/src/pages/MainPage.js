// src/pages/MainPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const menuList = [
  { label: "Malhaejo", to: "/home" },
  { label: "Rumble Guide Chatbot", to: "/chat" },
  { label: "Empty", to: "/" },
  { label: "Empty", to: "/" },
  { label: "Empty", to: "/" },
  { label: "Empty", to: "/" },
  { label: "Empty", to: "/" },
  { label: "Empty", to: "/" },
];

export default function MainPage() {
  const navigate = useNavigate();
// dark:text-blue-300"
  return (
    <div className="flex flex-col items-center min-h-screen dark:from-gray-900 justify-center">
      <h1 className="text-6xl font-bold mb-16 tracking-widest">J_Universe</h1>
      <div className="grid grid-cols-2 gap-12">
        {menuList.map((menu, idx) => (
          <button
            key={menu.label}
            className="w-48 h-48 rounded-2xl border-2 border-black flex items-center justify-center text-2xl font-semibold hover:bg-blue-300 transition"
            onClick={() => navigate(menu.to)}
          >
            {menu.label}
          </button>
        ))}
      </div>
    </div>
  );
}
