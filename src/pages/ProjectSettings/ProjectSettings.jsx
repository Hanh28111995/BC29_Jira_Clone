import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useAsync } from "hooks/useAsync";
import {
  AddProjectMembersApi,
  GetDetailProjectApi,
  RemoveProjectMembersApi,
  UpdateProjectApi,
} from "services/project";

const getMemberId = (member) => member?.userId ?? member?.id;
const getMemberName = (member) => member?.name || member?.userName || member?.email || "Unknown user";
const getCategoryName = (category) =>
  category?.categoryName || category?.name || category?.projectCategoryName || `#${category?.id}`;

export default function ProjectSettings() {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.userReducer);
  const categories = Array.isArray(userState.metaData?.category) ? userState.metaData.category : [];
  const userPool = Array.isArray(userState.list) ? userState.list : [];
  const [form] = Form.useForm();
  const [selectedUserId, setSelectedUserId] = useState();
  const [saving, setSaving] = useState(false);
  const [memberActionId, setMemberActionId] = useState(null);

  const {
    state: project,
    loading,
    isError,
    refetch,
  } = useAsync({
    service: () => GetDetailProjectApi(projectId),
    queryKey: ["project-detail", projectId],
    enabled: Boolean(projectId),
  });

  useEffect(() => {
    if (!project) return;
    form.setFieldsValue({
      projectName: project.projectName || "",
      description: project.description || "",
      categoryId: project.categoryId,
    });
  }, [form, project]);

  const members = Array.isArray(project?.members) ? project.members : [];
  const memberIds = useMemo(
    () => new Set(members.map(getMemberId).filter((id) => id != null).map(String)),
    [members],
  );
  const availableUsers = userPool.filter((user) => {
    const id = user?.userId ?? user?.id;
    return id != null && !memberIds.has(String(id));
  });

  const refreshProject = async () => {
    await refetch();
    await queryClient.invalidateQueries({ queryKey: ["project-list"] });
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await UpdateProjectApi(projectId, {
        ...values,
        creatorId: project?.creator?.id ?? project?.creatorId,
      });
      notification.success({ message: "Project settings saved" });
      await refreshProject();
    } catch (error) {
      notification.error({
        message: "Could not save project settings",
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (selectedUserId == null) return;
    setMemberActionId(String(selectedUserId));
    try {
      await AddProjectMembersApi({ projectId, userId: selectedUserId });
      setSelectedUserId(undefined);
      notification.success({ message: "Member added to project" });
      await refreshProject();
    } catch (error) {
      notification.error({
        message: "Could not add member",
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setMemberActionId(null);
    }
  };

  const handleRemoveMember = async (member) => {
    const userId = getMemberId(member);
    setMemberActionId(String(userId));
    try {
      await RemoveProjectMembersApi({ projectId, userId });
      notification.success({ message: "Member removed from project" });
      await refreshProject();
    } catch (error) {
      notification.error({
        message: "Could not remove member",
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setMemberActionId(null);
    }
  };

  const memberColumns = [
    {
      title: "Member",
      key: "member",
      render: (_, member) => (
        <Space>
          <Avatar src={member.avatar}>{getMemberName(member).charAt(0).toUpperCase()}</Avatar>
          <span>{getMemberName(member)}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "—",
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, member) => (
        <Popconfirm
          title={`Remove ${getMemberName(member)} from this project?`}
          onConfirm={() => handleRemoveMember(member)}
          okText="Remove"
          cancelText="Cancel"
        >
          <Button
            danger
            type="text"
            icon={<UserDeleteOutlined />}
            loading={memberActionId === String(getMemberId(member))}
            aria-label={`Remove ${getMemberName(member)}`}
          />
        </Popconfirm>
      ),
    },
  ];

  if (isError) {
    return (
      <Card>
        <Typography.Text type="danger">Unable to load this project’s settings.</Typography.Text>
        <Button type="link" onClick={() => refetch()}>Try again</Button>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 4 }}>Project Settings</Typography.Title>
        <Typography.Text type="secondary">
          Manage project details and the people working on this project.
        </Typography.Text>
      </div>

      <Card title="Project details" loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ maxWidth: 720 }}
        >
          <Form.Item
            name="projectName"
            label="Project name"
            rules={[{ required: true, message: "Enter a project name" }]}
          >
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item name="categoryId" label="Category">
            <Select
              allowClear
              placeholder="Select a category"
              options={categories.map((category) => ({
                label: getCategoryName(category),
                value: category.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={5} maxLength={2000} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={saving} disabled={!project}>
            Save changes
          </Button>
        </Form>
      </Card>

      <Card
        title={`Project members (${members.length})`}
        extra={
          <Space>
            <Select
              showSearch
              allowClear
              placeholder="Select a user"
              value={selectedUserId}
              onChange={setSelectedUserId}
              optionFilterProp="label"
              style={{ minWidth: 220 }}
              options={availableUsers.map((user) => ({
                label: getMemberName(user),
                value: user.userId ?? user.id,
              }))}
            />
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={handleAddMember}
              disabled={selectedUserId == null}
              loading={memberActionId === String(selectedUserId)}
            >
              Add member
            </Button>
          </Space>
        }
      >
        <Table
          rowKey={(member) => String(getMemberId(member))}
          columns={memberColumns}
          dataSource={members}
          pagination={false}
          locale={{ emptyText: "No members in this project yet" }}
        />
      </Card>
    </Space>
  );
}
