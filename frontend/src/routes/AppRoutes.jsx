import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import SuperAdminRoute from "./SuperAdminRoute";

import DashboardLayout from "../layouts/dashboardlayout/DashboardLayout";
import SuperAdminLayout from "../layouts/superadminlayout/SuperAdminLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Workers from "../pages/workers/Workers";
import WorkerDetails from "../pages/workers/WorkerDetails";
import EditWorker from "../pages/workers/EditWorker";
import Attendance from "../pages/attendance/Attendance";
import Salary from "../pages/salary/Salary";
import Sites from "../pages/sites/Sites";
import Payroll from "../pages/payroll/Payroll";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";

import Profile from "../pages/auth/profile/Profile";
import ChangePassword from "../pages/auth/ChangePassword";
import LandingPage from "../pages/landing/LandingPage";

import Pricing from "../pages/subscription/Pricing";
import Subscription from "../pages/subscription/Subscription";
import OnboardingPayment from "../pages/subscription/OnboardingPayment";
import OnboardingSuccess from "../pages/subscription/OnboardingSuccess";
import Checkout from "../pages/subscription/Checkout";

import SuperAdminLogin from "../pages/superadmin/SuperAdminLogin";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import Contractors from "../pages/superadmin/Contractors";
import ContractorDetails from "../pages/superadmin/ContractorDetails";
import Subscriptions from "../pages/superadmin/Subscriptions";
import Plans from "../pages/superadmin/Plans";
import Payments from "../pages/superadmin/Payments";
import Expiring from "../pages/superadmin/Expiring";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/pricing"
        element={<Pricing />}
      />

      <Route
        path="/onboarding/payment"
        element={<OnboardingPayment />}
      />

      <Route
        path="/onboarding/success"
        element={<OnboardingSuccess />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/super-admin/login"
        element={<SuperAdminLogin />}
      />

      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            }
          />

          <Route
            path="/workers"
            element={<Workers />}
          />

          <Route
            path="/workers/:id"
            element={<WorkerDetails />}
          />

          <Route
            path="/workers/:id/edit"
            element={<EditWorker />}
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

          <Route
            path="/subscription"
            element={<Subscription />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />
        </Route>
      </Route>

      {/* Super Admin Routes */}

      <Route
        path="/super-admin"
        element={<Navigate to="/super-admin/dashboard" replace />}
      />

      <Route element={<SuperAdminRoute />}>
        <Route element={<SuperAdminLayout />}>
          <Route
            path="/super-admin/dashboard"
            element={<SuperAdminDashboard />}
          />
          <Route
            path="/super-admin/contractors"
            element={<Contractors />}
          />
          <Route
            path="/super-admin/contractors/:tenantId"
            element={<ContractorDetails />}
          />
          <Route
            path="/super-admin/subscriptions"
            element={<Subscriptions />}
          />
          <Route
            path="/super-admin/payments"
            element={<Payments />}
          />
          <Route
            path="/super-admin/expiring"
            element={<Expiring />}
          />
          <Route
            path="/super-admin/plans"
            element={<Plans />}
          />
        </Route>
      </Route>

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