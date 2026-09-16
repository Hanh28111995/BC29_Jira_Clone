import { isTokenExpired, USER_KEY } from "constants/common";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export default function NoAuthGuards() {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (!userState.userInfor) return;               
    const token = localStorage.getItem('accessToken');
    if (!token || isTokenExpired(token)) {      
      localStorage.removeItem('accessToken');
      localStorage.removeItem(USER_KEY);
      return;
    }
    navigate('/dashboard');
  }, [userState.userInfor]);

  return <Outlet />;
}