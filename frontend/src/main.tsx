import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "./context/ThemeContext.tsx";
import ErrorBoundary from "./components/ErrorBoundary/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
            <Provider store={store}>
              <ToastContainer />
              <Toaster />
              <App />
            </Provider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);