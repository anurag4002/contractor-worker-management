import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";

const ProtectedRoute = () => {
  const {
    loading,
    isAuthenticated,
  } = useAuth();

  const {
    loading: subscriptionLoading,
    isExpired,
    isSuperAdmin,
  } = useSubscription();

  const location = useLocation();

  if (loading || subscriptionLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          fontWeight: "500",
        }}
      >
        Loading...
      </div>
    );
  }

  const isPublicRoute =
    location.pathname === "/pricing";

  if (!isAuthenticated && !isPublicRoute) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const isSubscriptionRoute =
    location.pathname === "/subscription" ||
    location.pathname === "/pricing";

  const isOnboardingRoute =
    location.pathname === "/onboarding/payment" ||
    location.pathname === "/onboarding/success";

  if (!isSuperAdmin && isExpired() && !isSubscriptionRoute && !isOnboardingRoute) {
    return (
      <Navigate
        to="/subscription"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
