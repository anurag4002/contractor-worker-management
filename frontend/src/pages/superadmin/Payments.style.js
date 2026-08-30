import styled from "styled-components";

export const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 0.25rem 0;
`;

export const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
  min-width: 220px;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

export const SearchIcon = styled.span`
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  color: var(--text-secondary);
`;

export const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--surface-hover);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ variant }) =>
    variant === "secondary" &&
    `
    background: var(--primary);
    color: var(--text-on-primary);
    border-color: var(--primary);
  `}
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--surface);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

export const TableHeader = styled.thead`
  background: var(--table-header-bg);
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--surface-hover);
  }
`;

export const TableCell = styled.td`
  padding: 0.75rem 1rem;
  color: var(--text);
  vertical-align: middle;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $success, $warning, $danger }) => {
    if ($danger) return "var(--badge-danger-bg)";
    if ($warning) return "var(--badge-warning-bg)";
    if ($success) return "var(--badge-success-bg)";
    return "var(--badge-info-bg)";
  }};
  color: ${({ $success, $warning, $danger }) => {
    if ($danger) return "var(--badge-danger-fg)";
    if ($warning) return "var(--badge-warning-fg)";
    if ($success) return "var(--badge-success-fg)";
    return "var(--badge-info-fg)";
  }};
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
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
  text-align: center;
  color: var(--text);

  h3 {
    margin: 1rem 0 0.25rem 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0 0 1rem 0;
    color: var(--text-secondary);
  }
`;

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--primary);
  color: var(--text-on-primary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);

  h3 {
    margin: 1rem 0 0.25rem 0;
    color: var(--text);
  }

  p {
    margin: 0;
  }
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const PaginationInfo = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

export const PaginationButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
  color: var(--text);
  font-size: 0.85rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--surface-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
