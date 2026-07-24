import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { WorkerProvider } from "./context/WorkerContext";
import { SiteProvider } from "./context/SiteContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { PayrollProvider } from "./context/PayrollContext";
import ReportProvider from "./context/ReportContext";
import NotificationProvider from "./context/NotificationContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WorkerProvider>
          <SiteProvider>
            <AttendanceProvider>
              <PayrollProvider>
                <ReportProvider>
                  <NotificationProvider>
                    <App />
                  </NotificationProvider>
                </ReportProvider>
              </PayrollProvider>
            </AttendanceProvider>
          </SiteProvider>
        </WorkerProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);