import { request } from "../configs/axios";


const GetAllProjectApi = () =>
  request({
    url: "/api/Projects/get-all-project",
    method: "GET",
  });

const GetDetailProjectApi = (id) =>
  request({
    url: `/api/Projects/get-project-detail/${id}`,
    method: "GET",
  });

const AddProjectApi = (data) =>
  request({
    url: "/api/Projects/create-project",
    method: "POST",
    data,
  });

const UpdateProjectApi = (id, data) =>
  request({
    url: `/api/Projects/update-project/${id}`,
    method: "PUT",
    data,
  });

const DeleteProjectApi = (id) =>
  request({
    url: `/api/Projects/delete-project/${id}`,
    method: "DELETE",
  });

/* ============================================================
 * NHÓM 2: QUẢN LÝ THÀNH VIÊN CỦA DỰ ÁN
 * ============================================================ */

const AddProjectMembersApi = (data) =>
  request({
    url: "/api/Projects/assign-user-project",
    method: "POST",
    data,
  });

const RemoveProjectMembersApi = (data) =>
  request({
    url: "/api/Projects/remove-user-from-project",
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
  fetchProjectListAPI,
  fetchProjectDetailAPI,
  fetchUpdateProjectDetailAPI,
  fetchCreateProjectAPI,
  fetchDeleteProjectAPI,
  fetchAddUserAPI,
  fetchRemoveUserFromProjectAPI,    
};
