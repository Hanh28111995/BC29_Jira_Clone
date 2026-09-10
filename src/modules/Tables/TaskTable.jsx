import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setEditDataProject } from 'store/actions/user.action'; // Dùng chung action bật modal hoặc tạo action riêng tùy bạn
import TaskEditForm from './TaskEditForm'; // Component form sửa task của bạn
import { fetchTaskDetailAPI } from 'services/task'; // (Ví dụ gọi API lấy chi tiết task nếu cần)

export default function TaskTable({ tasks = [] }) {
    const dispatch = useDispatch();

    // Hàm xử lý khi bấm nút Edit trên một dòng Task
    const handleEditTask = async (taskId) => {
        try {
            // (Tùy chọn) Gọi API lấy chi tiết task nếu API của bạn yêu cầu
            const res = await fetchTaskDetailAPI(taskId);
            const taskData = res.data.content;
        
            // Bật Modal toàn cục và truyền component TaskEditForm vào
            dispatch(setEditDataProject({
                title: 'Edit Task',
                setOpen: true,                // Mở Modal
                infor: <TaskEditForm />,      // Truyền Form sửa task vào nội dung Modal
                data: taskData                // Lưu dữ liệu task để form tự động nhận diện qua props/redux
            }));
        } catch (error) {
            notification.error({
                description: 'Không thể lấy thông tin chi tiết task!',
            });
        }
    };

    // Định nghĩa các cột cho Ant Design Table
    const columns = [
        {
            title: 'Task ID',
            dataIndex: 'taskId',
            key: 'taskId',
            sorter: (a, b) => a.taskId - b.taskId,
        },
        {
            title: 'Task Name',
            dataIndex: 'taskName',
            key: 'taskName',
        },
        {
            title: 'Priority',
            dataIndex: 'priorityTask',
            key: 'priorityTask',
            render: (priority) => priority?.priority || 'Normal',
        },
        {
            title: 'Status',
            dataIndex: 'statusId',
            key: 'statusId',
            render: (statusId) => (
                <span className={`badge ${statusId === '1' ? 'bg-danger' : 'bg-primary'}`}>
                    {statusId === '1' ? 'PENDING' : 'IN PROGRESS'}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        ghost 
                        onClick={() => handleEditTask(record.taskId || record.id)}
                    >
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            <h3>Task Management</h3>
            <Table 
                columns={columns} 
                dataSource={tasks} 
                rowKey={(record) => record.taskId || record.id} 
            />
        </div>
    );
}
