import { persistStore } from "redux-persist";

import { makeStore } from "store/makeStore";

const store = makeStore();

export const persistor = persistStore(store);

export default store;
