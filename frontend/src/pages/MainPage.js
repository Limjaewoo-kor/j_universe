import React from 'react';
import { useNavigate } from 'react-router-dom';
import Buymeacoffee from "../components/buymeacoffee";

const menuList = [
  { label: "말해조(Malhaejo)", to: "/home" },
  { label: "Rumble Chatbot", to: "/chat" },
  { label: "계산해(CalcForMe)", to: "/calc-helper" },
  { label: "Empty", to: "/" },
  { label: "Empty", to: "/" },
  { label: "Empty", to: "/" },
  { label: "Empty", to: "/" },
  { label: "Empty", to: "/" },
];

export default function MainPage() {
  const navigate = useNavigate();
  return (
      <div className="flex flex-col items-center min-h-screen justify-center px-2 py-8">
          <h1 className="text-3xl sm:text-6xl font-bold mb-12 sm:mb-16 tracking-widest">J_Universe</h1>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full max-w-3xl">
              {menuList.map((menu, idx) => (
                  <button
                      key={menu.label}
                      className="w-full h-24 sm:h-48 rounded-2xl border-2 border-black flex items-center justify-center text-lg sm:text-2xl font-semibold hover:bg-blue-300 transition"
                      onClick={() => navigate(menu.to)}
                  >
                      {menu.label}
                  </button>
              ))}
          </div>
          <div style={{textAlign: "center", padding: '30px 20px'}}>
              {/* 콘텐츠 */}
              <Buymeacoffee/>
          </div>
      </div>
  );
}
