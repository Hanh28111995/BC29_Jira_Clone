import { request } from "../configs/axios";

const body = (res) => res?.data?.content ?? res?.data ?? res;


 const getRoomsApi = () =>
  request({ url: "/api/Chat/rooms", method: "GET" }).then(body);

 const createDirectRoomApi = (userId) =>
  request({ url: "/api/Chat/rooms/direct", method: "POST", data: { userId } }).then(body);

 const createGroupRoomApi = (name, memberIds) =>
  request({ url: "/api/Chat/rooms/group", method: "POST", data: { name, memberIds } }).then(body);

 const getMessagesApi = (roomId, page = 1, pageSize = 50) =>
  request({ url: `/api/Chat/rooms/${roomId}/messages`, method: "GET", params: { page, pageSize } }).then(body);

 const sendMessageApi = (roomId, content) =>
  request({ url: `/api/Chat/rooms/${roomId}/messages`, method: "POST", data: { content } }).then(body);

 export{
    getRoomsApi, createDirectRoomApi,createGroupRoomApi,getMessagesApi,sendMessageApi
 }
