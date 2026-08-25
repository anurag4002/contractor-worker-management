import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiCreditCard, FiShield } from "react-icons/fi";

import subscriptionService from "../../services/subscription.service";
import { PLAN as FALLBACK_PLAN } from "../../constants/subscription";

import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PricingCard,
  PlanBadge,
  PlanName,
  PlanPrice,
  PlanPriceAmount,
  PlanPricePeriod,
  PlanBillingToggle,
  PlanBillingOption,
  PlanBillingLabel,
  PlanBillingSave,
  PlanFeatures,
  PlanFeature,
  PlanFeatureIcon,
  PlanFeatureText,
  SubscribeButton,
  SubscribeButtonSecondary,
  GuaranteeText,
  GuaranteeIcon,
  TrustBadges,
  TrustBadge,
} from "./Pricing.style";

const Pricing = () => {
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionService.getPlans();
        if (data && data.length > 0) {
          setPlans(data);
        }
      } catch (err) {
        console.error("Failed to fetch plans, using fallback.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const plan = plans[0] || null;
  const monthlyPrice = plan?.monthlyPrice || FALLBACK_PLAN.monthlyPrice;
  const annualPrice = plan?.yearlyPrice || FALLBACK_PLAN.yearlyPrice;
  const planName = plan?.name || FALLBACK_PLAN.name;
  const features = plan?.features?.length > 0 ? plan.features : FALLBACK_PLAN.features;

  const annualSaving = monthlyPrice * 12 - annualPrice;

  const handleStartTrial = (cycle) => {
    navigate(`/register?billingCycle=${cycle}`);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem" }}>
          Loading pricing...
        </div>
      </PageWrapper>
    );
  }

  const currentPrice = billingCycle === "MONTHLY" ? monthlyPrice : annualPrice;

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Simple, transparent pricing</PageTitle>
        <PageSubtitle>
          Everything you need to manage your workforce. No hidden fees.
        </PageSubtitle>

        <PlanBillingToggle>
          <PlanBillingOption
            active={billingCycle === "MONTHLY"}
            onClick={() => setBillingCycle("MONTHLY")}
          >
            <PlanBillingLabel active={billingCycle === "MONTHLY"}>
              Monthly
            </PlanBillingLabel>
          </PlanBillingOption>
          <PlanBillingOption
            active={billingCycle === "YEARLY"}
            onClick={() => setBillingCycle("YEARLY")}
          >
            <PlanBillingLabel active={billingCycle === "YEARLY"}>
              Annual
            </PlanBillingLabel>
            {billingCycle !== "YEARLY" && (
              <PlanBillingSave>Save ₹{annualSaving.toLocaleString("en-IN")}</PlanBillingSave>
            )}
          </PlanBillingOption>
        </PlanBillingToggle>
      </PageHeader>

      <PricingCard>
        <PlanBadge>Most Popular</PlanBadge>

        <PlanName>{planName}</PlanName>

        <PlanPrice>
          <PlanPriceAmount>
            ₹{currentPrice.toLocaleString("en-IN")}
          </PlanPriceAmount>
          <PlanPricePeriod>
            /{billingCycle === "MONTHLY" ? "month" : "year"}
          </PlanPricePeriod>
        </PlanPrice>

        {billingCycle === "YEARLY" && (
          <PlanBillingSave style={{ marginBottom: "1.5rem" }}>
            Save ₹{annualSaving.toLocaleString("en-IN")} per year
          </PlanBillingSave>
        )}

        <PlanFeatures>
          {features.map((feature) => (
            <PlanFeature key={feature}>
              <PlanFeatureIcon>
                <FiCheck />
              </PlanFeatureIcon>
              <PlanFeatureText>{feature}</PlanFeatureText>
            </PlanFeature>
          ))}
        </PlanFeatures>

        <SubscribeButton onClick={() => handleStartTrial("MONTHLY")} fullWidth>
          <FiCreditCard />
          Start 7-Day Free Trial — ₹{monthlyPrice.toLocaleString("en-IN")}/mo
        </SubscribeButton>
        <SubscribeButtonSecondary onClick={() => handleStartTrial("YEARLY")} fullWidth>
          Start 7-Day Free Trial — ₹{annualPrice.toLocaleString("en-IN")}/yr
        </SubscribeButtonSecondary>

        <GuaranteeText>
          <GuaranteeIcon>
            <FiShield />
          </GuaranteeIcon>
          7-day free trial · Cancel anytime · No hidden charges
        </GuaranteeText>
      </PricingCard>

      <TrustBadges>
        <TrustBadge>
          <FiShield />
          <span>Secure Payments</span>
        </TrustBadge>
        <TrustBadge>
          <FiCheck />
          <span>7-Day Free Trial</span>
        </TrustBadge>
        <TrustBadge>
          <FiCreditCard />
          <span>Cancel Anytime</span>
        </TrustBadge>
      </TrustBadges>
    </PageWrapper>
  );
};

export default Pricing;
