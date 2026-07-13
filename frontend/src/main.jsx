import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { WorkerProvider } from "./context/WorkerContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <WorkerProvider>

        <App />

      </WorkerProvider>

    </BrowserRouter>

  </React.StrictMode>

);