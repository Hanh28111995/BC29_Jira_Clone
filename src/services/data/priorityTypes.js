import { request } from "../../configs/axios";


const GetAllPriorityTypeApi = ()=> {
  return request({
    url: '/api/Priority/get-all',
    method: 'GET',
})
};

const GetDetailPriorityTypeApi = (id) => {
  return request({
    url: `/api/Priority/get-by-id/${id}`,
    method: 'GET',
  });
}

const AddPriorityTypeApi = (data) => {
  return request({
    url: '/api/Priority/create',
    method: 'POST',
    data,
  });
};

const UpdatePriorityTypeApi = (id, data) => {
  return request({
    url: `/api/Priority/update/${id}`,
    method: 'PUT',
    data,
  });
}

const DeletePriorityTypeApi = (id) => {
  return request({
    url: `/api/Priority/delete/${id}`,
    method: 'DELETE',
  });
}

export { GetAllPriorityTypeApi, GetDetailPriorityTypeApi, AddPriorityTypeApi, UpdatePriorityTypeApi, DeletePriorityTypeApi};
