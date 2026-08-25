import { useNavigate } from "react-router-dom";
import { FiCheck, FiArrowRight } from "react-icons/fi";

import {
  PLAN,
  formatPrice,
} from "../../constants/subscription";

import {
  PageWrapper,
  SuccessCard,
  SuccessIcon,
  SuccessTitle,
  SuccessMessage,
  PlanSummary,
  PlanRow,
  PlanLabel,
  PlanValue,
  CTAButton,
  SecondaryLink,
} from "./OnboardingSuccess.style";

const OnboardingSuccess = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <PageWrapper>
      <SuccessCard>
        <SuccessIcon>
          <FiCheck />
        </SuccessIcon>

        <SuccessTitle>Welcome to {PLAN.name}!</SuccessTitle>
        <SuccessMessage>
          Your 7-day free trial has started. You now have full access to all features.
        </SuccessMessage>

        <PlanSummary>
          <PlanRow>
            <PlanLabel>Plan</PlanLabel>
            <PlanValue>{PLAN.name}</PlanValue>
          </PlanRow>
          <PlanRow>
            <PlanLabel>Trial</PlanLabel>
            <PlanValue>7 Days</PlanValue>
          </PlanRow>
          <PlanRow>
            <PlanLabel>Monthly Price</PlanLabel>
            <PlanValue>{formatPrice(PLAN.monthlyPrice)}/month</PlanValue>
          </PlanRow>
          <PlanRow>
            <PlanLabel>Yearly Price</PlanLabel>
            <PlanValue>{formatPrice(PLAN.yearlyPrice)}/year</PlanValue>
          </PlanRow>
        </PlanSummary>

        <CTAButton onClick={handleGoToDashboard}>
          Go to Dashboard <FiArrowRight />
        </CTAButton>

        <SecondaryLink to="/subscription">Manage Subscription</SecondaryLink>
      </SuccessCard>
    </PageWrapper>
  );
};

export default OnboardingSuccess;
