import { Drawer } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTaskModal } from 'store/actions/user.action'; // Hoặc setTaskModalEdit tùy action bạn đặt
import "./index.scss";
import { initialTaskDetailModal } from 'store/reducers/user.reducer';

export default function ModalEditTask() {
    const userState = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const taskModal = userState?.taskModal || {};

    const onClose = () => {
        dispatch(setTaskModal({
            title: '',
            setOpen: false,
            infor: null,
        }));
    };

    const onSave = () => {
        if (userState?.taskCallBackSubmit) {
            userState.taskCallBackSubmit();   
        }
        onClose();        
        navigate(0);
    };

    return (
        <Drawer
            title={taskModal.title}
            width={'85%'}
            onClose={onClose}
            open={taskModal.setOpen}
            bodyStyle={{ paddingBottom: 80 }}
            footer={false}
        >
            {taskModal.infor}
        </Drawer>
    );
}