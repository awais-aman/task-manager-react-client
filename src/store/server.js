import axios from "axios";
import { logoutAction } from "store/actions/auth";
import { UNAUTHORIZED, FORBIDDEN } from "store/constants/statusCodes";
import store from "store/store";

const post = (url, params) =>
  axios
    .post(url, params, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization:
          localStorage.getItem("authToken") &&
          localStorage.getItem("authToken"),
      },
    })
    .catch((response) => {
      if (
        response.response?.status === FORBIDDEN ||
        response.response?.status === UNAUTHORIZED
      ) {
        store.dispatch({ type: "REVOKED_TOKEN_ERROR_LOGOUT" });
        store.dispatch(logoutAction());
      }
      return Promise.reject(response);
    });

const get = (url) =>
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization:
          localStorage.getItem("authToken") &&
          localStorage.getItem("authToken"),
      },
    })
    .catch((response) => {
      if (
        response.response?.status === FORBIDDEN ||
        response.response?.status === UNAUTHORIZED
      ) {
        store.dispatch(logoutAction());
      } else {
        return Promise.reject(response);
      }
    });

const put = (url, params) =>
  axios
    .put(url, params, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization:
          localStorage.getItem("authToken") &&
          localStorage.getItem("authToken"),
      },
    })
    .catch((response) => {
      if (
        response.response?.status === FORBIDDEN ||
        response.response?.status === UNAUTHORIZED
      ) {
        store.dispatch(logoutAction());
      } else {
        return Promise.reject(response);
      }
    });

const patch = (url, params) =>
  axios
    .patch(url, params, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization:
          localStorage.getItem("authToken") &&
          localStorage.getItem("authToken"),
      },
    })
    .catch((response) => {
      if (
        response.response?.status === FORBIDDEN ||
        response.response?.status === UNAUTHORIZED
      ) {
        store.dispatch(logoutAction());
      } else {
        return Promise.reject(response);
      }
    });

const Delete = (url) =>
  axios
    .delete(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization:
          localStorage.getItem("authToken") &&
          localStorage.getItem("authToken"),
      },
    })
    .catch((response) => {
      if (
        response.response?.status === FORBIDDEN ||
        response.response?.status === UNAUTHORIZED
      ) {
        store.dispatch(logoutAction());
      } else {
        return Promise.reject(response);
      }
    });

export { post, get, put, Delete, patch };
