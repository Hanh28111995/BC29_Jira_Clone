import React, { useEffect, useRef } from "react";
import { Spin } from "antd";

export default function MessageList({ messages, loading, currentUserId }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-body">
      <Spin spinning={loading}>
        {messages.map((m) => (
          <div key={m.id ?? `${m.senderId}-${m.sentAt}`}
               className={`msg ${m.senderId === currentUserId ? "mine" : ""}`}>
            <div className="bubble">{m.content}</div>
            <div className="time">
              {m.sentAt ? new Date(m.sentAt).toLocaleTimeString() : ""}
            </div>
          </div>
        ))}
      </Spin>
      <div ref={endRef} />
    </div>
  );
}