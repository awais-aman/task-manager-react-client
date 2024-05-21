import { api } from "./client";

const TASKS = "/api/v1/tasks";

export const getTasks = () => api.get(TASKS);

export const getTask = (id) => api.get(`${TASKS}/${id}`);

export const createTask = (body) => api.post(TASKS, body);

export const updateTask = (id, body) => api.patch(`${TASKS}/${id}`, body);

export const deleteTask = (id) => api.delete(`${TASKS}/${id}`);
