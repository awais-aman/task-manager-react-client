import {
  GET_ALL_TASKS_SUCCESS,
  GET_ALL_TASKS_FAILURE,
  GET_ALL_TASKS_LOADING,
  GET_SINGLE_TASK_SUCCESS,
} from "store/constants/taskConstants";
import { withTryCatch } from "helpers/withTryCatch";
import { getTasks, getTask } from "store/api/tasks";

const success = (tasks) => ({
  type: GET_ALL_TASKS_SUCCESS,
  tasks,
});

const failure = (error) => ({
  type: GET_ALL_TASKS_FAILURE,
  error,
});

const loading = () => ({
  type: GET_ALL_TASKS_LOADING,
});

const successSingleTask = (task) => ({
  type: GET_SINGLE_TASK_SUCCESS,
  task,
});

export const getAllTasks = () => (dispatch) => {
  dispatch(loading());
  withTryCatch({
    tryFunc: getTasks,
    success: (response) => {
      dispatch(success(response?.data?.data));
    },
    failure: (response) => dispatch(failure(response)),
  });
};

export const getSingleTask = (id) => (dispatch) => {
  dispatch(loading());
  withTryCatch({
    tryFunc: () => getTask(id),
    success: (response) => {
      dispatch(successSingleTask(response?.data?.data?.attributes));
    },
    failure: (response) => dispatch(failure(response)),
  });
};
