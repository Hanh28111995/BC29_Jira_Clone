import React, { useEffect, useState } from "react";
import { notification } from "antd";
import { getRoomsApi, createDirectRoomApi, getMessagesApi } from "../../services/chat";

import "./index.scss";
import useChatConnection from "hooks/useChatConnection";
import RoomList from "modules/ChatComponents/RoomList";
import ChatWindow from "modules/ChatComponents/ChatWindow";
import CreateGroupModal from "modules/ChatComponents/CreateGroupModal";
import { useSelector } from "react-redux";

const getCurrentUserId = () => {
  try {
    const raw = JSON.parse(localStorage.getItem("USER_KEY") || "{}");
    return raw?.id ?? raw?.userInfo?.id ?? null;
  } catch {
    return null;
  }
};

const getRoomName = (room, currentUserId) => {
  if (room.type === "Group") return room.name || "Group";
  const other = room.members?.find((m) => m.userId !== currentUserId);
  return other?.user?.name || other?.name || `User ${other?.userId ?? "?"}`;
};

export default function ChatPage() {
  const users = useSelector((s) => s.userReducer.list || []);
const [groupModalOpen, setGroupModalOpen] = useState(false);

const currentUser = useSelector((s) => s.userReducer.userInfor);
const role = (currentUser?.roles || currentUser?.role || "").toLowerCase();
const canCreateGroup = role === "manager" || role === "admin";

  const currentUserId = getCurrentUserId();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);

  // Tin mới từ hub: chỉ nhận nếu thuộc phòng đang mở
  const { connectionRef, connected } = useChatConnection((msg) => {
    setMessages((prev) => (msg.roomId === activeRoomRef.current?.id ? [...prev, msg] : prev));
  });

  // Giữ phòng đang mở trong ref để callback hub không cần re-subscribe
  const activeRoomRef = React.useRef(null);
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    getRoomsApi()
      .then((data) => setRooms(Array.isArray(data) ? data : []))
      .catch(() => notification.error({ description: "Không tải được danh sách phòng" }))
      .finally(() => setLoadingRooms(false));
  }, []);

  const openRoom = async (room) => {
    setActiveRoom(room);
    setMessages([]);
    setLoadingMsg(true);

    try {
      const data = await getMessagesApi(room.id);
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      notification.error({ description: "Không tải được tin nhắn" });
    } finally {
      setLoadingMsg(false);
    }

    try {
      await connectionRef.current?.invoke("JoinRoom", String(room.id));
    } catch {
      /* noop */
    }
  };

  const handleSend = async (content) => {
    try {
      await connectionRef.current?.invoke("SendMessage", activeRoom.id, content);
    } catch {
      notification.error({ description: "Gửi tin thất bại" });
    }
  };

  const openDirect = async (userId) => {
    try {
      const room = await createDirectRoomApi(userId);
      setRooms((prev) => (prev.some((r) => r.id === room.id) ? prev : [room, ...prev]));
      openRoom(room);
    } catch {
      notification.error({ description: "Không mở được phòng trò chuyện" });
    }
  };

  return (
    <div className="chat-page">
      {!connected && <div className="chat-offline">Đang kết nối lại…</div>}
      <RoomList
  rooms={rooms}
  activeRoom={activeRoom}
  loading={loadingRooms}
  currentUserId={currentUserId}
  onSelect={openRoom}
  onOpenDirect={openDirect}
  users={users}
  canCreateGroup={canCreateGroup}
  onCreateGroup={() => setGroupModalOpen(true)}
  roomName={getRoomName}
/>

<ChatWindow
  room={activeRoom}
  messages={messages}
  loading={loadingMsg}
  currentUserId={currentUserId}
  onSend={handleSend}
  roomName={getRoomName}
/>

<CreateGroupModal
  open={groupModalOpen}
  onClose={() => setGroupModalOpen(false)}
  users={users}
  currentUserId={currentUserId}
  onCreated={(room) => {
    setRooms((prev) => [room, ...prev]);
    openRoom(room);
  }}
/>
    </div>
  );
}