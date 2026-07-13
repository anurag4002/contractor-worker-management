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

  min-width: 1200px;

  border-collapse: collapse;

  thead {

    background: #F8FAFC;

  }

  th {

    padding: 1rem;

    text-align: left;

    color: #475569;

    font-size: .9rem;

    font-weight: 600;

    border-bottom: 1px solid #E2E8F0;

    white-space: nowrap;

  }

  td {

    padding: 1rem;

    color: #334155;

    border-bottom: 1px solid #F1F5F9;

    white-space: nowrap;

  }

  tbody tr {

    transition: .25s;

  }

  tbody tr:hover {

    background: #F8FAFC;

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

    status === "Generated"

      ? "#DCFCE7"

      : "#FEF3C7"

  };

  color: ${({ status }) =>

    status === "Generated"

      ? "#15803D"

      : "#B45309"

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