const RagChatBox = ({ messages }) => (
  <div className="overflow-auto h-[400px] bg-white p-4 rounded shadow">
    {messages.map((msg, idx) => (
      <div key={idx} className={msg.role === "user" ? "text-blue-700" : "text-green-700"}>
        <b>{msg.role === "user" ? "나" : "챗봇"}</b>: {msg.content}
      </div>
    ))}
  </div>
);
export default RagChatBox;
