import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  LOGOUT,
} from "store/constants/authConstants";

const initialState = {
  isLoading: false,
  user: null,
  token: null,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action?.user,
        token: action?.token,
        error: null,
      };

    case LOGOUT:
      return {
        isLoading: false,
        user: null,
        token: null,
        error: null,
      };

    case AUTH_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false,
        user: null,
        token: null,
      };

    default:
      return state;
  }
};
