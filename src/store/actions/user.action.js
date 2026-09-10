import { 
  AuthActionTypes, 
  ProjectTaskActionTypes, 
  DefaultDataActionTypes 
} from "../types/user.type";

const setUserInfoAction = (data) => ({
    type: AuthActionTypes.SET_USER_INFO,
    payload: data,
});

const setTokenAction = (token) => ({
    type: AuthActionTypes.SET_TOKEN,
    payload: token,
});

const setCredentialsAction = ({ accessToken, userInfo }) => ({
    type: AuthActionTypes.SET_CREDENTIALS,
    payload: { accessToken, userInfo },
});

const clearAuthAction = () => ({
    type: AuthActionTypes.CLEAR_AUTH,
});

const setDate = (date) => ({
    type: ProjectTaskActionTypes.SET_DATE,
    payload: date,
});

const setuserSearch = (list) => ({
    type: ProjectTaskActionTypes.SEARCH_USER,
    payload: list,
});

const setCategory = (clist) => ({
    type: DefaultDataActionTypes.SET_CATEGORY_LIST, // Cập nhật lại type cho khớp với DefaultDataActionTypes
    payload: clist,
});

// Action cũ (có thể giữ lại nếu project cũ đang dùng, hoặc thay thế dần)
const setEditDataProject = (data) => ({
    type: ProjectTaskActionTypes.SET_EDIT_DATA,
    payload: data,
});

// ==========================================
// CÁC ACTIONS MỚI CHO MODAL & METADATA TÁCH BIỆT
// ==========================================

// Action mở/cập nhật Modal Project
const setProjectModal = (data) => ({
    type: ProjectTaskActionTypes.SET_PROJECT_MODAL,
    payload: data,
});

// Action mở/cập nhật Modal Task Edit
const setTaskModalEdit = (data) => ({
    type: ProjectTaskActionTypes.SET_TASK_MODAL_EDIT,
    payload: data,
});

// Các Action cập nhật Metadata vào nhóm riêng biệt
const setTaskTypeList = (data) => ({
    type: DefaultDataActionTypes.SET_TASKTYPE_LIST,
    payload: data,
});

const setPriorityList = (data) => ({
    type: DefaultDataActionTypes.SET_PRIORITY_LIST,
    payload: data,
});

const setStatusList = (data) => ({
    type: DefaultDataActionTypes.SET_STATUS_LIST,
    payload: data,
});

// ==========================================
// CÁC ACTIONS HIỆN TẠI KHÁC
// ==========================================
const setEditSubmit = (data) => ({
    type: ProjectTaskActionTypes.SET_SUBMIT,
    payload: data,
});

const setMyProject = (data) => ({
    type: ProjectTaskActionTypes.SET_MY_PROJECT,
    payload: data,
});

const setTaskDetail = (data) => ({
    type: ProjectTaskActionTypes.SET_TASK_DETAIL,
    payload: data,
});

const setReRenderDetail = (data) => ({
    type: ProjectTaskActionTypes.SET_RENDER_DETAIL,
    payload: data,
});

const setProjectMemList = (data) => ({
    type: ProjectTaskActionTypes.SET_PROJECT_MEMLIST,
    payload: data,
});

const setTaskModal = (data) => ({
    type: ProjectTaskActionTypes.SET_TASK_MODAL,
    payload: data,
});

export {
    setUserInfoAction,
    setTokenAction,
    setCredentialsAction,
    clearAuthAction,
    setDate,
    setuserSearch,
    setCategory,
    setEditDataProject,
    // Export thêm các actions mới
    setProjectModal,
    setTaskModalEdit,
    setTaskTypeList,
    setPriorityList,
    setStatusList,
    // Các actions cũ giữ nguyên
    setEditSubmit,
    setMyProject,
    setTaskDetail,
    setReRenderDetail,
    setProjectMemList,
    setTaskModal,
};