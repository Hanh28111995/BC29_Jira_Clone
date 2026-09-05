import { USER_KEY } from "../../constants/common";
import { 
  AuthActionTypes, 
  ProjectTaskActionTypes, 
  DefaultDataActionTypes 
} from "../types/user.type";

let userInfor = null;
if (typeof window !== "undefined") {
  const rawUser = localStorage.getItem(USER_KEY);
  if (rawUser) {
    try {
      userInfor = JSON.parse(rawUser)?.userInfo || null;
    } catch {
      userInfor = null;
    }
  }
}

const savedAccessToken = (() => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.accessToken || parsed?.loginToken || null;
  } catch {
    return null;
  }
})();

const DEFAULT_STATE = {
  // Auth states
  userInfor,
  accessToken: savedAccessToken,

  // UI / Modal States
  setTaskModal: false,
  date: '',
  
  // Lists & Data
  list: [],       
  category: [],   
  myProject: [],  
  projectMemList: [],

  // Project Edit Detail State
  detail: {
    title: '',
    setOpen: false,
    infor: null,
    data: {
      id: 0,
      projectName: "",
      creator: 0,
      description: "",
      categoryId: ""
    },
    metaData: {
      taskType: [],
      priority: [],
      status: [],
      projectCategory: [],
    },
  },
  
  callBackSubmit: null,
  reRenderDetail: false,  
  taskDetailModal: {
    priorityTask: null,
    taskTypeDetail: null,
    assigness: [],
    lstComment: [],
    taskId: null,
    taskName: '',
    alias: '',
    description: '',
    statusId: '',
    originalEstimate: 0,
    timeTrackingSpent: 0,
    timeTrackingRemaining: 0,
    typeId: null,
    priorityId: null,
    projectId: null
  },
};

export const userReducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    // Auth Group
    case AuthActionTypes.SET_USER_INFO: {
      const nextUserInfo = payload || null;
      if (typeof window !== "undefined") {
        try {
          const current = localStorage.getItem(USER_KEY);
          let merged = { accessToken: state.accessToken };
          if (current) {
            try { merged = { ...JSON.parse(current), ...merged, userInfo: nextUserInfo }; } catch { /* noop */ }
          } else {
            merged.userInfo = nextUserInfo;
          }
          localStorage.setItem(USER_KEY, JSON.stringify(merged));
        } catch { /* noop */ }
      }
      return { ...state, userInfor: nextUserInfo };
    }

    case AuthActionTypes.SET_TOKEN: {
      const token = payload || null;
      if (typeof window !== "undefined") {
        try {
          const current = localStorage.getItem(USER_KEY);
          const parsed = current ? JSON.parse(current) : {};
          parsed.accessToken = token;
          delete parsed.loginToken;
          localStorage.setItem(USER_KEY, JSON.stringify(parsed));
        } catch { /* noop */ }
      }
      return { ...state, accessToken: token };
    }

    case AuthActionTypes.SET_CREDENTIALS: {
      const { accessToken, userInfo } = payload || {};
      const nextToken = accessToken || null;
      const nextUser = userInfo || null;
      if (typeof window !== "undefined") {
        try {
          const toSave = { accessToken: nextToken, userInfo: nextUser };
          localStorage.setItem(USER_KEY, JSON.stringify(toSave));
        } catch { /* noop */ }
      }
      return { ...state, accessToken: nextToken, userInfor: nextUser };
    }

    case AuthActionTypes.CLEAR_AUTH: {
      if (typeof window !== "undefined") {
        try { localStorage.removeItem(USER_KEY); } catch { /* noop */ }
      }
      return { ...state, accessToken: null, userInfor: null };
    }

    // Project & Task UI Group
    case ProjectTaskActionTypes.SET_DATE: 
      return { ...state, date: payload };

    case ProjectTaskActionTypes.SEARCH_USER: 
      return { ...state, list: payload };

    case ProjectTaskActionTypes.SET_EDIT_DATA: 
      return { ...state, detail: payload };

    case ProjectTaskActionTypes.SET_SUBMIT: 
      return { ...state, callBackSubmit: payload };

    case ProjectTaskActionTypes.SET_MY_PROJECT: 
      return { ...state, myProject: payload };

      case ProjectTaskActionTypes.SET_TASK_DETAIL: 
      return { ...state, taskDetailModal: payload };

    case ProjectTaskActionTypes.SET_RENDER_DETAIL: 
      return { ...state, reRenderDetail: payload };

    case ProjectTaskActionTypes.SET_PROJECT_MEMLIST: 
      return { ...state, projectMemList: payload };

    case ProjectTaskActionTypes.SET_TASK_MODAL: 
      return { ...state, setTaskModal: payload };

    // DefaultData Group
    case DefaultDataActionTypes.DEFAULT_CATEGORY: 
      return { ...state, category: payload };

    default:
      return state;
  }
};