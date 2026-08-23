import styled from "styled-components";

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const IconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: ${({ color }) => color || "var(--primary)"}22;
  color: ${({ color }) => color || "var(--primary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

export const Info = styled.div`
  p { margin: 0; font-size: 0.85rem; color: var(--text-secondary); }
  h3 { margin: 0.25rem 0 0; font-size: 1.5rem; font-weight: 700; color: var(--text); }
`;

export const TableCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow-x: auto;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  thead tr { background: var(--bg); }
  th {
    padding: 1rem 1.25rem;
    text-align: left;
    font-weight: 600;
    color: var(--text);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--surface-hover);
    color: var(--text);
  }
  tbody tr:hover { background: var(--bg); }
  tbody tr:last-child td { border-bottom: none; }

  @media (max-width: 768px) {
    min-width: 0;
  }
`;

export const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === "PAID" ? "var(--badge-success-bg)" :
      $status === "GENERATED" ? "var(--badge-info-bg)" :
        $status === "PENDING" ? "var(--badge-warning-bg)" :
          $status === "CANCELLED" ? "var(--badge-danger-bg)" : "var(--surface-hover)"};
  color: ${({ $status }) =>
    $status === "PAID" ? "var(--success)" :
      $status === "GENERATED" ? "var(--primary)" :
        $status === "PENDING" ? "var(--warning)" :
          $status === "CANCELLED" ? "var(--danger)" : "var(--text-secondary)"};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const IconButton = styled.button`
  background: none;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.85rem;
  transition: 0.2s;
  &:hover { background: var(--surface-hover); color: var(--text); }

  @media (max-width: 768px) {
    padding: 0.5rem 0.7rem;
    font-size: 0.9rem;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 180px;
  padding: 0.65rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 0.65rem;
  font-size: 0.9rem;
  outline: none;
  &:focus { border-color: var(--primary); }
`;

export const FilterSelect = styled.select`
  padding: 0.65rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 0.65rem;
  font-size: 0.9rem;
  background: var(--surface);
  outline: none;
  cursor: pointer;
  &:focus { border-color: var(--primary); }
`;

export const ResetButton = styled.button`
  padding: 0.65rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 0.65rem;
  background: var(--bg);
  font-size: 0.9rem;
  cursor: pointer;
  &:hover { background: var(--surface-hover); }
`;
