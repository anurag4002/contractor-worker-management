import styled from "styled-components";

export const TableCard = styled.div`
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 1rem;

  overflow-x: auto;

  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;

export const Table = styled.table`
  width: 100%;

  border-collapse: collapse;

  thead {
    background: var(--bg);
  }

  th {
    padding: 1rem;

    text-align: left;

    color: var(--text);

    font-size: .9rem;

    font-weight: 600;

    border-bottom: 1px solid var(--border);
  }

  td {
    padding: 1rem;

    color: var(--text);

    border-bottom: 1px solid var(--border);

    font-size: .9rem;
  }

  tbody tr:hover {
    background: var(--bg);
  }
`;

export const Status = styled.span`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding: .35rem .8rem;

  border-radius: 999px;

  font-size: .8rem;

  font-weight: 600;

  background: ${({ status }) =>
    status === "Present"
      ? "var(--badge-success-bg)"
      : status === "Absent"
      ? "var(--badge-danger-bg)"
      : "#FEF3C7"};

  color: ${({ status }) =>
    status === "Present"
      ? "#15803D"
      : status === "Absent"
      ? "var(--danger)"
      : "#B45309"};
`;

export const ActionButtons = styled.div`
  display: flex;

  gap: .6rem;
`;

export const IconButton = styled.button`
  width: 2.4rem;

  height: 2.4rem;

  border: none;

  border-radius: .6rem;

  background: var(--primary-light);

  color: var(--primary);

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  transition: .25s;

  &:hover {

    background: var(--primary);

    color: var(--surface);

  }
`;