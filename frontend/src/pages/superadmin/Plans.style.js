import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 1.5rem;
`;

export const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text);
`;

export const PageSubtitle = styled.p`
  margin: 0.4rem 0 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;

  &:hover:not(:disabled) {
    background: var(--surface-secondary);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ variant }) =>
    variant === "secondary" &&
    `
    background: var(--surface-secondary);
  `}
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
`;

export const TableHeader = styled.thead`
  background: var(--surface-secondary);
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 0.85rem 1rem;
  font-weight: 700;
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-top: 1px solid var(--border);

  &:hover {
    background: var(--surface-secondary);
  }
`;

export const TableCell = styled.td`
  padding: 0.85rem 1rem;
  color: var(--text);
  vertical-align: middle;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: var(--surface-secondary);
  color: var(--text-secondary);

  ${({ success }) =>
    success &&
    `
    background: rgba(22, 163, 74, 0.12);
    color: #16a34a;
  `}

  ${({ danger }) =>
    danger &&
    `
    background: rgba(220, 38, 38, 0.12);
    color: #dc2626;
  `}
`;

export const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
`;

export const FeatureIcon = styled.span`
  color: var(--success);
  display: flex;
  align-items: center;
`;

export const FeatureText = styled.span``;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
  gap: 1rem;

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
  gap: 0.75rem;
  text-align: center;
`;

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 0.6rem;
  border: none;
  background: var(--primary);
  color: var(--text-on-primary);
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--primary-hover);
  }
`;
