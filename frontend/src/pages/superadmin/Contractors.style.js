import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    gap: 1rem;
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

export const Toolbar = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 14rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 0.75rem;
  background: var(--input-bg);
  color: var(--input-text);
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: var(--primary);
  }

  &::placeholder {
    color: var(--input-placeholder);
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 1.1rem;
`;

export const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 0.75rem;
  background: var(--input-bg);
  color: var(--input-text);
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--primary);
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: ${({ variant }) =>
    variant === "secondary" ? "var(--border)" : "var(--primary)"};
  color: ${({ variant }) =>
    variant === "secondary" ? "var(--text)" : "var(--text-on-primary)"};
  padding: ${({ size }) => (size === "small" ? "0.5rem 0.75rem" : "0.75rem 1.25rem")};
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: ${({ size }) => (size === "small" ? "0.8rem" : "0.9rem")};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ variant }) =>
      variant === "secondary" ? "var(--surface-hover)" : "var(--primary-hover)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

export const TableHeader = styled.thead`
  background: var(--bg);
`;

export const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;

  @media (max-width: 1024px) {
    &:nth-child(n+6) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    &:nth-child(n+5) {
      display: none;
    }
  }

  @media (max-width: 480px) {
    &:nth-child(n+4) {
      display: none;
    }
  }
`;

export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: var(--surface-hover);
    }
  }
`;

export const TableRow = styled.tr`
  cursor: default;
`;

export const TableCell = styled.td`
  padding: 1rem;
  color: var(--text);
  vertical-align: middle;

  @media (max-width: 1024px) {
    &:nth-child(n+6) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    &:nth-child(n+5) {
      display: none;
    }
  }

  @media (max-width: 480px) {
    &:nth-child(n+4) {
      display: none;
    }
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

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;

  h3 {
    margin: 0;
    color: var(--text);
    font-size: 1.25rem;
  }

  p {
    margin: 0;
  }
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

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.span`
  color: var(--text-secondary);
  font-size: 0.85rem;
`;
