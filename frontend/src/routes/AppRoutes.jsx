import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "../layouts/dashboardlayout/DashboardLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import Workers from "../pages/workers/Workers";
import Attendance from "../pages/attendance/Attendance";
import Salary from "../pages/salary/Salary";
import Sites from "../pages/sites/Sites";
import Payroll from "../pages/payroll/Payroll";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";

import Profile from "../pages/auth/profile/Profile";
import ChangePassword from "../pages/auth/ChangePassword";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/workers"
            element={<Workers />}
          />

          <Route
            path="/attendance"
            element={<Attendance />}
          />

          <Route
            path="/salary"
            element={<Salary />}
          />

          <Route
            path="/sites"
            element={<Sites />}
          />

          <Route
            path="/payroll"
            element={<Payroll />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/change-password"
            element={<ChangePassword />}
          />
        </Route>
      </Route>

      {/* Default Route */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* 404 */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;