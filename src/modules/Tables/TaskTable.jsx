import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  notification,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTaskModal } from "store/actions/user.action";
import TaskForm from "modules/Forms/TaskForm";
import { GetAllTaskApi, GetDetailTaskApi, DeleteTaskApi } from "services/task";
import { useAsync } from "hooks/useAsync";
import { initialTaskDetailModal } from "store/reducers/user.reducer";

export default function TaskTable() {
  const [searchText, setSearchText] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loadingState, setLoadingState] = useState({ isLoading: false });
  
  const userState = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const taskModalState = userState?.taskModal || {};

  // Lấy danh sách Task từ API thông qua hook useAsync
  const { state } = useAsync({
    dependencies: [toggle],
    service: () => GetAllTaskApi(),
  });

  const data = Array.isArray(state)
    ? state
    : Array.isArray(state?.resultObject)
      ? state.resultObject
      : Array.isArray(state?.data?.resultObject)
        ? state.data.resultObject
        : [];

  const [taskList, setTaskList] = useState(data);

  useEffect(() => {
    if (data.length === 0) return;
    setTaskList(data);
  }, [data]);

  // ==========================================
  // 1. HANDLE DELETE TASK (Xóa)
  // ==========================================
  const handleDeleteTask = (projectId, taskId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          setLoadingState({ isLoading: true });
          await DeleteTaskApi(projectId, taskId);
          setLoadingState({ isLoading: false });
          notification.success({ description: "Delete Task Successfully!" });
          setToggle((t) => !t);
        } catch (error) {
          setLoadingState({ isLoading: false });
          notification.error({ description: "Delete Failed!" });
        }
      },
    });
  };

  // ==========================================
  // 2. HANDLE EDIT TASK (Cập nhật)
  // ==========================================
  const handleEditTask = async (projectId, taskId) => {
    try {
      const result = await GetDetailTaskApi(projectId, taskId);
      const taskDetail = result?.data?.resultObject ?? result?.resultObject ?? result?.data?.content ?? {};
      
      dispatch(
        setTaskModal({
          title: "Edit Task",
          setOpen: true,
          infor: <TaskForm mode="edit" initialData={taskDetail} />,
        })
      );
    } catch (error) {
      notification.error({ description: "Cannot load task details!" });
    }
  };

  // ==========================================
  // 3. HANDLE CREATE TASK (Thêm mới)
  // ==========================================
  const handleCreateTask = (projectId) => {
    console.log("Đang mở modal Create cho project:", projectId);
    dispatch(
      setTaskModal({
        title: "Create Task",
        setOpen: true,
        infor: <TaskForm mode="create" initialData={{ projectId, ...initialTaskDetailModal }} />,
      })
    );
  };

  // ==========================================
  // Cấu hình cột bảng Task
  // ==========================================
  const columns = [
    {
      title: "TASK NAME / PROJECT",
      dataIndex: "taskName",
      key: "taskName",
      render: (text, record) => {
        if (record.isProjectHeader) {
          return (
            <Space style={{ fontWeight: 600, fontSize: "14px", color: "#1890ff" }}>
              <FolderOutlined />
              <span>{record.projectName}</span>
            </Space>
          );
        }
        return <span style={{ paddingLeft: "24px", fontWeight: 400 }}>- {text}</span>;
      },
    },
    {
      title: "STATUS",
      dataIndex: "statusName",
      key: "statusName",
      width: 150,
      render: (status, record) => {
        if (record.isProjectHeader) return null;
        let color = "default";
        if (status === "IN PROGRESS") color = "processing";
        if (status === "DONE") color = "success";
        return <Tag color={color}>{status || "PENDING"}</Tag>;
      },
    },
    {
      title: "PRIORITY",
      dataIndex: "priorityName", // Sửa lại thành priorityName dựa theo res trả về
      key: "priority",
      width: 120,
      render: (priority, record) => {
        if (record.isProjectHeader) return null;
        let color = "geekblue";
        if (priority === "High" || priority === "Urgent") color = "volcano";
        if (priority === "Medium") color = "gold";
        return <Tag color={color}>{priority || "Normal"}</Tag>;
      },
    },
    {
      title: "ACTION",
      key: "action",
      width: 150,
      render: (_, record) => {
        if (record.isProjectHeader) {
          return (
            <Button
              type="primary"
              size="small"
              ghost
              icon={<PlusOutlined />}
              onClick={() => handleCreateTask(record.projectId)}
            >
              Create Task
            </Button>
          );
        }
        return (
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => handleEditTask(record.projectId, record.id)}
              title="Edit Task"
            />
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              onClick={() => handleDeleteTask(record.projectId, record.id)}
              title="Delete Task"
            />
          </Space>
        );
      },
    },
  ];

  // ==========================================
  // Gom nhóm task theo projectId từ mảng phẳng của res
  // ==========================================
  const groupedProjects = {};
  taskList.forEach((item) => {
    const pId = item.projectId ;
    const pName = item.projectName ;

    if (!groupedProjects[pId]) {
      groupedProjects[pId] = {
        projectId: pId,
        projectName: pName,
        tasks: [],
      };
    }
    groupedProjects[pId].tasks.push(item);
  });

  // Tạo dataSource chuẩn chỉnh cho Table, đảm bảo key hoàn toàn duy nhất
  const dataSource = [];
  Object.values(groupedProjects).forEach((proj, projIndex) => {
    // 1. Dòng Header của Dự án
    dataSource.push({
      key: `project-${proj.projectId}-${projIndex}`,
      isProjectHeader: true,
      projectId: proj.projectId,
      projectName: proj.projectName,
    });
    
    // 2. Các dòng Task con bên trong
    proj.tasks.forEach((task, taskIndex) => {
      dataSource.push({
        ...task,
        key: `task-${task.id ?? taskIndex}-${proj.projectId}-${projIndex}`,
        isProjectHeader: false,
      });
    });
  });

  return (
    <>
      <Card
        bordered={false}
        style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}
        bodyStyle={{ padding: "16px 24px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <Input
            placeholder="Search tasks..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{ width: "300px" }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={dataSource.filter(item => {
            if (!searchText) return true;
            if (item.isProjectHeader) return true; // Giữ lại tiêu đề nhóm khi tìm kiếm
            return item.taskName?.toLowerCase().includes(searchText.toLowerCase());
          })} 
          pagination={false} 
        />
      </Card>      
    </>
  );
}