export const BILLING_CYCLE = {
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
};

export const SUBSCRIPTION_STATUS = {
  TRIAL: "TRIAL",
  ACTIVE: "ACTIVE",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  GRACE_PERIOD: "GRACE_PERIOD",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  SUSPENDED: "SUSPENDED",
};

export const PLAN = {
  name: "Contractor Pro",
  code: "CONTRACTOR_PRO",
  monthlyPrice: 2499,
  yearlyPrice: 24999,
  currency: "INR",
  trialDays: 7,
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

export const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;

export const getBillingCycleLabel = (cycle) => {
  return cycle === BILLING_CYCLE.YEARLY ? "Yearly" : "Monthly";
};

export const getBillingCyclePeriod = (cycle) => {
  return cycle === BILLING_CYCLE.YEARLY ? "year" : "month";
};
