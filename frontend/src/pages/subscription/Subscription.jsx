import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiCreditCard,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

import { useSubscription } from "../../context/SubscriptionContext";
import { useAuth } from "../../context/AuthContext";

import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  StatusCard,
  StatusBadge,
  StatusTitle,
  StatusDescription,
  StatusDetails,
  StatusDetailRow,
  StatusDetailLabel,
  StatusDetailValue,
  ActionButtons,
  ActionButton,
  ActionButtonSecondary,
  FeaturesCard,
  FeaturesTitle,
  FeaturesList,
  FeatureItem,
  FeatureIcon,
  FeatureText,
  PricingSummary,
  PricingRow,
  PricingLabel,
  PricingValue,
  PricingTotal,
  GuaranteeText,
  GuaranteeIcon,
  RetryButton,
} from "./Subscription.style";

const PLAN = {
  name: "CONTRACTOR PRO",
  monthlyPrice: 2499,
  annualPrice: 24999,
  features: [
    "Unlimited Workers",
    "Unlimited Sites",
    "Unlimited Admins",
    "Attendance",
    "Payroll",
    "Advanced Reports",
    "Priority Support",
  ],
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Subscription = () => {
  const navigate = useNavigate();
  const { subscription, loading, error, refreshSubscription, isExpired, getDaysRemaining, isSuperAdmin } = useSubscription();
  const { isAuthenticated } = useAuth();

  const daysRemaining = getDaysRemaining();

  const isActive = subscription?.status === "ACTIVE";
  const isTrial = subscription?.status === "TRIAL";
  const isExpiredStatus = isExpired();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem" }}>
          Loading subscription details...
        </div>
      </PageWrapper>
    );
  }

  if (error && !subscription) {
    return (
      <PageWrapper>
        <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem" }}>
          <p>Unable to load subscription details.</p>
          <RetryButton onClick={refreshSubscription}>
            <FiRefreshCw /> Retry
          </RetryButton>
        </div>
      </PageWrapper>
    );
  }

  const handleSubscribe = (cycle) => {
    navigate("/checkout", {
      state: { billingCycle: cycle },
    });
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Subscription</PageTitle>
        <PageSubtitle>
          Manage your CONTRACTOR PRO subscription
        </PageSubtitle>
      </PageHeader>

      {isSuperAdmin && (
        <StatusCard>
          <StatusTitle>Super Admin Access</StatusTitle>
          <StatusDescription>
            Super admins have full platform access and are not subject to subscription limits.
          </StatusDescription>
        </StatusCard>
      )}

      {isActive && (
        <StatusCard>
          <StatusBadge success>Active</StatusBadge>
          <StatusTitle>Your subscription is active</StatusTitle>
          <StatusDescription>
            You have full access to all features.
          </StatusDescription>
          <StatusDetails>
            <StatusDetailRow>
              <StatusDetailLabel>Plan</StatusDetailLabel>
              <StatusDetailValue>{subscription.plan || PLAN.name}</StatusDetailValue>
            </StatusDetailRow>
            <StatusDetailRow>
              <StatusDetailLabel>Billing Cycle</StatusDetailLabel>
              <StatusDetailValue>{subscription.billingCycle || "—"}</StatusDetailValue>
            </StatusDetailRow>
            <StatusDetailRow>
              <StatusDetailLabel>Start Date</StatusDetailLabel>
              <StatusDetailValue>{formatDate(subscription.startDate)}</StatusDetailValue>
            </StatusDetailRow>
            <StatusDetailRow>
              <StatusDetailLabel>End Date</StatusDetailLabel>
              <StatusDetailValue>{formatDate(subscription.endDate)}</StatusDetailValue>
            </StatusDetailRow>
          </StatusDetails>
        </StatusCard>
      )}

      {isTrial && (
        <StatusCard>
          <StatusBadge warning>Trial</StatusBadge>
          <StatusTitle>7-day free trial</StatusTitle>
          <StatusDescription>
            {daysRemaining > 0
              ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining in your free trial.`
              : "Your free trial is ending soon."}
          </StatusDescription>
          <StatusDetails>
            <StatusDetailRow>
              <StatusDetailLabel>Trial Started</StatusDetailLabel>
              <StatusDetailValue>{formatDate(subscription.trialStart)}</StatusDetailValue>
            </StatusDetailRow>
            <StatusDetailRow>
              <StatusDetailLabel>Trial Ends</StatusDetailLabel>
              <StatusDetailValue>{formatDate(subscription.trialEnd)}</StatusDetailValue>
            </StatusDetailRow>
          </StatusDetails>
          <ActionButtons>
            <ActionButton onClick={() => handleSubscribe("MONTHLY")}>
              <FiCreditCard />
              Subscribe Monthly — ₹{PLAN.monthlyPrice.toLocaleString("en-IN")}/mo
            </ActionButton>
            <ActionButtonSecondary onClick={() => handleSubscribe("YEARLY")}>
              Subscribe Yearly — ₹{PLAN.annualPrice.toLocaleString("en-IN")}/yr
            </ActionButtonSecondary>
          </ActionButtons>
        </StatusCard>
      )}

      {isExpiredStatus && (
        <StatusCard>
          <StatusBadge danger>Expired</StatusBadge>
          <StatusTitle>Your free trial has ended.</StatusTitle>
          <StatusDescription>
            Subscribe now to continue using all features.
          </StatusDescription>
          <ActionButtons>
            <ActionButton onClick={() => handleSubscribe("MONTHLY")}>
              <FiCreditCard />
              Subscribe Monthly — ₹{PLAN.monthlyPrice.toLocaleString("en-IN")}/mo
            </ActionButton>
            <ActionButtonSecondary onClick={() => handleSubscribe("YEARLY")}>
              Subscribe Yearly — ₹{PLAN.annualPrice.toLocaleString("en-IN")}/yr
            </ActionButtonSecondary>
          </ActionButtons>
        </StatusCard>
      )}

      {!subscription && !loading && (
        <StatusCard>
          <StatusBadge>No Subscription</StatusBadge>
          <StatusTitle>Get started with {PLAN.name}</StatusTitle>
          <StatusDescription>
            Start your 7-day free trial today.
          </StatusDescription>
          <ActionButtons>
            <ActionButton onClick={() => handleSubscribe("MONTHLY")}>
              <FiCreditCard />
              Start Free Trial
            </ActionButton>
          </ActionButtons>
        </StatusCard>
      )}

      <FeaturesCard>
        <FeaturesTitle>What&apos;s included</FeaturesTitle>
        <FeaturesList>
          {PLAN.features.map((feature) => (
            <FeatureItem key={feature}>
              <FeatureIcon>
                <FiCheck />
              </FeatureIcon>
              <FeatureText>{feature}</FeatureText>
            </FeatureItem>
          ))}
        </FeaturesList>
      </FeaturesCard>

      <PricingSummary>
        <PricingRow>
          <PricingLabel>Monthly</PricingLabel>
          <PricingValue>₹{PLAN.monthlyPrice.toLocaleString("en-IN")}/month</PricingValue>
        </PricingRow>
        <PricingRow>
          <PricingLabel>Annual</PricingLabel>
          <PricingValue>₹{PLAN.annualPrice.toLocaleString("en-IN")}/year</PricingValue>
        </PricingRow>
        <PricingTotal>
          <PricingLabel>Annual savings</PricingLabel>
          <PricingValue style={{ color: "var(--success)" }}>
            ₹{(PLAN.monthlyPrice * 12 - PLAN.annualPrice).toLocaleString("en-IN")}
          </PricingValue>
        </PricingTotal>
      </PricingSummary>

      <GuaranteeText>
        <GuaranteeIcon>
          <FiShield />
        </GuaranteeIcon>
        7-day free trial · Cancel anytime · No hidden charges
      </GuaranteeText>
    </PageWrapper>
  );
};

export default Subscription;
