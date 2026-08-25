import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiCreditCard,
  FiShield,
  FiCheck,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useRazorpay } from "../../hooks/useRazorpay";
import subscriptionService from "../../services/subscription.service";
import { showSuccess, showError } from "../../components/common/toast";

import {
  PLAN,
  BILLING_CYCLE,
  formatPrice,
  getBillingCycleLabel,
  getBillingCyclePeriod,
} from "../../constants/subscription";

import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  CheckoutCard,
  PlanSummary,
  PlanName,
  PlanPrice,
  PlanBilling,
  TrialBadge,
  OrderSummary,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  SummaryDivider,
  SummaryTotal,
  PaymentSection,
  PaymentTitle,
  PaymentDescription,
  PaymentButton,
  PaymentButtonSecondary,
  SecurityNote,
  ErrorMessage,
  LoadingOverlay,
  FeaturesList,
  FeatureItem,
  FeatureIcon,
  FeatureText,
} from "./OnboardingPayment.style";

const OnboardingPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isLoaded: razorpayLoaded, openCheckout } = useRazorpay();

  const billingCycleParam = searchParams.get("billingCycle");
  const billingCycle = billingCycleParam === "YEARLY" ? "YEARLY" : "MONTHLY";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);

  const price = billingCycle === BILLING_CYCLE.YEARLY ? PLAN.yearlyPrice : PLAN.monthlyPrice;

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handlePayment = async () => {
    setError("");
    setLoading(true);

    try {
      const order = await subscriptionService.createPaymentOrder(billingCycle);
      setOrderData(order);

      if (order.testMode || !razorpayLoaded) {
        showSuccess("Trial activated! No payment required in test mode.");
        navigate("/onboarding/success", { replace: true });
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      const response = await openCheckout({
        key: razorpayKey,
        amount: order.amountInPaise,
        currency: order.currency,
        name: "Contractor Worker Management",
        description: `Contractor Pro - ${getBillingCycleLabel(billingCycle)}`,
        order_id: order.orderId,
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
          contact: user?.mobileNumber || "",
        },
        notes: order.notes,
        theme: {
          color: "#2563eb",
        },
      });

      await subscriptionService.verifyPayment({
        providerOrderId: order.orderId,
        providerPaymentId: response.razorpay_payment_id,
        providerSignature: response.razorpay_signature,
        billingCycle,
        amount: order.amount,
        currency: order.currency,
      });

      showSuccess("Payment successful! Your subscription is now active.");
      navigate("/onboarding/success", { replace: true });
    } catch (err) {
      if (err.message === "Payment cancelled") {
        setError("Payment was cancelled. You can try again.");
      } else {
        setError(err?.message || "Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkipToDashboard = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Complete Your Setup</PageTitle>
        <PageSubtitle>
          Start your 7-day free trial of Contractor Pro
        </PageSubtitle>
      </PageHeader>

      <CheckoutCard>
        <PlanSummary>
          <PlanName>{PLAN.name}</PlanName>
          <PlanPrice>{formatPrice(price)}</PlanPrice>
          <PlanBilling>
            {getBillingCycleLabel(billingCycle)} — {formatPrice(price)}/{getBillingCyclePeriod(billingCycle)}
          </PlanBilling>
          <TrialBadge>7-Day Free Trial</TrialBadge>
        </PlanSummary>

        <OrderSummary>
          <SummaryRow>
            <SummaryLabel>Plan</SummaryLabel>
            <SummaryValue>{PLAN.name}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Billing</SummaryLabel>
            <SummaryValue>{getBillingCycleLabel(billingCycle)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Trial</SummaryLabel>
            <SummaryValue>7 Days</SummaryValue>
          </SummaryRow>
          <SummaryDivider />
          <SummaryTotal>
            <SummaryLabel>Due today</SummaryLabel>
            <SummaryValue>₹0.00</SummaryValue>
          </SummaryTotal>
          <SummaryRow>
            <SummaryLabel>Billing starts</SummaryLabel>
            <SummaryValue>After trial ends</SummaryValue>
          </SummaryRow>
        </OrderSummary>

        <PaymentSection>
          <PaymentTitle>Payment Method</PaymentTitle>
          <PaymentDescription>
            Your payment method will be securely saved. You will not be charged during the 7-day trial. Billing begins after the trial unless cancelled.
          </PaymentDescription>

          {error && (
            <ErrorMessage>
              <FiAlertCircle /> {error}
            </ErrorMessage>
          )}

          <PaymentButton onClick={handlePayment} disabled={loading}>
            {loading ? (
              <>
                <FiLoader className="spin" /> Processing...
              </>
            ) : (
              <>
                <FiCreditCard /> Start 7-Day Free Trial
              </>
            )}
          </PaymentButton>

          <PaymentButtonSecondary onClick={handleSkipToDashboard} disabled={loading}>
            Skip for now (Trial only)
          </PaymentButtonSecondary>
        </PaymentSection>

        <SecurityNote>
          <FiShield /> Secure payment powered by Razorpay
        </SecurityNote>

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
      </CheckoutCard>
    </PageWrapper>
  );
};

export default OnboardingPayment;
