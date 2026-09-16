import { 
  AuthActionTypes, 
  ProjectTaskActionTypes, 
  DefaultDataActionTypes 
} from "../types/user.type";

// ==========================================
// AUTH ACTIONS
// ==========================================
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

// ==========================================
// PROJECT & TASK GENERAL ACTIONS
// ==========================================
const setDate = (date) => ({
    type: ProjectTaskActionTypes.SET_DATE,
    payload: date,
});

const setuserSearch = (list) => ({
    type: ProjectTaskActionTypes.SEARCH_USER,
    payload: list,
});

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

// ==========================================
// MODAL STATE ACTIONS
// ==========================================
// Mở/đóng cờ boolean setTaskModal
const setTaskModal = (data) => ({
    type: ProjectTaskActionTypes.SET_TASK_MODAL,
    payload: data,
});

// Quản lý Modal Project (Title, Open, Form, Data)
const setProjectModal = (data) => ({
    type: ProjectTaskActionTypes.SET_PROJECT_MODAL,
    payload: data,
});


// ==========================================
// METADATA & LOOKUP ACTIONS
// ==========================================
const setCategory = (clist) => ({
    type: DefaultDataActionTypes.SET_CATEGORY_LIST,
    payload: clist,
});

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

// Action cũ giữ lại tương thích ngược nếu cần
const setEditDataProject = (data) => ({
    type: ProjectTaskActionTypes.SET_EDIT_DATA,
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
    setProjectModal,
    setTaskModal,
    setTaskTypeList,
    setPriorityList,
    setStatusList,
    setEditSubmit,
    setMyProject,
    setTaskDetail,
    setReRenderDetail,
    setProjectMemList,
};