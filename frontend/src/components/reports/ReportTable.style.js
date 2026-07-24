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
  color: #64748b;
  white-space: nowrap;
`;

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
  font-size: .78rem;
  font-weight: 600;

  background: ${({ status }) =>
    status === "ACTIVE" || status === "PRESENT" || status === "PAID" ? "#dcfce7" :
      status === "GENERATED" || status === "HALF_DAY" ? "#dbeafe" :
        status === "PENDING" || status === "LEAVE" || status === "HOLIDAY" ? "#fef9c3" :
          status === "INACTIVE" || status === "ABSENT" || status === "CANCELLED" ? "#fee2e2" :
            status === "COMPLETED" ? "#f3e8ff" :
              "#f1f5f9"
  };

  color: ${({ status }) =>
    status === "ACTIVE" || status === "PRESENT" || status === "PAID" ? "#16a34a" :
      status === "GENERATED" || status === "HALF_DAY" ? "#2563eb" :
        status === "PENDING" || status === "LEAVE" || status === "HOLIDAY" ? "#ca8a04" :
          status === "INACTIVE" || status === "ABSENT" || status === "CANCELLED" ? "#dc2626" :
            status === "COMPLETED" ? "#7c3aed" :
              "#64748b"
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