import styled from "styled-components";

export const TableCard = styled.div`
  width: 100%;

  background: #fff;

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

  color:#fff;

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
      ? "#15803D"
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

  &:hover{

    background:var(--primary);

    color:#fff;

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