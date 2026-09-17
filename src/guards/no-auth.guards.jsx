import { Navigate, Outlet } from "react-router-dom";
import { USER_KEY } from "constants/common";
import { isTokenExpired } from "constants/common";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.userInfo ?? parsed;
  } catch {
    return null;
  }
};

export default function NoAuthGuards() {
  const user = getStoredUser();
  const token = localStorage.getItem("accessToken");
  const authed = !!user && !!token && !isTokenExpired(token);

  if (authed) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}