import { api } from "./client";

export const signUp = (body) => api.post("/sign_up", body);

export const login = (body) => api.post("/login", body);

export const logout = () => api.delete("/logout");
