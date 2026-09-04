import { request } from "../configs/axios";



const getMemberListApi = ()=> {
  return request({
    url: '/api/Users/get-all-users-for-memberlist',
    method: 'GET',
})
};

const getUserListApi = ()=> {
  return request({
    url: '/api/Users/get-all-users',
    method: 'GET',
})
};

const getUserDetailApi = (id) => {
  return request({
    url: `/api/Users/get-user-detail/${id}`,
    method: 'GET',
  });
}


const deleteUserApi = (id) => {
  return request({
    url: `/api/Users/delete-user/${id}`,
    method: 'DELETE',
  });
}


const userListApi = getUserListApi;
const userDetailApi = getUserDetailApi;
const registerApi = (data) => request({ url: '/Users/signup', method: 'POST', data });
const updateUserApi = (data) => request({ url: 'Users/editUser', method: 'PUT', data });
const addUserApi = (data) => request({ url: '/QuanLyNguoiDung/ThemNguoiDung', method: 'POST', data });

export {
  getMemberListApi, getUserListApi, getUserDetailApi, deleteUserApi,
  userListApi, userDetailApi, registerApi, updateUserApi, addUserApi,
};
