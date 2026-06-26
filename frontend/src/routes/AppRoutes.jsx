import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/dashboardlayout/DashboardLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import Workers from "../pages/workers/Workers";
import Attendance from "../pages/attendance/Attendance";
import Salary from "../pages/salary/Salary";
import Sites from "../pages/sites/Sites";
import Reports from "../pages/reports/Reports";

const AppRoutes = () => {
  return (
    <Routes>

      <Route element={<DashboardLayout />}>

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
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

      </Route>

    </Routes>
  );
};

export default AppRoutes;