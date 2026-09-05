import { request } from "../configs/axios";

/* ============================================================
 * NHÓM 1: CRUD TASK CƠ BẢN
 * ============================================================ */

const GetAllTaskApi = (id) =>
  request({
    url: `/api/Tasks/get-all-task/${id}`,
    method: "GET",
  });

const GetDetailTaskApi = (id) =>
  request({
    url: `/api/Tasks/get-task-detail/${id}`,
    method: "GET",
  });

const AddTaskApi = (data) =>
  request({
    url: `/api/Tasks/create-task`,
    method: "POST",
    data,
  });

const UpdateTaskApi = (id, data) =>
  request({
    url: `/api/Tasks/update-task/${id}`,
    method: "PUT",
    data,
  });

const DeleteTaskApi = (id) =>
  request({
    url: `/api/Tasks/delete-task/${id}`,
    method: "DELETE",
  });

export {
  GetAllTaskApi,
  GetDetailTaskApi,
  AddTaskApi,
  UpdateTaskApi,
  DeleteTaskApi,  
};
