"use client";
import React from "react";
import store from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "@/components/common/ScrollToTop";

interface ReduxProviderProps {
  children: React.ReactNode;
}

const persistor = persistStore(store);

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AntdRegistry>
          {children}
          <ToastContainer position="top-center" />
          <ScrollToTop />
        </AntdRegistry>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
