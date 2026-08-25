import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";

import subscriptionService from "../services/subscription.service";
import { useAuth } from "../context/AuthContext";

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tenantId = user?.tenantId || user?.tenant || null;
  const isSuperAdmin = user?.role === "SUPER_ADMIN" || user?.role?.code === "SUPER_ADMIN";

  const fetchSubscription = useCallback(async () => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    if (isSuperAdmin) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    if (!tenantId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionService.getCurrentSubscription();
      setSubscription(data);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 404 || status === 403 || status === 401) {
        setSubscription(null);
      } else {
        setError(err);
        setSubscription(null);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isSuperAdmin, tenantId, authLoading]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  const isTrialActive = () => {
    if (!subscription) return false;
    if (subscription.status !== "TRIAL") return false;
    if (!subscription.trialEnd) return false;

    const now = new Date();
    const trialEnd = new Date(subscription.trialEnd);
    return now < trialEnd;
  };

  const isTrialExpired = () => {
    if (!subscription) return false;
    if (subscription.status !== "TRIAL") return false;
    if (!subscription.trialEnd) return false;

    const now = new Date();
    const trialEnd = new Date(subscription.trialEnd);
    return now >= trialEnd;
  };

  const isExpired = () => {
    if (!subscription) return false;
    return (
      subscription.status === "EXPIRED" ||
      subscription.status === "PAYMENT_FAILED" ||
      subscription.status === "SUSPENDED" ||
      subscription.status === "CANCELLED" ||
      isTrialExpired()
    );
  };

  const isActive = () => {
    if (!subscription) return false;
    return subscription.status === "ACTIVE" || isTrialActive();
  };

  const isPaymentFailed = () => {
    if (!subscription) return false;
    return subscription.status === "PAYMENT_FAILED";
  };

  const isGracePeriod = () => {
    if (!subscription) return false;
    return subscription.status === "GRACE_PERIOD";
  };

  const isSuspended = () => {
    if (!subscription) return false;
    return subscription.status === "SUSPENDED";
  };

  const isCancelled = () => {
    if (!subscription) return false;
    return subscription.status === "CANCELLED";
  };

  const getDaysRemaining = () => {
    if (!subscription) return 0;

    if (subscription.status === "TRIAL" && subscription.trialEnd) {
      const now = new Date();
      const trialEnd = new Date(subscription.trialEnd);

      if (now >= trialEnd) {
        return 0;
      }

      const diff = trialEnd - now;
      const days = diff / (1000 * 60 * 60 * 24);
      return Math.max(0, Math.ceil(days));
    }

    if (subscription.endDate) {
      const now = new Date();
      const endDate = new Date(subscription.endDate);

      if (now >= endDate) {
        return 0;
      }

      const diff = endDate - now;
      const days = diff / (1000 * 60 * 60 * 24);
      return Math.max(0, Math.ceil(days));
    }

    return 0;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        error,
        refreshSubscription,
        isTrialActive,
        isTrialExpired,
        isExpired,
        isActive,
        isPaymentFailed,
        isGracePeriod,
        isSuspended,
        isCancelled,
        getDaysRemaining,
        isSuperAdmin,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return ctx;
};
