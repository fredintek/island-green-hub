import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api";

type NoopStorage = {
  getItem: (key: string) => Promise<null>;
  setItem: (key: string, value: string) => Promise<any>;
  removeItem: (key: string) => Promise<void>;
};

const createNoopStorage = (): NoopStorage => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// define persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage:
    typeof window === "undefined"
      ? createNoopStorage()
      : createWebStorage("local"),
};

// combine redusers for different slices
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// create store with persist middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

// setup listeners for persisting redux state
setupListeners(store.dispatch);

// define types for root state and app dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
