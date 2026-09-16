import { USER_KEY } from "../../constants/common";
import {
  AuthActionTypes,
  ProjectTaskActionTypes,
  DefaultDataActionTypes,
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

// Khai báo chuẩn cấu trúc dữ liệu Task mặc định để tái sử dụng
export const initialTaskDetailModal = {
  priorityId: null,
  taskTypeId: null,
  assigneeId: [],    
  taskId: null,
  taskName: "",
  description: "",
  statusId: "",
  originalEstimate: 0,
  timeTrackingSpent: 0,
  timeTrackingRemaining: 0,    
  projectId: null,
  estimateHours: 0,
};

const DEFAULT_STATE = {
  // ==========================================
  // 1. AUTHENTICATION & GLOBAL UI STATES
  // ==========================================
  userInfor,
  accessToken: savedAccessToken,
  date: "",
  callBackSubmit: null,
  reRenderDetail: false,
  setTaskModal: false,

  // ==========================================
  // 2. LISTS & GENERAL DATA
  // ==========================================
  list: [], // Danh sách search user
  myProject: [], // Danh sách project của tôi
  projectMemList: [], // Danh sách thành viên trong project

  // ==========================================
  // 3. META DATA / LOOKUP (Dùng chung toàn app)
  // ==========================================
  metaData: {
    taskType: [],
    priority: [],
    status: [],
    category: [],
  },

  // ==========================================
  // 4. MODAL PROJECT STATE
  // ==========================================
  projectModal: {
    title: "",
    setOpen: false,
    infor: null, // Component chứa form project    
  },

  // ==========================================
  // 5. MODAL TASK STATE
  // ==========================================
  taskModal: {
    title: "",
    setOpen: false,
    infor: null, // Component chứa form task    
  },

  // ==========================================
  // 6. TASK DETAIL MODAL (Jira Board style)
  // ==========================================
  taskDetailModal: initialTaskDetailModal,
};

export const userReducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    // ==========================================
    // AUTH GROUP
    // ==========================================
    case AuthActionTypes.SET_USER_INFO: {
      const nextUserInfo = payload || null;
      if (typeof window !== "undefined") {
        try {
          const current = localStorage.getItem(USER_KEY);
          let merged = { accessToken: state.accessToken };
          if (current) {
            try {
              merged = {
                ...JSON.parse(current),
                ...merged,
                userInfo: nextUserInfo,
              };
            } catch {
              /* noop */
            }
          } else {
            merged.userInfo = nextUserInfo;
          }
          localStorage.setItem(USER_KEY, JSON.stringify(merged));
        } catch {
          /* noop */
        }
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
        } catch {
          /* noop */
        }
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
        } catch {
          /* noop */
        }
      }
      return { ...state, accessToken: nextToken, userInfor: nextUser };
    }

    case AuthActionTypes.CLEAR_AUTH: {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(USER_KEY);
        } catch {
          /* noop */
        }
      }
      return { ...state, accessToken: null, userInfor: null };
    }

    // ==========================================
    // PROJECT & TASK UI GROUP
    // ==========================================
    case ProjectTaskActionTypes.SET_DATE:
      return { ...state, date: payload };

    case ProjectTaskActionTypes.SEARCH_USER:
      return { ...state, list: payload };

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
      return { ...state, taskModal: payload };

    // Action thiết lập Modal Project & Task
    case ProjectTaskActionTypes.SET_PROJECT_MODAL:
      return { ...state, projectModal: payload };    

    // Action thiết lập MetaData dùng chung (nếu có nơi dispatch trực tiếp)
    case "SET_META_DATA":
      return { ...state, metaData: { ...state.metaData, ...payload } };

    // ==========================================
    // DEFAULT DATA GROUP — META DATA
    // ==========================================
    case DefaultDataActionTypes.SET_TASKTYPE_LIST:
      return { ...state, metaData: { ...state.metaData, taskType: payload } };

    case DefaultDataActionTypes.SET_PRIORITY_LIST:
      return { ...state, metaData: { ...state.metaData, priority: payload } };

    case DefaultDataActionTypes.SET_STATUS_LIST:
      return { ...state, metaData: { ...state.metaData, status: payload } };

    case DefaultDataActionTypes.SET_CATEGORY_LIST:
      return { ...state, metaData: { ...state.metaData, category: payload } };

    default:
      return state;
  }
};