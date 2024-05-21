import { get, post, patch, Delete } from "../server";

const endPointUrl = `${process.env.REACT_APP_BASE_URL}/api/v1/tasks`;

export function getTasks() {
  return get(endPointUrl);
}

export function getTask(id) {
  return get(`${endPointUrl}/${id}`);
}

export function createTask(body) {
  return post(endPointUrl, body);
}

export function updateTask(id, body) {
  return patch(`${endPointUrl}/${id}`, body);
}

export function deleteTask(id) {
  return Delete(`${endPointUrl}/${id}`);
}
