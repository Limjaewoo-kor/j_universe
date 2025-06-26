import React from 'react';

const ChatBox = ({ messages, myId  }) => (
    <div className="overflow-auto  h-[400px] bg-gray-100 p-4 rounded">
         {messages.map((msg, idx) => {
            // msg: "3101b9 : ㅎㅎ"
            const [sender, ...contentArr] = msg.split(' : ');
            const content = contentArr.join(' : ');

            const isMine = sender === myId;
            return (
                <div
                    key={idx}
                    className={`mb-2 ${isMine ? "text-blue-600 font-bold" : "text-gray-800"}`}
                >
                    <span className="mr-2">{sender} :</span>
                    <span>{content}</span>
                </div>
            );
        })}
    </div>
);

export default ChatBox;

