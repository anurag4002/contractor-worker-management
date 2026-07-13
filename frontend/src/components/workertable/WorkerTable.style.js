import styled from "styled-components";

export const TableCard = styled.div`
  width: 100%;

  background: #fff;

  border: 1px solid #e2e8f0;

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
    background:#F8FAFC;
  }

  th{
    padding:1rem .75rem;

    text-align:left;

    color:#475569;

    font-size:.88rem;

    font-weight:600;

    border-bottom:1px solid #E2E8F0;
  }

  td{
    padding:1rem .75rem;

    color:#334155;

    font-size:.88rem;

    border-bottom:1px solid #F1F5F9;

    word-break:break-word;
  }

  tbody tr:hover{
    background:#F8FAFC;
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

  background:#2563EB;

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

  background:${({status})=>
    status==="Active"
      ? "#DCFCE7"
      : "#FEE2E2"};

  color:${({status})=>
    status==="Active"
      ? "#15803D"
      : "#DC2626"};
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

  background:#EFF6FF;

  color:#2563EB;

  cursor:pointer;

  transition:.25s;

  &:hover{

    background:#2563EB;

    color:#fff;

  }
`;