import { request } from "../configs/axios";


const GetAllTaskApi = ()=> {
  return request({
    url: '/api/Tasks/get-all-task',
    method: 'GET',
})
};

const GetDetailTaskApi = (id) => {
  return request({
    url: `/api/Tasks/get-task-detail/${id}`,
    method: 'GET',
  });
}

const AddTaskApi = (data) => {
  return request({
    url: '/api/Tasks/create-task',
    method: 'POST',
    data,
  });
};

const UpdateTaskApi = (id, data) => {
  return request({
    url: `/api/Tasks/update-task/${id}`,
    method: 'PUT',
    data,
  });
}

const DeleteTaskApi = (id) => {
  return request({
    url: `/api/Tasks/delete-task/${id}`,
    method: 'DELETE',
  });
}


export { GetAllTaskApi, GetDetailTaskApi, AddTaskApi, UpdateTaskApi, DeleteTaskApi};
