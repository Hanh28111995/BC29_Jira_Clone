import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function NoAuthGuards() {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.userReducer);
  // const [pathname] = useLocation();

  useEffect(() => {
    if (userState.userInfor) {
      navigate("/dashboard")
    }
  }, []);
  return (
    <Outlet />
  )
}
