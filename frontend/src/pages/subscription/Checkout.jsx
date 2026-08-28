import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiCreditCard,
  FiShield,
  FiCheck,
  FiLoader,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useSubscription } from "../../context/SubscriptionContext";
import { useRazorpay } from "../../hooks/useRazorpay";
import subscriptionService from "../../services/subscription.service";
import { showSuccess } from "../../components/common/toast";

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
  BackLink,
  FeaturesList,
  FeatureItem,
  FeatureIcon,
  FeatureText,
} from "./Checkout.style";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { refreshSubscription } = useSubscription();
  const { isLoaded: razorpayLoaded, openCheckout } = useRazorpay();

  const billingCycle = location.state?.billingCycle === "YEARLY"
    ? BILLING_CYCLE.YEARLY
    : BILLING_CYCLE.MONTHLY;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const price =
    billingCycle === BILLING_CYCLE.YEARLY
      ? PLAN.yearlyPrice
      : PLAN.monthlyPrice;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!location.state?.billingCycle) {
      navigate("/subscription", { replace: true });
    }
  }, [location.state?.billingCycle, navigate]);

  const handlePayment = async () => {
    setError("");
    setLoading(true);

    try {
      console.info("[CHECKOUT] Starting payment order creation", {
        billingCycle,
        userId: user?._id || user?.id,
      });

      const order = await subscriptionService.createPaymentOrder(billingCycle);

      console.info("[CHECKOUT] Payment order created", {
        orderId: order.providerOrderId,
        amount: order.amount,
        currency: order.currency,
        billingCycle,
      });

      if (order.testMode || !razorpayLoaded) {
        showSuccess(
          "Trial activated! No payment required in test mode."
        );
        navigate("/onboarding/success", { replace: true });
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      const response = await openCheckout({
        key: razorpayKey,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: "Contractor Worker Management",
        description: `Contractor Pro - ${getBillingCycleLabel(
          billingCycle
        )} Subscription`,
        order_id: order.providerOrderId,
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

      console.info("[CHECKOUT] Payment successful, verifying...", {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
      });

      await subscriptionService.verifyPayment({
        providerOrderId: order.providerOrderId,
        providerPaymentId: response.razorpay_payment_id,
        providerSignature: response.razorpay_signature,
        billingCycle,
        amount: order.amount,
        currency: order.currency,
      });

      showSuccess(
        "Payment successful! Your subscription is now active."
      );

      await refreshSubscription();

      navigate("/subscription?payment=success", { replace: true });
    } catch (err) {
      console.error("[CHECKOUT] Payment flow failed", {
        error: err.message,
        billingCycle,
      });

      if (err.message === "Payment cancelled") {
        setError("Payment was cancelled. You can try again.");
      } else {
        setError(
          err?.message || "Payment failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSubscription = () => {
    navigate("/subscription");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <PageWrapper>
      <PageHeader>
        <BackLink to="/subscription">
          <FiArrowLeft /> Back to Subscription
        </BackLink>
        <PageTitle>Complete Your Subscription</PageTitle>
        <PageSubtitle>
          Secure payment powered by Razorpay
        </PageSubtitle>
      </PageHeader>

      <CheckoutCard>
        <PlanSummary>
          <PlanName>{PLAN.name}</PlanName>
          <PlanPrice>{formatPrice(price)}</PlanPrice>
          <PlanBilling>
            {getBillingCycleLabel(billingCycle)} — {formatPrice(price)}/
            {getBillingCyclePeriod(billingCycle)}
          </PlanBilling>
        </PlanSummary>

        <OrderSummary>
          <SummaryRow>
            <SummaryLabel>Plan</SummaryLabel>
            <SummaryValue>{PLAN.name}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Billing Cycle</SummaryLabel>
            <SummaryValue>{getBillingCycleLabel(billingCycle)}</SummaryValue>
          </SummaryRow>
          <SummaryDivider />
          <SummaryTotal>
            <SummaryLabel>Amount Due</SummaryLabel>
            <SummaryValue>{formatPrice(price)}</SummaryValue>
          </SummaryTotal>
        </OrderSummary>

        <PaymentSection>
          <PaymentTitle>Payment Method</PaymentTitle>
          <PaymentDescription>
            Complete your payment to activate your {PLAN.name}{" "}
            subscription. You will be redirected to Razorpay to securely
            enter your payment details.
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
                <FiCreditCard /> Pay {formatPrice(price)} & Activate
                Subscription
              </>
            )}
          </PaymentButton>

          <PaymentButtonSecondary
            onClick={handleBackToSubscription}
            disabled={loading}
          >
            Cancel
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

export default Checkout;
