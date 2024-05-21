import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { authReducer } from "./reducers/authReducer";
import { tasksReducer } from "./reducers/tasksReducer";

const rootReducer = combineReducers({
  authReducer,
  tasksReducer,
});

const initialState = {};

const middleware = [thunk];

const persistConfig = {
  key: "persist-key",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

let persistor = persistStore(store);

export default store;

export { persistor };
