import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const PageWrapper = styled.div`
  max-width: 36rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 0.5rem;
`;

export const PageSubtitle = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
`;

export const CheckoutCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 10px 30px var(--shadow);
`;

export const PlanSummary = styled.div`
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
`;

export const PlanName = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.25rem;
`;

export const PlanBilling = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
`;

export const TrialBadge = styled.span`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--success);
  background: rgba(22, 163, 74, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
`;

export const OrderSummary = styled.div`
  margin-bottom: 1.5rem;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
`;

export const SummaryLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const SummaryValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
`;

export const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 0.75rem 0;
`;

export const SummaryTotal = styled(SummaryRow)`
  ${SummaryLabel} {
    font-weight: 700;
    color: var(--text);
  }
  ${SummaryValue} {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--success);
  }
`;

export const PaymentSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const PaymentTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 0.5rem;
`;

export const PaymentDescription = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 1rem;
`;

export const PaymentButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 0.8rem;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.95rem 1.1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  &:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

export const PaymentButtonSecondary = styled.button`
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  background: transparent;
  color: var(--text-secondary);
  padding: 0.85rem 1.1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(220, 38, 38, 0.1);
  color: var(--danger);
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

export const LoadingOverlay = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

export const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

export const FeatureIcon = styled.span`
  color: var(--success);
  display: flex;
  align-items: center;
`;

export const FeatureText = styled.span``;
