import axios from "axios";
import { BASE_URL, USER_KEY } from "../constants/common";
import { getAuth } from "firebase/auth";

export const request = axios.create({
  // proxy: false,    
  baseURL: BASE_URL,
  // withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

request.interceptors.request.use(async (config) => {  
  const savedData = localStorage.getItem(USER_KEY);
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);            
      const token = parsedData?.loginToken || parsedData?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }    
    //   const auth = getAuth();      
    //  const currentUser = await new Promise((resolve) => {        
    //     if (auth.currentUser) return resolve(auth.currentUser);        
    //     const unsubscribe = auth.onAuthStateChanged((user) => {
    //       unsubscribe();
    //       resolve(user);
    //     });
    //   });
      
    //   if (currentUser) {        
    //     const firebaseRealtimeToken = await currentUser.getIdToken();
    //     if (firebaseRealtimeToken) {
    //       config.headers["firebase-token"] = firebaseRealtimeToken;
    //     }
    //   }
    } catch (error) {
      console.error("Lỗi xử lý gửi token bảo mật:", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Lỗi hệ thống trả về:", error);    
    if (error.response?.status === 403) {
      alert("Phiên làm việc không hợp lệ hoặc đã thay đổi thiết bị. Vui lòng đăng nhập lại!");            
      localStorage.removeItem(USER_KEY);            
      const auth = getAuth();
      auth.signOut();            
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);