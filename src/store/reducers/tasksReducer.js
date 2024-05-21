import {
  GET_ALL_TASKS_SUCCESS,
  GET_ALL_TASKS_FAILURE,
  GET_ALL_TASKS_LOADING,
  GET_SINGLE_TASK_SUCCESS,
  RESET_SINGLE_TASK,
} from "store/constants/taskConstants";

const initialState = {
  tasks: [],
  task: null,
  error: null,
  isLoading: false,
};

export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TASKS_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case GET_ALL_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action?.tasks,
        isLoading: false,
        error: null,
      };

    case GET_SINGLE_TASK_SUCCESS:
      return {
        ...state,
        task: action?.task,
        isLoading: false,
        error: null,
      };

    case RESET_SINGLE_TASK:
      return {
        ...state,
        task: null,
      };

    case GET_ALL_TASKS_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false,
        task: null,
        tasks: [],
      };

    default:
      return state;
  }
};
