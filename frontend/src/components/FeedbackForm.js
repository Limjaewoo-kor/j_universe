import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = ({ onClose }) => {
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
      await axios.post(`${API_BASE_URL}/feedback`, {
        project: "rumble_chatbot",
        feedback_text: content,
        type: type // 백엔드가 지원한다면
      });
      setMsg("Thank you for your feedback!");
      setType("");
      setContent("");
    } catch (err) {
      setMsg("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-2">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-xl w-full max-w-md">
        <h2 className="text-base sm:text-lg font-bold mb-2">Send Feedback</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="mb-2 w-full p-2 border rounded text-black"
          >
            <option value="">Select Type</option>
            <option value="bug">Bug</option>
            <option value="suggestion">Suggestion</option>
            <option value="etc">Other</option>
          </select>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="가이드봇과 관련된 피드백은 질문/답변 형식으로 작성해주세요. Please provide feedback regarding the chatbot in a question/answer format."
            required
            className="mb-2 w-full p-2 border rounded text-black min-h-[120px] sm:min-h-[200px]"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600">Close</button>
            <button type="submit" className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">Submit</button>
          </div>
        </form>
        {msg && <div className="mt-2 text-green-500">{msg}</div>}
      </div>
    </div>
  );
};

export default FeedbackForm;
