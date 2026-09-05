import { request } from "../configs/axios";

/* ============================================================
 * NHÓM 1: CRUD USER CƠ BẢN
 * ============================================================ */

const getUserListApi = () =>
  request({
    url: "/api/Users/get-all-users",
    method: "GET",
  });

const getUserDetailApi = (id) =>
  request({
    url: `/api/Users/get-user-detail/${id}`,
    method: "GET",
  });

const createUserApi = (data) =>
  request({
    url: "/api/Auth/signup",
    method: "POST",
    data,
  });

const updateUserApi = (data) =>
  request({
    url: "/Users/editUser",
    method: "PUT",
    data,
  });

const deleteUserApi = (id) =>
  request({
    url: `/api/Users/delete-user/${id}`,
    method: "DELETE",
  });


const getMemberListApi = () =>
  request({
    url: "/api/Users/get-all-users-for-memberlist",
    method: "GET",
  });


const registerApi = (data) =>
  request({
    url: "/Users/signup",
    method: "POST",
    data,
  });

const userListApi = getUserListApi;
const userDetailApi = getUserDetailApi;


export {
  getUserListApi,
  getUserDetailApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getMemberListApi,
  registerApi,  
  userListApi,
  userDetailApi,  
};
