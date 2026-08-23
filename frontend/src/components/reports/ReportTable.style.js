import styled from "styled-components";

export const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap || "1rem"};
`;

export const FilterControls = styled.div`
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
`;

export const FilterLabel = styled.label`
  font-size: 0.85rem;
  color: var(--text-secondary);
  white-space: nowrap;
`;

export const TableCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow-x: auto;
  box-shadow: 0 8px 24px var(--shadow);
`;

export const Table = styled.table`
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;

  thead {
    background: var(--table-header-bg);
  }

  th {
    padding: 1rem;
    text-align: left;
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  td {
    padding: 1rem;
    color: var(--text);
    border-bottom: 1px solid var(--table-border);
    white-space: nowrap;
  }

  tbody tr {
    transition: 0.25s;
  }

  tbody tr:hover {
    background: var(--table-row-hover);
  }

  @media (max-width: 768px) {
    min-width: 1200px;
  }
`;

export const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === "ACTIVE" || $status === "PRESENT" || $status === "PAID" ? "var(--badge-success-bg)" :
      $status === "GENERATED" || $status === "HALF_DAY" ? "var(--badge-info-bg)" :
        $status === "PENDING" || $status === "LEAVE" || $status === "HOLIDAY" ? "var(--badge-warning-bg)" :
          $status === "INACTIVE" || $status === "ABSENT" || $status === "CANCELLED" ? "var(--badge-danger-bg)" :
            $status === "COMPLETED" ? "var(--badge-purple-bg)" :
              "var(--surface-hover)"
  };
  color: ${({ $status }) =>
    $status === "ACTIVE" || $status === "PRESENT" || $status === "PAID" ? "var(--badge-success-fg)" :
      $status === "GENERATED" || $status === "HALF_DAY" ? "var(--badge-info-fg)" :
        $status === "PENDING" || $status === "LEAVE" || $status === "HOLIDAY" ? "var(--badge-warning-fg)" :
          $status === "INACTIVE" || $status === "ABSENT" || $status === "CANCELLED" ? "var(--badge-danger-fg)" :
            $status === "COMPLETED" ? "var(--badge-purple-fg)" :
              "var(--text-secondary)"
  };
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const IconButton = styled.button`
  width: 2.4rem;
  height: 2.4rem;
  border: none;
  border-radius: .65rem;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: var(--primary);
    color: var(--text-on-primary);
  }

  @media (max-width: 768px) {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 0.7rem;
  }
`;