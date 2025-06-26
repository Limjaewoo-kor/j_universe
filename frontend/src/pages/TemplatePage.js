import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserInputContext } from '../contexts/UserInputContext';

function TemplatePage() {
  const [templates, setTemplates] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const { setPurpose, setInputText, setTone, setResultText } = useContext(UserInputContext);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('templates') || '[]');
    setTemplates(saved);
  }, []);

  const saveToLocalStorage = (updated) => {
    localStorage.setItem('templates', JSON.stringify(updated));
    setTemplates(updated);
  };

  const handleApplyTemplate = (tpl) => {
    setPurpose(tpl.purpose);
    setInputText(tpl.inputText);
    setTone(tpl.tone);
    setResultText('');
    navigate('/result');
  };

  const handleDeleteTemplate = (index) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    const updated = templates.filter((_, i) => i !== index);
    saveToLocalStorage(updated);
  };

  const handleClearAllTemplates = () => {
    if (!window.confirm('정말로 모든 템플릿을 삭제하시겠습니까?')) return;
    localStorage.removeItem('templates');
    setTemplates([]);
  };

  const togglePreview = (index) => {
    setPreviewIndex(previewIndex === index ? null : index);
  };

  const handleEditTemplate = (index) => {
    setEditIndex(index === editIndex ? null : index);
  };

  const handleEditChange = (field, value) => {
    const updated = [...templates];
    updated[editIndex][field] = value;
    setTemplates(updated);
  };

  const handleSaveEdit = () => {
    saveToLocalStorage([...templates]);
    setEditIndex(null);
    alert('템플릿이 수정되었습니다!');
  };

  const getCategoryTag = (name) => {
    if (name.startsWith('[비즈]')) return 'bg-blue-100 text-blue-700';
    if (name.startsWith('[개인]')) return 'bg-green-100 text-green-700';
    if (name.startsWith('[기타]')) return 'bg-gray-200 text-gray-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 생략: import 및 useState, useEffect 등 동일

return (
  <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 px-6 py-12 flex flex-col items-center text-gray-800 dark:text-white">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-blue-300 mb-8 text-center drop-shadow">
      📂 저장된 템플릿 목록
    </h2>

    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="🔍 템플릿 이름 검색..."
      className="mb-8 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl w-full max-w-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
    />

    {filteredTemplates.length > 0 && (
      <button
        onClick={handleClearAllTemplates}
        className="mb-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl shadow ring-2 ring-red-300"
      >
        🗑️ 전체 템플릿 삭제
      </button>
    )}

    {filteredTemplates.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400 text-center">일치하는 템플릿이 없습니다.</p>
    ) : (
      <ul className="w-full max-w-3xl space-y-6">
        {filteredTemplates.map((tpl, idx) => (
          <li
            key={idx}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-blue-100 dark:border-gray-700 hover:shadow-lg transition"
          >
            <button
              onClick={() => handleDeleteTemplate(idx)}
              className="absolute top-3 right-4 text-red-500 hover:text-red-700 text-sm"
            >
              ❌
            </button>

            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${getCategoryTag(tpl.name)}`}
            >
              {tpl.name.split(']')[0].replace('[', '')}
            </span>

            {editIndex === idx ? (
              <div className="space-y-2">
                {['name', 'purpose', 'inputText', 'tone'].map((field) => (
                  <input
                    key={field}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={tpl[field]}
                    onChange={(e) => handleEditChange(field, e.target.value)}
                  />
                ))}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditIndex(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg text-sm"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">{tpl.name}</p>
                <p className="mb-1 text-gray-700 dark:text-gray-200"><strong>🎯 목적:</strong> {tpl.purpose}</p>
                <p className="mb-1 text-gray-700 dark:text-gray-200"><strong>📝 입력문장:</strong> {tpl.inputText}</p>
                <p className="mb-4 text-gray-700 dark:text-gray-200"><strong>🎤 말투:</strong> {tpl.tone}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApplyTemplate(tpl)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
                  >
                    이 템플릿 다시 사용
                  </button>
                  <button
                    onClick={() => togglePreview(idx)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 py-2 px-4 rounded-lg text-sm"
                  >
                    {previewIndex === idx ? '미리보기 닫기' : '결과 미리보기'}
                  </button>
                  <button
                    onClick={() => handleEditTemplate(idx)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-lg text-sm"
                  >
                    ✏️ 수정
                  </button>
                </div>
              </>
            )}

            {previewIndex === idx && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm whitespace-pre-line text-gray-700 dark:text-gray-100">
                <p><strong>예상 생성 결과:</strong></p>
                <p>목적: {tpl.purpose}</p>
                <p>입력: {tpl.inputText}</p>
                <p>말투: {tpl.tone}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">※ 실제 생성 결과는 AI 호출 시 달라질 수 있습니다.</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);


}

export default TemplatePage;
