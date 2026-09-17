import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";


export default function ChatWindow({ room, messages, loading, currentUserId, onSend, roomName }) {
  if (!room) {
    return (
      <div className="chat-main">
        <div className="chat-empty">Chọn một phòng để bắt đầu trò chuyện</div>
      </div>
    );
  }

  return (
    <div className="chat-main">
      <div className="chat-header">{roomName(room, currentUserId)}</div>
      <MessageList messages={messages} loading={loading} currentUserId={currentUserId} />
      <MessageInput onSend={onSend} disabled={!room} />
    </div>
  );
}