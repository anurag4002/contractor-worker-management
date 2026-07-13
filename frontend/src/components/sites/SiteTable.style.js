import styled from "styled-components";

export const TableCard = styled.div`
  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 1rem;

  overflow-x: auto;

  box-shadow: 0 8px 24px rgba(15, 23, 42, .05);
`;

export const Table = styled.table`
  width: 100%;

  min-width: 1100px;

  border-collapse: collapse;

  thead {
    background: #f8fafc;
  }

  th {
    padding: 1rem;

    text-align: left;

    color: #475569;

    font-size: .9rem;

    font-weight: 600;

    border-bottom: 1px solid #e2e8f0;

    white-space: nowrap;
  }

  td {
    padding: 1rem;

    color: #334155;

    border-bottom: 1px solid #f1f5f9;

    white-space: nowrap;
  }

  tbody tr:hover {
    background: #f8fafc;
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
    status === "Active"
      ? "#DCFCE7"
      : "#E2E8F0"};

  color: ${({ status }) =>
    status === "Active"
      ? "#15803D"
      : "#475569"};
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

  background: #EFF6FF;

  color: #2563EB;

  display: flex;

  justify-content: center;

  align-items: center;

  cursor: pointer;

  transition: .25s;

  &:hover {

    background: #2563EB;

    color: #ffffff;

  }
`;