import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1rem;
  max-width: 60rem;
  margin: 0 auto;
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    gap: 1rem;
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: var(--surface);
  color: var(--text);
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border);
  align-self: flex-start;

  &:hover {
    background: var(--primary);
    color: var(--text-on-primary);
    border-color: var(--primary);
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  gap: 1.25rem;
`;

export const Section = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 0.75rem;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: var(--text);
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const SectionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 1rem;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

export const InfoLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  flex-shrink: 0;
`;

export const InfoValue = styled.span`
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: right;
  word-break: break-word;

  @media (max-width: 480px) {
    text-align: left;
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
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

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  gap: 1rem;
  width: 100%;
`;

export const StatCard = styled.div`
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StatCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: ${({ color }) => `${color}18`};
  color: ${({ color }) => color};
  font-size: 1.25rem;
`;

export const StatCardTitle = styled.h4`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
`;

export const StatCardValue = styled.div`
  color: var(--text);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: var(--text-secondary);

  .loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-secondary);

  h3 {
    margin: 0;
    color: var(--text);
    font-size: 1.25rem;
  }

  p {
    margin: 0;
  }
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
  transition: 0.2s;

  &:hover {
    background: var(--primary-hover);
  }
`;
