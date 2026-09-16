import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenExpired, USER_KEY } from '../constants/common';


export default function AuthGuards() {
  const userState = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!userState.userInfor || !token || isTokenExpired(token)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem(USER_KEY);
      navigate("/login");
    }
  }, [userState.userInfor, navigate]);

  return (
    <Outlet />
  );
}