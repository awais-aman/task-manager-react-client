import axios from "axios";

import { isTokenExpired } from "helpers/session";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// The store registers these at startup; importing it here would be circular.
let session = { getToken: () => null, onUnauthorized: () => {} };

export const bindSession = (handlers) => {
  session = handlers;
};

api.interceptors.request.use((config) => {
  const token = session.getToken();
  if (token && isTokenExpired(token)) {
    session.onUnauthorized();
    return Promise.reject(
      Object.assign(new Error("Session expired"), { sessionExpired: true })
    );
  }
  if (token) config.headers.Authorization = token;
  return config;
});

api.interceptors.response.use(undefined, (error) => {
  if (error.response?.status === 401) session.onUnauthorized();
  return Promise.reject(error);
});
