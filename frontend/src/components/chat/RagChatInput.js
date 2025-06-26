import React, { useState } from "react";

const RagChatInput = ({ sendMessage }) => {
  const [message, setMessage] = useState("");
  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };
  return (
    <div className="flex mt-2">
      <input
        className="border p-2 text-black font-semibold flex-1 rounded"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Enter Question"
      />
      <button onClick={handleSend} className="ml-2 bg-green-500 text-white px-4 rounded">
        Send
      </button>
    </div>
  );
};
export default RagChatInput;
