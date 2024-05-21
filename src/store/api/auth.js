import { post, Delete } from "../server";

const endPointUrl = `${process.env.REACT_APP_BASE_URL}`;

export function signUp(user) {
  return post(`${endPointUrl}/sign_up`, user);
}

export function login(user) {
  return post(`${endPointUrl}/login`, user);
}

export function logout() {
  return Delete(`${endPointUrl}/logout`);
}
