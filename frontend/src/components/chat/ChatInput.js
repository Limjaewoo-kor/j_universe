import React, { useState } from 'react';

const ChatInput = ({ sendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        sendMessage(message);
        setMessage('');
    };

    return (
        <div className="flex mt-2">
            <input
                className="border p-2 text-black font-semibold flex-1 rounded"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enter message"
            />
            <button onClick={handleSend} className="ml-2 bg-blue-500 text-white px-4 rounded">
                Send
            </button>
        </div>
    );
};

export default ChatInput;
