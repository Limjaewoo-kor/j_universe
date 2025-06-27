import React, { useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const PdfUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return setMsg("파일을 선택하세요!");
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
      const res = await axios.post(
        `${API_BASE_URL}/upload-pdf`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMsg(res.data.message);
      setSelectedFile(null);
    } catch (err) {
      setMsg("업로드 실패: " + (err?.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow text-gray-800 dark:text-white mt-8">
      <h2 className="mb-2 font-bold text-center">PDF 업로드</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-2">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">업로드</button>
      </form>
      {msg &&
        <div className="mt-2 text-blue-600 text-center">
          {msg}
        </div>
      }
    </div>
  );
};

export default PdfUpload;
