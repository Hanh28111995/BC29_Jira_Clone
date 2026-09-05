import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {notification} from 'antd';

export default function AdminGuards() {
  const userState = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userState.userInfor) {
      return navigate("/login");
    }
    const role = userState.userInfor?.role || userState.userInfor?.maLoaiNguoiDung;
    if (role !== "Admin" && role !== "QuanTri")
    {
      notification.warning({
        message: "Khách hàng không thể truy cập trang Admin",
      });
      return navigate("/");
    }
    
  }, []);
  return <Outlet />;
}
