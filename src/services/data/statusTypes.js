import { request } from "../../configs/axios";


const GetAllStatusTypeApi = ()=> {
  return request({
    url: '/api/Status/get-all',
    method: 'GET',
})
};

const GetDetailStatusTypeApi = (id) => {
  return request({
url: `/api/Status/get-by-id/${id}`,
    method: 'GET',
  });
}

const AddStatusTypeApi = (data) => {
  return request({
    url: '/api/Status/create',
    method: 'POST',
    data,
  });
};

const UpdateStatusTypeApi = (id, data) => {
  return request({
    url: `/api/Status/update/${id}`,
    method: 'PUT',
    data,
  });
}

const DeleteStatusTypeApi = (id) => {
  return request({
    url: `/api/Status/delete/${id}`,
    method: 'DELETE',
  });
}

export { GetAllStatusTypeApi, GetDetailStatusTypeApi, AddStatusTypeApi, UpdateStatusTypeApi, DeleteStatusTypeApi};
