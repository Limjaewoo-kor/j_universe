import React, { useEffect, useState } from "react";
import axios from "axios";

function FeedbackAdminPage() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
    axios.get(`${API_BASE_URL}/feedbacks`).then((res) => {
      setFeedbacks(res.data);
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Feedback Admin</h2>
      {feedbacks.length === 0 ? (
        <div className="text-gray-500">No feedback yet.</div>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb, idx) => (
            <li key={fb.id || idx} className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="font-semibold mb-1">
                Type: {fb.type ? fb.type : "N/A"}
              </div>
              <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-2">
                {fb.feedback_text}
              </div>
              <div className="text-sm text-gray-400">
                {fb.created_at ? new Date(fb.created_at).toLocaleString() : ""}
              </div>
              {/* 추가적으로 프로젝트/작성자명 등 표시 */}
              <div className="text-xs text-gray-400">
                Project: {fb.project} {fb.username && ` | User: ${fb.username}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedbackAdminPage;
