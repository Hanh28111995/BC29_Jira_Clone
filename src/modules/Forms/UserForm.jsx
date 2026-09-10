import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
// import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useAsync } from "hooks/useAsync";
import { userDetailApi } from "services/user";
import { updateUserApi } from "services/user";
import { addUserApi } from "services/user";
import { userListApi } from "services/user";
import { registerApi } from "services/user";
export default function UserForm() {
  // const [img, setImg] = useState();
  // const [file, setFile] = useState();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = useParams();

  const { state: userDetail = [] } = useAsync({
    dependencies: [params.userId],
    service: () => userListApi(),
    codintion: !!params.userId,
  });

  const [user, setUser] = useState();

  useEffect(() => {
    if (userDetail) {
      let x = userDetail.filter((item) => {
        return item.userId == params.userId
      });
      if (x.length !== 0) {
        setUser(x);
        form.setFieldsValue({
          ...x[0],
          id: x[0].userId
        });
      }
    }
  }, [userDetail]);

  const handleSave = async (values) => {
    if (user) { await updateUserApi(values); }
    else { await registerApi(values); }
    notification.success({
      description: "Successfully !",
    });
    navigate("/project-management/user");

  };

  return (
    <Form
      form={form}
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 14,
      }}
      layout="vertical"
      initialValues={{
        id: "",
        password: "",
        name: "",
        email: "",
        phoneNumber: "",
      }}
      onFinish={handleSave}
      size={"default"}
    >
      <Form.Item label="Tài Khoản" name="id">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Mật khẩu" name="password">
        <Input placeholder="Enter your password" />
      </Form.Item>
      <Form.Item label="Họ tên" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <Form.Item label="Số điện thoại" name="phoneNumber">
        <Input />
      </Form.Item>
      <Form.Item className="mt-2">
        <Button htmlType="sumbit" type="prymary">
          SAVE
        </Button>
      </Form.Item>
    </Form>
  );
}
