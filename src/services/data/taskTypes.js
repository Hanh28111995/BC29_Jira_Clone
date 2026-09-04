import { request } from "../../configs/axios";


const GetAllTaskTypeApi = ()=> {
  return request({
    url: '/api/TaskType/get-all',
    method: 'GET',
})
};

const GetDetailTaskTypeApi = (id) => {
  return request({
    url: `/api/TaskType/get-by-id/${id}`,
    method: 'GET',
  });
}

const AddTaskTypeApi = (data) => {
  return request({
    url: '/api/TaskType/create',
    method: 'POST',
    data,
  });
};

const UpdateTaskTypeApi = (id, data) => {
  return request({
    url: `/api/TaskType/update/${id}`,
    method: 'PUT',
    data,
  });
}

const DeleteTaskTypeApi = (id) => {
  return request({
    url: `/api/TaskType/delete/${id}`,
    method: 'DELETE',
  });
}

export { GetAllTaskTypeApi, GetDetailTaskTypeApi, AddTaskTypeApi, UpdateTaskTypeApi, DeleteTaskTypeApi};
