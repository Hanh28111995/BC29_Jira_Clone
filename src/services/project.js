import { request } from "../configs/axios";
import { GetAllPriorityTypeApi } from "./data/priorityTypes";
import { GetAllStatusTypeApi } from "./data/statusTypes";
import { GetAllTaskTypeApi } from "./data/taskTypes";
import { AddTaskApi, GetDetailTaskApi } from "./task";


const GetAllProjectApi = ()=> {
  return request({
    url: '/api/Project/get-all-project',
    method: 'GET',
})
};

const GetDetailProjectApi = (id) => {
  return request({
    url: `/api/Project/get-project-detail/${id}`,
    method: 'GET',
  });
}

const AddProjectApi = (data) => {
  return request({
    url: '/api/Project/create-project',
    method: 'POST',
    data,
  });
};

const UpdateProjectApi = (id, data) => {
  return request({
    url: `/api/Project/update-project/${id}`,
    method: 'PUT',
    data,
  });
}

const DeleteProjectApi = (id) => {
  return request({
    url: `/api/Project/delete-project/${id}`,
    method: 'DELETE',
  });
}

const AddProjectMembersApi = (data) => {
  return request({
    url: '/api/Project/assign-user-project',
    method: 'POST',
    data,
  });
};

const RemoveProjectMembersApi = (data) => {
  return request({
    url: '/api/Project/remove-user-from-project',
    method: 'POST',
    data,
  });
};

const fetchProjectListAPI = GetAllProjectApi;
const fetchProjectPriorityAPI = GetAllPriorityTypeApi;
const fetchProjectTaskTypeAPI = GetAllTaskTypeApi;
const fetchProjectStatusIdAPI = GetAllStatusTypeApi;
const fetchCreateTaskAPI = AddTaskApi;
const fetchGetUserAPI = (keyword) => request({ url: '/api/Users/get-all-users', method: 'GET', params: { keyword } });
const fetchProjectCategoryAPI = () => request({ url: '/api/ProjectCategory/get-all', method: 'GET' });
const fetchProjectDetailAPI = GetDetailProjectApi;
const fetchUpdateProjectDetailAPI = UpdateProjectApi;
const fetchCreateProjectAPI = AddProjectApi;
const fetchDeleteProjectAPI = DeleteProjectApi;
const fetchAddUserAPI = AddProjectMembersApi;
const fetchRemoveUserFromProjectAPI = RemoveProjectMembersApi;
const fetchMembersListAPI = (projectId) => request({ url: `/api/Users/get-user-by-project/${projectId}`, method: 'GET' });
const fetchGetTaskDetailAPI = GetDetailTaskApi;
const fetchUpdateStatusAPI = (data) => request({ url: `/api/Tasks/update-status/${data.taskId}`, method: 'PUT', data });
const fetchUpdatePriorityAPI = (data) => request({ url: `/api/Tasks/update-priority/${data.taskId}`, method: 'PUT', data });
const fetchUpdateEstimateAPI = (data) => request({ url: `/api/Tasks/update-estimate/${data.taskId}`, method: 'PUT', data });
const fetchUpdateDescriptionAPI = (data) => request({ url: `/api/Tasks/update-description/${data.taskId}`, method: 'PUT', data });
const fetchUpdateTimeTrackingAPI = (data) => request({ url: `/api/Tasks/update-time-tracking/${data.taskId}`, method: 'PUT', data });
const fetchUpdateAllOfTaskAPI = (data) => request({ url: `/api/Tasks/update-task/${data.taskId}`, method: 'PUT', data });
const fetchDeleteTaskAPI = (taskId) => request({ url: `/api/Tasks/delete-task/${taskId}`, method: 'DELETE' });

export {
  GetAllProjectApi, GetDetailProjectApi, AddProjectApi, UpdateProjectApi,
  DeleteProjectApi, AddProjectMembersApi, RemoveProjectMembersApi,
  fetchProjectListAPI, fetchProjectPriorityAPI, fetchProjectTaskTypeAPI,
  fetchProjectStatusIdAPI, fetchCreateTaskAPI, fetchGetUserAPI,
  fetchProjectCategoryAPI, fetchProjectDetailAPI, fetchUpdateProjectDetailAPI,
  fetchCreateProjectAPI, fetchDeleteProjectAPI, fetchAddUserAPI,
  fetchRemoveUserFromProjectAPI, fetchMembersListAPI, fetchGetTaskDetailAPI,
  fetchUpdateStatusAPI, fetchUpdatePriorityAPI, fetchUpdateEstimateAPI,
  fetchUpdateDescriptionAPI, fetchUpdateTimeTrackingAPI,
  fetchUpdateAllOfTaskAPI, fetchDeleteTaskAPI,
};
