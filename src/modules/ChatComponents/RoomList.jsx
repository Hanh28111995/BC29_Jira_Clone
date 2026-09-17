import React, { useState } from "react";
import { List, Avatar, Spin, Select, Button, Tooltip } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";

export default function RoomList({
  rooms,
  activeRoom,
  loading,
  currentUserId,
  onSelect,
  onOpenDirect,
  users = [],
  canCreateGroup = false,
  onCreateGroup,
  roomName,
}) {
  const [keyword, setKeyword] = useState("");

  const userOptions = users
    .filter((u) => (u.userId ?? u.id) !== currentUserId)
    .map((u) => ({
      label: u.name,
      value: u.userId ?? u.id,
    }));

  return (
    <div className="chat-sidebar">
      {/* Ô 1: tìm user để mở DM */}
      <div className="chat-toolbar">
        <Select
          showSearch
          allowClear
          value={null}
          placeholder="Tìm người để nhắn tin..."
          options={userOptions}
          optionFilterProp="label"
          style={{ width: "100%" }}
          onSelect={(userId) => onOpenDirect?.(userId)}
        />
      </div>

      {/* Ô 2: tạo group — chỉ Manager/Admin */}
      {canCreateGroup && (
        <div className="chat-toolbar">
          <Button
            type="dashed"
            block
            icon={<UsergroupAddOutlined />}
            onClick={onCreateGroup}
          >
            Tạo nhóm chat
          </Button>
        </div>
      )}

      <h3 className="chat-sidebar-title">Phòng chat</h3>
      <Spin spinning={loading}>
        {rooms.length === 0 && !loading && (
          <p className="chat-empty-text">Chưa có phòng nào</p>
        )}
        <List
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item
              className={room.id === activeRoom?.id ? "active" : ""}
              onClick={() => onSelect(room)}
            >
              <Avatar>{roomName(room, currentUserId).charAt(0)}</Avatar>
              <span className="room-name">{roomName(room, currentUserId)}</span>
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
}