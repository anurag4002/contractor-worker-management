import styled from "styled-components";

export const TableCard = styled.div`
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 1rem;

  overflow-x: auto;

  box-shadow: 0 8px 24px rgba(15, 23, 42, .05);
`;

export const Table = styled.table`
  width: 100%;

  min-width: 1100px;

  border-collapse: collapse;

  thead {

    background: var(--table-header-bg);

  }

  th {

    padding: 1rem;

    text-align: left;

    color: var(--text);

    font-size: .9rem;

    font-weight: 600;

    border-bottom: 1px solid var(--border);

    white-space: nowrap;

  }

  td {

    padding: 1rem;

    color: var(--text);

    border-bottom: 1px solid var(--surface-hover);

    white-space: nowrap;

  }

  tbody tr {

    transition: .25s;

  }

  tbody tr:hover {

    background: var(--table-header-bg);

  }

  @media (max-width: 768px) {
    min-width: 900px;
  }
`;

export const Status = styled.span`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding: .35rem .9rem;

  border-radius: 999px;

  font-size: .8rem;

  font-weight: 600;

  background: ${({ status }) =>

    status === "Paid"

      ? "var(--badge-success-bg)"

      : status === "Partial"

      ? "#FEF3C7"

      : "var(--badge-danger-bg)"

  };

  color: ${({ status }) =>

    status === "Paid"

      ? "#15803D"

      : status === "Partial"

      ? "#B45309"

      : "var(--danger)"

  };
`;

export const ActionButtons = styled.div`
  display: flex;

  gap: .5rem;
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

  transition: .25s;

  &:hover {

    background: var(--primary);

    color: var(--surface);

  }

  @media (max-width: 768px) {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 0.7rem;
  }
`;
