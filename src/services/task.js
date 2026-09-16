import { request } from "../configs/axios";

/* ============================================================
 * NHÓM 1: CRUD TASK CƠ BẢN
 * ============================================================ */

const GetAllTaskApi = () =>
  request({
    url: "/api/Tasks/get-all-task",
    method: "GET",
  });

const GetDetailTaskApi = (projectId, taskId) =>
  request({
    url: `/api/Tasks/${projectId}/get-task-detail/${taskId}`,
    method: "GET",
  });

const AddTaskApi = (projectId ,data) =>
  request({
    url: `/api/Tasks/${projectId}/create-task`,
    method: "POST",
    data,
  });

const UpdateTaskApi = (projectId, taskId, data) =>
  request({
    url: `/api/Tasks/${projectId}/update-task/${taskId}`,
    method: "PUT",
    data,
  });

const DeleteTaskApi = (projectId, taskId) =>
  request({
    url: `/api/Tasks/${projectId}/delete-task/${taskId}`,
    method: "DELETE",
  });

export {
  GetAllTaskApi,
  GetDetailTaskApi,
  AddTaskApi,
  UpdateTaskApi,
  DeleteTaskApi,  
};
