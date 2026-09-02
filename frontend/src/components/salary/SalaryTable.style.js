import styled from "styled-components";

export const TableCard = styled.div`
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 1rem;

  overflow-x: auto;

  box-shadow: 0 8px 24px rgba(15, 23, 42, .05);
  width: 100%;
  max-width: 100%;
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
`;

export const Status = styled.span`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding: .35rem .9rem;

  border-radius: 999px;

  font-size: .8rem;

  font-weight: 600;

  background: ${({ $status }) =>

    $status === "Paid"

      ? "var(--badge-success-bg)"

      : $status === "Partial"

      ? "#FEF3C7"

      : "var(--badge-danger-bg)"

  };

  color: ${({ $status }) =>

    $status === "Paid"

      ? "#15803D"

      : $status === "Partial"

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

export const CardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 100%;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-width: 0;
`;

export const CardName = styled.div`
  font-weight: 700;
  color: var(--text);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

export const CardSub = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

export const CardField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`;

export const CardLabel = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  font-weight: 600;
`;

export const CardValue = styled.span`
  font-size: 0.9rem;
  color: var(--text);
  word-break: break-word;
`;

export const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;
