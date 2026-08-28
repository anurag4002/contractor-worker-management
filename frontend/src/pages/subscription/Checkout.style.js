import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1rem;
  max-width: 40rem;
  margin: 0 auto;
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    gap: 1.25rem;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  width: 100%;
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
`;

export const PageSubtitle = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  max-width: 28rem;
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  border: none;
  background: transparent;
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.2s;

  &:hover {
    color: var(--primary-hover);
  }
`;

export const CheckoutCard = styled.div`
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 0.75rem;
    gap: 1rem;
  }
`;

export const PlanSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
`;

export const PlanName = styled.h2`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 700;
  letter-spacing: 0.04em;
`;

export const PlanPrice = styled.div`
  color: var(--text);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
`;

export const PlanBilling = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
`;

export const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 22rem;
  margin: 0 auto;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const SummaryLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
`;

export const SummaryValue = styled.span`
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: right;
`;

export const SummaryDivider = styled.div`
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
  margin-top: 0.25rem;
`;

export const SummaryTotal = styled(SummaryRow)`
  font-weight: 700;
`;

export const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
`;

export const PaymentTitle = styled.h3`
  margin: 0;
  color: var(--text);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 700;
`;

export const PaymentDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  max-width: 24rem;
`;

export const PaymentButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.9rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  width: 100%;
  max-width: 22rem;

  &:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }

  .spin {
    animation: ${spin} 1s linear infinite;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
  }
`;

export const PaymentButtonSecondary = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  width: 100%;
  max-width: 22rem;

  &:hover:not(:disabled) {
    border-color: var(--primary);
    background: var(--primary-light);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
`;

export const SecurityNote = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 22rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  font-size: 0.9rem;
  font-weight: 500;
`;

export const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 22rem;
  margin: 0 auto;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
  font-size: 0.85rem;
  flex-shrink: 0;
`;

export const FeatureText = styled.span`
  color: var(--text);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  font-weight: 500;
`;
