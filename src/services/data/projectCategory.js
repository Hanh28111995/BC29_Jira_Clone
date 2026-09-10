import { request } from "../../configs/axios";

const GetAllProjectCategoryApi = () => {
  return request({
    url: '/api/Category/get-all',
    method: 'GET',
  });
};

const GetDetailProjectCategoryApi = (id) => {
  return request({
    url: `/api/Category/get-by-id/${id}`,
    method: 'GET',
  });
};

const AddProjectCategoryApi = (data) => {
  return request({
    url: '/api/Category/create',
    method: 'POST',
    data,
  });
};

const UpdateProjectCategoryApi = (id, data) => {
  return request({
    url: `/api/Category/update/${id}`,
    method: 'PUT',
    data,
  });
};

const DeleteProjectCategoryApi = (id) => {
  return request({
    url: `/api/Category/delete/${id}`,
    method: 'DELETE',
  });
};

export {
  GetAllProjectCategoryApi,
  GetDetailProjectCategoryApi,
  AddProjectCategoryApi,
  UpdateProjectCategoryApi,
  DeleteProjectCategoryApi,
};
