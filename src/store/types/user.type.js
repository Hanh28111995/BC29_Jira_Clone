// ///// 1. Project & Task UI State / Management
export const ProjectTaskActionTypes = {
    SET_DATE: "SET_DATE",
    SEARCH_USER: "SEARCH_USER",
    SET_EDIT_DATA: "SET_EDIT_DATA",
    SET_MY_PROJECT: "SET_MY_PROJECT",
    SET_TASK_DETAIL: "SET_TASK_DETAIL",
    SET_RENDER_DETAIL: "SET_RENDER_DETAIL",
    SET_PROJECT_MEMLIST: "SET_PROJECT_MEMLIST",
    SET_TASK_MODAL: "SET_TASK_MODAL",
};

// //// 2. Auth Group
export const AuthActionTypes = {
    SET_USER_INFO: "SET_USER_INFO",
    SET_TOKEN: "SET_TOKEN",
    SET_CREDENTIALS: "SET_CREDENTIALS",
    CLEAR_AUTH: "CLEAR_AUTH",
};

// /// 3. DefaultData Group (Metadata)
export const DefaultDataActionTypes = {
    SET_TASKTYPE_LIST: "SET_TASKTYPE_LIST",
    SET_CATEGORY_LIST: "SET_CATEGORY_LIST",
    SET_PRIORITY_LIST: "SET_PRIORITY_LIST",
    SET_STATUS_LIST: "SET_STATUS_LIST",
};