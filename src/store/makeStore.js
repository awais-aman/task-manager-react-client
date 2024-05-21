import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  createMigrate,
  createTransform,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/es/storage";
import { toast } from "react-toastify";

import authReducer, {
  initialAuthState,
  sessionExpired,
} from "store/slices/authSlice";
import tasksReducer from "store/slices/tasksSlice";
import { bindSession } from "store/api/client";
import { isTokenExpired } from "helpers/session";

const rootReducer = combineReducers({ auth: authReducer, tasks: tasksReducer });

export const migrations = {
  // Version 1: earlier builds persisted the whole store under `authReducer`
  // and `tasksReducer` (task lists included) and kept a second copy of the
  // token in localStorage. Only the session survives the move.
  1: (state) => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    const legacy = state?.authReducer;
    return {
      _persist: state?._persist,
      auth: { user: legacy?.user ?? null, token: legacy?.token ?? null },
    };
  },
};

// Only the user and token are stored, and an expired token is dropped on load.
const sessionTransform = createTransform(
  ({ user, token }) => ({ user, token }),
  ({ user, token }) =>
    user && token && !isTokenExpired(token)
      ? { ...initialAuthState, user, token }
      : initialAuthState,
  { whitelist: ["auth"] }
);

export const persistConfig = {
  key: "persist-key",
  version: 1,
  storage,
  whitelist: ["auth"],
  transforms: [sessionTransform],
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations, { debug: false }),
};

export const makeStore = (preloadedState) => {
  const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    preloadedState,
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  bindSession({
    getToken: () => store.getState().auth.token,
    onUnauthorized: () => {
      if (!store.getState().auth.token) return;
      store.dispatch(sessionExpired());
      toast.info("Your session has expired. Please log in again.", {
        toastId: "session-expired",
      });
    },
  });

  return store;
};
