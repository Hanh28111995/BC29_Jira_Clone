import React, { useState } from "react";
import { Input, Button } from "antd";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const send = async () => {
    if (!text.trim()) return;
    await onSend(text.trim());
    setText("");
  };

  return (
    <div className="chat-input">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={send}
        placeholder="Nhập tin nhắn..."
        disabled={disabled}
      />
      <Button type="primary" onClick={send} disabled={disabled}>
        Gửi
      </Button>
    </div>
  );
}