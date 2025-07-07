import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserInputContext } from '../contexts/UserInputContext';

function PurposePage() {
  const navigate = useNavigate();
  const {
    setPurpose,
    setInputText,
    setTone,
    setResultText,
  } = useContext(UserInputContext);

  const [selectedPurpose, setSelectedPurpose] = useState('');

  useEffect(() => {
    setPurpose('');
    setInputText('');
    setTone('');
    setResultText('');
    localStorage.removeItem('malhaejo_purpose');
    localStorage.removeItem('malhaejo_input');
    localStorage.removeItem('malhaejo_tone');
    localStorage.removeItem('malhaejo_result');
  }, [setPurpose, setInputText, setTone, setResultText]);

  const handleNext = () => {
    if (!selectedPurpose) return alert('목적을 선택해주세요.');
    setPurpose(selectedPurpose);
    navigate('/input');
  };

  const purposes = ['요청', '문의', '사과', '항의', '감사', '기타'];

 return (
     <div
         className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center px-6 py-12 text-gray-800 dark:text-white">
         <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-10 text-center drop-shadow">
             어떤 목적으로 문장을 만들고 싶으신가요?
         </h2>

         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-xl mb-12">
             {purposes.map((item) => (
                 <button
                     key={item}
                     onClick={() => setSelectedPurpose(item)}
                     className={`py-4 rounded-xl text-lg font-semibold transition shadow-md text-center ${
                         selectedPurpose === item
                             ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                             : 'bg-white text-gray-800 hover:bg-blue-100 dark:bg-gray-700 dark:text-white dark:hover:bg-blue-500'
                     }`}
                 >
                     {item}
                 </button>
             ))}
         </div>

         <button
             onClick={handleNext}
             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg ring-2 ring-blue-300 transition"
         >
             👉 다음 단계로 이동
         </button>
         <br/>
         <p style={{
             fontSize: "0.9em",
             color: "gray",
             fontWeight: "bold",
             textAlign: "center"
         }}>
             일정 시간 사용하지 않으면 간혹 기능이 동작하지 않는 경우가 있습니다.<br/>
             약 2~3분 후에 화면을 새로고침 하신 후 다시 시도해 주세요.
             <br/>
             If you do not use it for a certain period of time, the function may not work occasionally.<br/>
             Please refresh the screen after about 2-3 minutes and try again.
         </p>
     </div>
 );

}

export default PurposePage;
