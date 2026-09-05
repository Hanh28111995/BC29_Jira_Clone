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

const userSearch = (list) => ({
    type: ProjectTaskActionTypes.SEARCH_USER,
    payload: list,
});

const setCategory = (clist) => ({
    type: DefaultDataActionTypes.DEFAULT_CATEGORY,
    payload: clist,
});

const setEditDataProject = (data) => ({
    type: ProjectTaskActionTypes.SET_EDIT_DATA,
    payload: data,
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
    userSearch,
    setCategory,
    setEditDataProject,
    setEditSubmit,
    setMyProject,
    setTaskDetail,
    setReRenderDetail,
    setProjectMemList,
    setTaskModal,
};