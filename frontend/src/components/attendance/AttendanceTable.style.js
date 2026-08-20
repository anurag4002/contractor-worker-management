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

  @media (max-width: 768px) {
    display: none;
  }
`;

export const AttendanceCardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const AttendanceCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(15,23,42,.04);
`;

export const AttendanceCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

export const AttendanceCardIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

export const AttendanceCardName = styled.div`
  font-weight: 700;
  color: var(--text);
  font-size: 0.95rem;
`;

export const AttendanceCardMeta = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

export const AttendanceCardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

export const AttendanceCardField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const AttendanceCardLabel = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  font-weight: 600;
`;

export const AttendanceCardValue = styled.span`
  font-size: 0.9rem;
  color: var(--text);
  word-break: break-word;
`;

export const AttendanceCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  justify-content: flex-end;
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

  @media (max-width: 768px) {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 0.7rem;
  }
`;