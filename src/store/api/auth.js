import { post, Delete } from "../server";

const endPointUrl = `${import.meta.env.VITE_API_BASE_URL}`;

export function signUp(user) {
  return post(`${endPointUrl}/sign_up`, user);
}

export function login(user) {
  return post(`${endPointUrl}/login`, user);
}

export function logout() {
  return Delete(`${endPointUrl}/logout`);
}
