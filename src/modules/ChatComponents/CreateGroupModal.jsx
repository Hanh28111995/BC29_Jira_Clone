import React, { useState } from "react";
import { Modal, Form, Input, Select, notification } from "antd";
import { createGroupRoomApi } from "services/chat";


export default function CreateGroupModal({ open, onClose, users, currentUserId, onCreated }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const options = (users || [])
    .filter((u) => (u.userId ?? u.id) !== currentUserId)   // không tự thêm mình ở đây
    .map((u) => ({
      label: `${u.name} ${u.email ? `(${u.email})` : ""}`.trim(),
      value: u.userId ?? u.id,
    }));

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Creator phải nằm trong thành viên, nếu không sẽ không thấy phòng của mình
      const memberIds = [...new Set([currentUserId, ...values.memberIds])];

      const room = await createGroupRoomApi(values.name.trim(), memberIds);
      notification.success({ description: "Tạo group chat thành công" });
      form.resetFields();
      onCreated?.(room);
      onClose?.();
    } catch (err) {
      if (err?.errorFields) return;   // lỗi validate, antd đã hiện
      notification.error({
        description: err?.response?.data?.message || "Tạo group thất bại",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Tạo nhóm chat"
      open={open}
      onOk={handleOk}
      onCancel={() => { form.resetFields(); onClose?.(); }}
      okText="Tạo nhóm"
      cancelText="Hủy"
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên nhóm"
          rules={[{ required: true, message: "Vui lòng nhập tên nhóm" }]}
        >
          <Input placeholder="Ví dụ: Team Backend" maxLength={100} />
        </Form.Item>

        <Form.Item
          name="memberIds"
          label="Thành viên"
          rules={[
            { required: true, message: "Chọn ít nhất 2 thành viên" },
            {
              validator: (_, v) =>
                (v?.length ?? 0) >= 2
                  ? Promise.resolve()
                  : Promise.reject(new Error("Chọn ít nhất 2 thành viên")),
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Tìm và chọn thành viên..."
            options={options}
            showSearch
            optionFilterProp="label"
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}