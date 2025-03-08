import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

// Importing local files
import "./index.css";
import { store } from "./store/store.js";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundry from "./components/ErrorBoundry";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundry>
      <BrowserRouter>
        <Provider store={store}>
          <App />
          <Toaster />
        </Provider>
      </BrowserRouter>
    </ErrorBoundry>
  </StrictMode>
);
