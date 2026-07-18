import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/dashboardlayout/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import Workers from "../pages/workers/Workers";
import Attendance from "../pages/attendance/Attendance";
import Salary from "../pages/salary/Salary";
import Sites from "../pages/sites/Sites";
import Reports from "../pages/reports/Reports";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";

const AppRoutes = () => {

  return (

    <Routes>

      {/* Authentication */}

      <Route
        path="/login"
        element={<Login />}
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

      <Route

        element={

          <ProtectedRoute>

            <DashboardLayout />

          </ProtectedRoute>

        }

      >

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

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
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>

      {/* Invalid Route */}

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