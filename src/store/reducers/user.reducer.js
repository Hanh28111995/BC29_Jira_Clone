import { USER_KEY } from "../../constants/common";
import { SET_USER_INFO, SET_DATE, SEARCH_USER, DEFAULT_CATEGORY, SET_EDIT_DATA, SET_SUBMIT, SET_MY_PROJECT, SET_TASK_DETAIL, SET_RENDER_DETAIL, SET_PROJECT_MEMLIST, SET_TASK_MODAL } from "../types/user.type";

let userInfor = localStorage.getItem(USER_KEY);
if (userInfor) {
  userInfor = JSON.parse(userInfor);
}
// const [_, setLoadingState] = useContext(LoadingContext);
const DEFAULT_STATE = {
  userInfor,
  setTaskModal: false,
  date: '',
  list: [],
  category: [],
  detail: {
    title: '',
    setOpen: false,
    infor: <hr />,
    data: {
      id: 0,
      projectName: "string",
      creator: 0,
      description: "string",
      categoryId: "string"
    },
  },
  callBackSubmit: (propsValue) => { alert('edit demo') },
  myProject: [],
  reRenderDetail: true,
  projectMemList: [],

  taskDetailModal: {
    priorityTask: {
      priorityId: 1,
      priority: 'High'
    },
    taskTypeDetail: {
      id: 1,
      taskType: 'bug',
    },
    assigness: [
      {
        id: 2664,
        avatar: 'https://ui-avatars.com/api/?name=Vo Thanh Nam',
        name: 'Vo Thanh Nam',
        alias: 'vo - thanh - nam'
      },
      {
        id: 2664,
        avatar: 'https://ui-avatars.com/api/?name=Vo Thanh Nam',
        name: 'Vo Thanh Nam',
        alias: 'vo - thanh - nam'
      }
    ],
    lstComment: [],
    taskId: 5999,
    taskName: 'Gau Gau',
    alias: 'gau - gau',
    description: '<p>stringxxxx</p>',
    statusId: '2',
    originalEstimate: 1,
    timeTrackingSpent: 4,
    timeTrackingRemaining: 8,
    typeId: 1,
    priorityId: 2,
    projectId: 8018
  },
};
export const userReducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_USER_INFO: {
      state.userInfor = payload;
      return { ...state };
    }
    case SET_DATE: {
      state.date = payload;
      return { ...state };
    }
    case SEARCH_USER: {
      state.list = payload;
      return { ...state };
    }
    case DEFAULT_CATEGORY: {
      state.category = payload;
      return { ...state };
    }

    case SET_EDIT_DATA: {
      state.detail = payload;
      return { ...state };
    }

    case SET_SUBMIT: {
      state.callBackSubmit = payload;
      return { ...state };
    }
    case SET_MY_PROJECT: {
      state.myProject = payload;
      return { ...state };
    }
    case SET_TASK_DETAIL: {
      state.taskDetailModal = payload;
      return { ...state };
    }
    case SET_RENDER_DETAIL: {
      state.reRenderDetail = payload;
      return { ...state };
    }
    case SET_PROJECT_MEMLIST: {
      state.projectMemList = payload;
      return { ...state };
    }
    case SET_TASK_MODAL: {
      state.setTaskModal = payload;
      return { ...state };
    }
    
    default:
      return state;
  }
};
