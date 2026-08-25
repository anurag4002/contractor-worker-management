import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
  max-width: 80rem;
  margin: 0 auto;
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

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
  max-width: 30rem;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1.25rem var(--shadow-medium);
    border-color: ${({ onClick }) => (onClick ? "var(--primary)" : "var(--border)")};
  }

  @media (max-width: 640px) {
    padding: 1rem;
  }
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

export const StatCardTitle = styled.h3`
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

export const StatCardDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.8rem;
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
