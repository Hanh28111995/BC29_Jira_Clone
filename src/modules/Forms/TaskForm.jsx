import React, { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  InputNumber,  
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setTaskModal } from "store/actions/user.action";
import { Editor } from "@tinymce/tinymce-react";


const TINYMCE_CONFIG = {
  height: 250,
  menubar: false,
  plugins: [
    "advlist autolink lists link image charmap print preview anchor",
    "searchreplace visualblocks code fullscreen",
    "insertdatetime media table paste code help wordcount",
  ],
  toolbar:
    "undo redo | formatselect | " +
    "bold italic backcolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
};

export default function TaskForm({   
  mode = "edit", 
  initialData = {},
  onSubmit,  
  submitting = false,
 }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const userState = useSelector((state) => state.userReducer);
  const metaData = userState.metaData || {};
  const projectMemList = userState.projectMemList || [];

  useEffect(() => {
    if (mode === "create") {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      taskName: initialData.taskName || "",
      description: initialData.description || "",
      statusId: initialData.statusId,
      priorityId: initialData.priorityId,
      taskTypeId: initialData.taskTypeId || initialData.typeId,
      estimateHours: initialData.estimateHours || 0,
      assigneeId: initialData.assigneeId || [],
      projectId: initialData.projectId,
    });
  }, [mode, initialData, form]);

  const handleFinish = (values) => {
    if (mode === "view") return;
    onSubmit?.(values);
  };

  const onClose = () => {
    dispatch(
      setTaskModal({
        title: "",
        setOpen: false,
        infor: null,
        data: {
          priorityId: null,
          taskTypeId: null,
          assigneeId: [],
          taskId: null,
          taskName: "",
          description: "",
          statusId: "",
          originalEstimate: 0,
          timeTrackingSpent: 0,
          timeTrackingRemaining: 0,
          projectId: null,
          estimateHours: 0,
        },
      }),
    );
  };

  return (
    <Form
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        statusId: metaData.status?.[0]?.statusId || "",
        priorityId: metaData.priority?.[0]?.priorityId || 1,
        taskTypeId: metaData.taskType?.[0]?.id || 1,
        estimateHours: 0,
      }}
    >
      <Form.Item
        name="taskName"
        label="Task Name"
        rules={[{ required: true, message: "Task name is required" }]}
      >
        <Input placeholder="Enter task name..." maxLength={150} />
      </Form.Item>

      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item name="projectId" label="Project ID" style={{ flex: 1 }}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="statusId"
          label="Status"
          style={{ flex: 1 }}
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select
            placeholder="Select status"
            options={metaData.status?.map((item) => ({
              label: item.statusName || item.status,
              value: item.statusId,
            }))}
          />
        </Form.Item>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item
          name="priorityId"
          label="Priority"
          style={{ flex: 1 }}
          rules={[{ required: true, message: "Please select priority" }]}
        >
          <Select
            placeholder="Select priority"
            options={metaData.priority?.map((item) => ({
              label: item.priority,
              value: item.priorityId,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="taskTypeId"
          label="Task Type"
          style={{ flex: 1 }}
          rules={[{ required: true, message: "Please select task type" }]}
        >
          <Select
            placeholder="Select task type"
            options={metaData.taskType?.map((item) => ({
              label: item.taskType || item.name,
              value: item.id || item.taskTypeId,
            }))}
          />
        </Form.Item>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item
          name="estimateHours"
          label="Estimate Hours"
          style={{ flex: 1 }}
        >
          <InputNumber style={{ width: "100%" }} min={0} placeholder="Hours" />
        </Form.Item>

        <Form.Item name="assigneeId" label="Assignees" style={{ flex: 1 }}>
          <Select
            mode="multiple"
            placeholder="Select assignees"
            options={projectMemList.map((u) => ({
              label: u.name || u.userName,
              value: u.userId || u.id,
            }))}
          />
        </Form.Item>
      </div>

      <Form.Item name="description" label="Description">
        <Editor
          apiKey="your-tinymce-api-key" // Nếu bạn có key, điền vào đây, hoặc để trống nếu dùng bản free/local
          value={form.getFieldValue("description") || ""}
          init={TINYMCE_CONFIG}
          onEditorChange={(content) => {
            form.setFieldsValue({ description: content });
          }}
        />
      </Form.Item>

      <Space
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "16px",
        }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={submitting}>
          {mode === "create" ? "Create Task" : "Save Changes"}
        </Button>
      </Space>
    </Form>
  );
}
