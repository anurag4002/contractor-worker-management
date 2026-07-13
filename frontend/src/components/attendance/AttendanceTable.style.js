import styled from "styled-components";

export const TableCard = styled.div`
  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 1rem;

  overflow-x: auto;

  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;

export const Table = styled.table`
  width: 100%;

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
  }

  td {
    padding: 1rem;

    color: #334155;

    border-bottom: 1px solid #e2e8f0;

    font-size: .9rem;
  }

  tbody tr:hover {
    background: #f8fafc;
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
      ? "#DCFCE7"
      : status === "Absent"
      ? "#FEE2E2"
      : "#FEF3C7"};

  color: ${({ status }) =>
    status === "Present"
      ? "#15803D"
      : status === "Absent"
      ? "#DC2626"
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

  background: #eff6ff;

  color: #2563eb;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  transition: .25s;

  &:hover {

    background: #2563eb;

    color: #ffffff;

  }
`;