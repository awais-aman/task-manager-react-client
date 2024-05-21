import { toast } from "react-toastify";

const FALLBACK = "Something went wrong. Please try again.";

// The Rails API answers with { message }, { errors: [...] } (validation) or
// { error } (Devise), so all three shapes are flattened into a list.
export const errorMessages = (error) => {
  if (error?.sessionExpired) {
    return ["Your session has expired. Please log in again."];
  }
  if (!error?.response) {
    return ["Could not reach the server. Check your connection and try again."];
  }
  const data = error.response.data;
  const raw = data?.message ?? data?.errors ?? data?.error;
  const list = (Array.isArray(raw) ? raw : [raw]).filter(
    (message) => typeof message === "string" && message.trim()
  );
  return list.length ? list : [FALLBACK];
};

export const toastErrors = (messages) => {
  const list = Array.isArray(messages) ? messages : [FALLBACK];
  list.forEach((message) => toast.error(message));
};
