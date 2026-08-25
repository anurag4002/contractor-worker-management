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

export const StatusCard = styled.div`
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 0.75rem;
    gap: 0.6rem;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  background: ${({ success, danger, warning }) =>
    success
      ? "var(--badge-success-bg)"
      : danger
        ? "var(--badge-danger-bg)"
        : warning
          ? "var(--badge-warning-bg)"
          : "var(--badge-info-bg)"};
  color: ${({ success, danger, warning }) =>
    success
      ? "var(--badge-success-fg)"
      : danger
        ? "var(--badge-danger-fg)"
        : warning
          ? "var(--badge-warning-fg)"
          : "var(--badge-info-fg)"};
`;

export const StatusTitle = styled.h2`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-weight: 700;
`;

export const StatusDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  max-width: 24rem;
`;

export const StatusDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 22rem;
  margin-top: 0.5rem;
`;

export const StatusDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--bg);
  border: 1px solid var(--border);
`;

export const StatusDetailLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
`;

export const StatusDetailValue = styled.span`
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: right;
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 0.5rem;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;

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
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    flex: 1;
  }
`;

export const ActionButtonSecondary = styled.button`
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
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    flex: 1;
  }
`;

export const FeaturesCard = styled.div`
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
  }
`;

export const FeaturesTitle = styled.h3`
  margin: 0;
  color: var(--text);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 700;
`;

export const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

export const PricingSummary = styled.div`
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
    border-radius: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 0.75rem;
  }
`;

export const PricingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const PricingLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
`;

export const PricingValue = styled.span`
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: right;
`;

export const PricingTotal = styled(PricingRow)`
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
  margin-top: 0.25rem;
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

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: 0.2s;

  &:hover {
    background: var(--primary-hover);
  }
`;
