import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1rem;
  max-width: 50rem;
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
  gap: 0.75rem;
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
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  max-width: 30rem;
`;

export const PlanBillingToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.35rem;
  margin-top: 0.75rem;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

export const PlanBillingOption = styled.button`
  position: relative;
  border: none;
  background: ${({ active }) => (active ? "var(--primary)" : "transparent")};
  color: ${({ active }) =>
    active ? "var(--text-on-primary)" : "var(--text-secondary)"};
  padding: 0.6rem 1.25rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ active }) =>
      active ? "var(--primary-hover)" : "var(--surface-hover)"};
    color: ${({ active }) =>
      active ? "var(--text-on-primary)" : "var(--text)"};
  }

  @media (max-width: 480px) {
    flex: 1;
    text-align: center;
    padding: 0.6rem 0.75rem;
    font-size: 0.85rem;
  }
`;

export const PlanBillingLabel = styled.span`
  font-weight: 600;
`;

export const PlanBillingSave = styled.span`
  display: inline-block;
  margin-top: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
  font-size: 0.75rem;
  font-weight: 700;
`;

export const PricingCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 32rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 0.5rem 1.5rem var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 1rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    border-radius: 1rem;
    gap: 1rem;
  }
`;

export const PlanBadge = styled.div`
  position: absolute;
  top: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.35rem 1.1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
`;

export const PlanName = styled.h2`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 700;
  letter-spacing: 0.04em;
`;

export const PlanPrice = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
`;

export const PlanPriceAmount = styled.span`
  color: var(--text);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
`;

export const PlanPricePeriod = styled.span`
  color: var(--text-secondary);
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  font-weight: 500;
`;

export const PlanFeatures = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 22rem;
`;

export const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
`;

export const PlanFeatureIcon = styled.div`
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

export const PlanFeatureText = styled.span`
  color: var(--text);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  font-weight: 500;
`;

export const SubscribeButton = styled.button`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
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

  &:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
  }

  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
  }
`;

export const SubscribeButtonSecondary = styled.button`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  padding: 0.9rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--primary);
    background: var(--primary-light);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
  }
`;

export const GuaranteeText = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

export const GuaranteeIcon = styled.span`
  display: flex;
  color: var(--success);
  font-size: 1rem;
`;

export const TrustBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
`;

export const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;

  svg {
    color: var(--success);
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;
