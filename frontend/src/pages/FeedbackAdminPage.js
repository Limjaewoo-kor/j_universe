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
    <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 px-2 sm:px-0">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-700 dark:text-blue-300">Feedback Admin</h2>
        {feedbacks.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center">No feedback yet.</div>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {feedbacks.map((fb, idx) => (
              <li key={fb.id || idx} className="p-3 sm:p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="font-semibold mb-1 text-sm sm:text-base">
                  Type: {fb.type ? fb.type : "N/A"}
                </div>
                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-2 text-sm">
                  {fb.feedback_text}
                </div>
                <div className="text-xs text-gray-400">
                  {fb.created_at ? new Date(fb.created_at).toLocaleString() : ""}
                </div>
                <div className="text-xs text-gray-400">
                  Project: {fb.project} {fb.username && ` | User: ${fb.username}`}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FeedbackAdminPage;
