import React from "react";
import { Select } from "antd";
import "./index.scss";

export default function ChatPage({
  loading = false,
  members = [],
  rooms = [],
  selectedEmployee = null,
  onSelectMember = () => {},
  onSelectRoom = () => {},
  ChatBoxComponent = null, // Truyền component ChatBox của bạn vào đây
  currentUser = null,
}) {
  const selectOptions = members.map((room) => ({
    value: String(room.roomId || room.uid || room._id),
    label: room.userName,
  }));

  const activeRoomIdentifier =
    selectedEmployee?.roomId ||
    selectedEmployee?.uid ||
    selectedEmployee?._id;

  return (
    <div className="chat-page-container">
      {/* BÊN TRÁI: DANH SÁCH HISTORY CHAT */}
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <h3>Members</h3>
          <div className="search-box">
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Chọn người dùng để bắt đầu chat"
              optionFilterProp="label"
              value={selectedEmployee ? String(activeRoomIdentifier) : undefined}
              onChange={onSelectMember}
              options={selectOptions}
            />
          </div>
        </div>

        <div className="rooms-list">
          {loading ? (
            <div className="loading-text">Đang tải danh sách...</div>
          ) : rooms.length === 0 ? (
            <div className="empty-text">Không tìm thấy thành viên</div>
          ) : (
            rooms.map((room) => {
              const currentRoomIdentifier = room.roomId || room.uid || room._id;
              const isActive = String(currentRoomIdentifier) === String(activeRoomIdentifier);

              return (
                <div
                  key={currentRoomIdentifier}
                  className={`room-item ${isActive ? "active" : ""}`}
                  onClick={() => onSelectRoom(room)}
                >
                  <div className="avatar-mock">
                    {room.avatar ? (
                      <img
                        src={room.avatar}
                        alt={room.userName}
                        className="user-avatar-img"
                      />
                    ) : (
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                      </svg>
                    )}
                  </div>
                  <div className="room-info room-info-column">
                    <h4>{room.userName}</h4>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* BÊN PHẢI: KHUNG CHATBOX */}
      {selectedEmployee && ChatBoxComponent ? (
        <ChatBoxComponent key={activeRoomIdentifier} currentUser={currentUser} />
      ) : (
        <div className="no-active-room">
          <p>Chọn một cuộc hội thoại để bắt đầu chat</p>
        </div>
      )}
    </div>
  );
}