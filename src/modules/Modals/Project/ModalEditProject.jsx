import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setEditDataProject, setEditSubmit } from 'store/actions/user.action';
import "./index.scss";

const { Option } = Select;

export default function ModalEditProject() {
    const userState = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    const onSave = () => {
        if (userState?.callBackSubmit) {
            userState.callBackSubmit();
        }
        onClose();
        navigate(0);
    }

    const onClose = () => {
        // Sửa lại cấu trúc dispatch khớp với state projectModal
        dispatch(setEditDataProject({
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
        
        if (typeof setEditSubmit === 'function') {
            dispatch(setEditSubmit((propsValue) => { alert('click demo') }));
        }
    };

    // Lấy an toàn từ projectModal thay vì detail
    const projectModal = userState?.projectModal || {};

    return (
        <>
            <Drawer
                title={projectModal.title}
                width={'85%'}
                onClose={onClose}
                open={projectModal.setOpen}
                bodyStyle={{
                    paddingBottom: 80,
                }}
                footer={
                    <Space style={{ justifyContent: 'right', width: '100%' }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={onSave} type="primary">
                            Submit
                        </Button>
                    </Space>
                }
            >
                {projectModal.infor}
            </Drawer>
        </>
    )
}