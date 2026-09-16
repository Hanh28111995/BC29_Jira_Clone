import React, { useEffect } from "react";
import { Form, Input, Select, Button, Space, Descriptions, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setProjectModal } from 'store/actions/user.action';
import { Editor } from "@tinymce/tinymce-react";
import parse from "html-react-parser";

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

export default function ProjectForm({
  mode = "edit",
  initialData = {},
  onSubmit,  
  submitting = false,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { metaData } = useSelector((s) => s.userReducer);
  const categories = Array.isArray(metaData?.category) ? metaData.category : [];
  const users = Array.isArray(metaData?.users) ? metaData.users : [];
  const isView = mode === "view";

  useEffect(() => {
    if (mode === "create") {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      projectName: initialData.projectName || "",
      description: initialData.description || "",
      categoryId: initialData.categoryId,
      creatorId: initialData.creatorId,
    });
  }, [mode, initialData, form]);

  const handleFinish = (values) => {
    if (mode === "view") return;
    onSubmit?.(values);
  };

  const onClose = () => {
    dispatch(setProjectModal({
      title: '',
      setOpen: false,
      infor: null,
      data: {
        id: 0,
        projectName: "",
        creator: 0,
        description: "",
        categoryId: ""
      }
    }));
  };

  // ---------- MODE: VIEW (read-only) ----------
  if (isView) {
    const categoryName =
      categories.find((c) => String(c.id) === String(initialData.categoryId))
        ?.categoryName ||
      categories.find((c) => String(c.id) === String(initialData.categoryId))
        ?.name ||
      `#${initialData.categoryId}`;
    const creatorName =
      users.find((u) => String(u.id) === String(initialData.creatorId))?.name ||
      `#${initialData.creatorId}`;

    return (
      <Descriptions
        title="Project Information"
        bordered
        column={1}
        size="middle"
        labelStyle={{ fontWeight: 600, width: 140 }}
      >
        <Descriptions.Item label="Project Name">
          {initialData.projectName || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          <Tag color="geekblue">{categoryName}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Creator">
          <Tag color="green">{creatorName}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {initialData.description ? (
            <div>{parse(initialData.description)}</div>
          ) : (
            "—"
          )}
        </Descriptions.Item>
      </Descriptions>
    );
  }

  // ---------- MODE: EDIT / CREATE ----------
  return (
    <Form
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        projectName: initialData.projectName || "",
        description: initialData.description || "",
        categoryId: initialData.categoryId,
        creatorId: initialData.creatorId,
      }}
    >
      <Form.Item
        name="projectName"
        label="Project Name"
        rules={[{ required: true, message: "Project name is required" }]}
      >
        <Input placeholder="Enter project name" maxLength={100} />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Category"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select
          placeholder="Select category"
          options={categories.map((c) => ({
            label:
              c.categoryName || c.name || c.projectCategoryName || `#${c.id}`,
            value: c.id,
          }))}
        />
      </Form.Item>

      <Form.Item name="creatorId" label="Creator" hidden={mode === "create"}>
        <Select
          placeholder="Select creator"
          options={users.map((u) => ({ label: u.name, value: u.id }))}
        />
      </Form.Item>
      
      <Form.Item name="description" label="Description">
        <Editor
          value={form.getFieldValue("description") || ""}
          init={TINYMCE_CONFIG}
          onEditorChange={(content) =>
            form.setFieldsValue({ description: content })
          }
        />
      </Form.Item>

      <Space style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={submitting}>
          {mode === "create" ? "Create Project" : "Save Changes"}
        </Button>
      </Space>
    </Form>
  );
}