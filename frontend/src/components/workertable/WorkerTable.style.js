import styled from "styled-components";

export const TableCard = styled.div`
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  box-shadow: 0 8px 24px rgba(15,23,42,.05);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  thead{
    background:var(--table-header-bg);
  }

  th{
    padding:1rem .75rem;
    text-align:left;
    color:var(--text);
    font-size:.88rem;
    font-weight:600;
    border-bottom:1px solid var(--border);
  }

  td{
    padding:1rem .75rem;
    color:var(--text);
    font-size:.88rem;
    border-bottom:1px solid var(--surface-hover);
    word-break:break-word;
  }

  tbody tr:hover{
    background:var(--table-header-bg);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const WorkerInfo = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
`;

export const Avatar = styled.div`
  width:2.8rem;
  height:2.8rem;
  border-radius:50%;
  background:var(--primary);
  color: var(--text-on-primary);
  display:flex;
  justify-content:center;
  align-items:center;
  font-weight:700;
`;

export const Status = styled.span`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:.35rem .8rem;
  border-radius:999px;
  font-size:.75rem;
  font-weight:600;
  background:${({ status }) =>
    status === "Active"
      ? "var(--badge-success-bg)"
      : "var(--badge-danger-bg)"};
  color:${({ status }) =>
    status === "Active"
      ? "var(--success)"
      : "var(--danger)"};
`;

export const ActionButtons = styled.div`
  display:flex;
  justify-content:center;
  gap:.5rem;
`;

export const IconButton = styled.button`
  width:2.2rem;
  height:2.2rem;
  border:none;
  border-radius:.6rem;
  background:var(--primary-light);
  color:var(--primary);
  cursor:pointer;
  transition:.25s;
  display:inline-flex;
  align-items:center;
  justify-content:center;

  &:hover{
    background:var(--primary);
    color: var(--text-on-primary);
  }

  @media (max-width: 768px) {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 0.7rem;
  }
`;

export const SkeletonRow = styled.div`
  height: 20px;
  background: linear-gradient(90deg, var(--surface-hover) 25%, var(--border) 50%, var(--surface-hover) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const WorkerCardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const WorkerCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(15,23,42,.04);
`;

export const WorkerCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

export const WorkerCardIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

export const WorkerCardName = styled.div`
  font-weight: 700;
  color: var(--text);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const WorkerCardMeta = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const WorkerCardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

export const WorkerCardField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const WorkerCardLabel = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  font-weight: 600;
`;

export const WorkerCardValue = styled.span`
  font-size: 0.9rem;
  color: var(--text);
  word-break: break-word;
`;

export const WorkerCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  justify-content: flex-end;
`;