import { Button, Drawer, Space } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setProjectModal } from 'store/actions/user.action';
import "./index.scss";

export default function ModalEditProject() {
    const userState = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const projectModal = userState?.projectModal || {};

    const onClose = () => {
        // Reset đúng action mà reducer xử lý
        dispatch(setProjectModal({
            title: '',
            setOpen: false,
            infor: null,
            // data: {
            //     id: 0,
            //     projectName: "",
            //     creator: 0,
            //     description: "",
            //     categoryId: ""
            // }
        }));
    };

    const onSave = () => {
        if (userState?.callBackSubmit) {
            userState.callBackSubmit();   
        }
        onClose();        
        navigate(0);
    };

    return (
        <Drawer
            title={projectModal.title}
            width={'85%'}
            onClose={onClose}
            open={projectModal.setOpen}
            bodyStyle={{ paddingBottom: 80 }}
            footer= {false}
        >
            {projectModal.infor}
        </Drawer>
    );
}