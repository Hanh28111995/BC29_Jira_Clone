import { request } from "../configs/axios";
import { GetAllPriorityTypeApi } from "./data/priorityTypes";
import { GetAllStatusTypeApi } from "./data/statusTypes";
import { GetAllTaskTypeApi } from "./data/taskTypes";
import {
  AddTaskApi,
  GetDetailTaskApi,
  fetchGetTaskDetailAPI,
  fetchCreateTaskAPI,
  fetchUpdateStatusAPI,
  fetchUpdatePriorityAPI,
  fetchUpdateEstimateAPI,
  fetchUpdateDescriptionAPI,
  fetchUpdateTimeTrackingAPI,
  fetchUpdateAllOfTaskAPI,
  fetchDeleteTaskAPI,
} from "./task";
import {
  fetchGetUserAPI,
  fetchMembersListAPI,
} from "./user";

/* ============================================================
 * NHÓM 1: CRUD PROJECT CƠ BẢN
 * ============================================================ */

const GetAllProjectApi = () =>
  request({
    url: "/api/Project/get-all-project",
    method: "GET",
  });

const GetDetailProjectApi = (id) =>
  request({
    url: `/api/Project/get-project-detail/${id}`,
    method: "GET",
  });

const AddProjectApi = (data) =>
  request({
    url: "/api/Project/create-project",
    method: "POST",
    data,
  });

const UpdateProjectApi = (id, data) =>
  request({
    url: `/api/Project/update-project/${id}`,
    method: "PUT",
    data,
  });

const DeleteProjectApi = (id) =>
  request({
    url: `/api/Project/delete-project/${id}`,
    method: "DELETE",
  });

/* ============================================================
 * NHÓM 2: QUẢN LÝ THÀNH VIÊN CỦA DỰ ÁN
 * ============================================================ */

const AddProjectMembersApi = (data) =>
  request({
    url: "/api/Project/assign-user-project",
    method: "POST",
    data,
  });

const RemoveProjectMembersApi = (data) =>
  request({
    url: "/api/Project/remove-user-from-project",
    method: "POST",
    data,
  });

/* ============================================================
 * NHÓM 3: TASK THEO DỰ ÁN (GÓC NHÌN PROJECT)
 * ============================================================ */

const GetProjectTasksApi = (projectId) =>
  request({
    url: `/api/Project/get-project-tasks/${projectId}`,
    method: "GET",
  });

/* ============================================================
 * NHÓM 4: DANH MỤC / METADATA LIÊN QUAN PROJECT (Priority/Status/TaskType)
 * ============================================================ */

const fetchProjectPriorityAPI = GetAllPriorityTypeApi;
const fetchProjectStatusIdAPI = GetAllStatusTypeApi;
const fetchProjectTaskTypeAPI = GetAllTaskTypeApi;

/* ============================================================
 * NHÓM 5: ALIAS (TÊN GỌI NGẮN - DÙNG CHO CÁC COMPONENT CŨ)
 *   Giữ nguyên export để không phá vỡ các component đang dùng
 * ============================================================ */

const fetchProjectListAPI = GetAllProjectApi;
const fetchProjectDetailAPI = GetDetailProjectApi;
const fetchUpdateProjectDetailAPI = UpdateProjectApi;
const fetchCreateProjectAPI = AddProjectApi;
const fetchDeleteProjectAPI = DeleteProjectApi;
const fetchAddUserAPI = AddProjectMembersApi;
const fetchRemoveUserFromProjectAPI = RemoveProjectMembersApi;

export {
  GetAllProjectApi,
  GetDetailProjectApi,
  AddProjectApi,
  UpdateProjectApi,
  DeleteProjectApi,
  AddProjectMembersApi,
  RemoveProjectMembersApi,
  GetProjectTasksApi,
  GetProjectCategoryApi,
  fetchProjectListAPI,
  fetchProjectDetailAPI,
  fetchUpdateProjectDetailAPI,
  fetchCreateProjectAPI,
  fetchDeleteProjectAPI,
  fetchAddUserAPI,
  fetchRemoveUserFromProjectAPI,
  fetchProjectPriorityAPI,
  fetchProjectTaskTypeAPI,
  fetchProjectStatusIdAPI,
  fetchProjectCategoryAPI,
  fetchGetUserAPI,
  fetchMembersListAPI,
  fetchGetTaskDetailAPI,
  fetchCreateTaskAPI,
  fetchUpdateStatusAPI,
  fetchUpdatePriorityAPI,
  fetchUpdateEstimateAPI,
  fetchUpdateDescriptionAPI,
  fetchUpdateTimeTrackingAPI,
  fetchUpdateAllOfTaskAPI,
  fetchDeleteTaskAPI,
};
