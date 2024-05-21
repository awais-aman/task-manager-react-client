import { toast } from "react-toastify";
import storage from "redux-persist/lib/storage";
import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  LOGOUT,
} from "store/constants/authConstants";
import { login, signUp, logout } from "store/api/auth";
import { withTryCatch } from "helpers/withTryCatch";

const success = (user, token) => ({
  type: AUTH_SUCCESS,
  user,
  token,
});

const loading = () => ({ type: AUTH_LOADING });

const failure = (error) => ({ type: AUTH_FAILURE, error });

export const loginAction = (body, isLogin, navigate) => (dispatch) => {
  dispatch(loading);
  withTryCatch({
    tryFunc: () => (isLogin ? login(body) : signUp(body)),
    success: (response) => {
      const user = response?.data?.data?.attributes;
      const token = response.headers.authorization;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
      dispatch(success(user, token));
      navigate("/", { replace: true });
      toast.success(
        isLogin ? "Logged in successfully" : "Registered successfully"
      );
    },
    failure: (error) => dispatch(failure(error)),
  });
};

export const logoutAction = () => (dispatch) => {
  withTryCatch({
    tryFunc: logout,
    success: () => {
      dispatch({ type: LOGOUT });
      storage.removeItem("persist:persist-key");
      localStorage.clear();
    },
  });
};
