import axios from "axios";
import { BASE_URL, USER_KEY } from "../constants/common";

export const request = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor
request.interceptors.request.use((config) => {
  // Sửa lại cho đúng chuẩn chuỗi key 'accessToken'
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

let refreshing = false;   // chặn nhiều request cùng trigger refresh

// Response Interceptor
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);

    original._retry = true;

    if (refreshing) {
      // Đang refresh rồi: chờ 1 nhịp rồi thử lại request cũ
      return new Promise((resolve, reject) => {
        const wait = setInterval(() => {
          if (!refreshing) {
            clearInterval(wait);
            const token = localStorage.getItem('accessToken');
            if (token) original.headers.Authorization = `Bearer ${token}`;
            request(original).then(resolve).catch(reject);
          }
        }, 100);
      });
    }

    refreshing = true;
    try {      
      const res = await axios.post(`${BASE_URL}/api/Auth/refresh`, {}, { withCredentials: true });
      const newToken = res.data?.content?.accessToken;
      if (!newToken) throw new Error('no token');

      localStorage.setItem('accessToken', newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return request(original);
    } catch (refreshError) {
      // Xóa sạch thông tin đăng nhập khi refresh token thất bại/hết hạn
      localStorage.removeItem('accessToken');
      localStorage.removeItem(USER_KEY); 
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }
  }
);