import styled from "styled-components";

export const WorkersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width:768px){
    flex-direction:column;
    align-items:flex-start;
  }
`;

export const TitleSection = styled.div`
  h2{
    margin:0;
    font-size:2rem;
    color:#0F172A;
    font-weight:700;
  }

  p{
    margin:.5rem 0 0;
    color:#64748B;
  }
`;

export const ActionSection = styled.div`
  display:flex;
  gap:1rem;
  flex-wrap:wrap;
`;

export const SearchBox = styled.div`
  width:20rem;
  position:relative;

  input{
    width:100%;
    padding:0.9rem 1rem;
    border:1px solid #CBD5E1;
    border-radius:0.8rem;
    outline:none;
    font-size:.95rem;

    &:focus{
      border-color:#2563EB;
    }
  }

  @media(max-width:768px){
      width:100%;
  }
`;

export const Button = styled.button`
  border:none;

  background:#2563EB;

  color:white;

  padding:.9rem 1.4rem;

  border-radius:.8rem;

  cursor:pointer;

  font-weight:600;

  transition:.3s;

  &:hover{
      background:#1D4ED8;
  }
`;

export const TableCard = styled.div`
  background:white;

  border-radius:1.25rem;

  overflow:hidden;

  border:1px solid #E2E8F0;

  box-shadow:0 10px 25px rgba(15,23,42,.05);
`;

export const Table = styled.table`
  width:100%;
  border-collapse:collapse;

  thead{
      background:#F8FAFC;
  }

  th{
      padding:1rem;
      text-align:left;
      color:#475569;
      font-size:.9rem;
      font-weight:600;
      border-bottom:1px solid #E2E8F0;
  }

  td{
      padding:1rem;
      border-bottom:1px solid #E2E8F0;
      color:#334155;
      font-size:.95rem;
  }

  tbody tr{
      transition:.3s;
  }

  tbody tr:hover{
      background:#F8FAFC;
  }
`;

export const WorkerInfo = styled.div`
  display:flex;
  align-items:center;
  gap:1rem;
`;

export const Avatar = styled.div`
  width:2.8rem;
  height:2.8rem;

  border-radius:50%;

  background:#2563EB;

  display:flex;
  justify-content:center;
  align-items:center;

  color:white;

  font-weight:700;
`;

export const Status = styled.span`
  display:inline-block;

  padding:.35rem .9rem;

  border-radius:999px;

  background:${({status})=>
    status==="Present"
    ? "#DCFCE7"
    : "#FEE2E2"};

  color:${({status})=>
    status==="Present"
    ? "#15803D"
    : "#DC2626"};

  font-size:.8rem;

  font-weight:600;
`;

export const ActionButtons = styled.div`
  display:flex;
  gap:.6rem;
`;

export const IconButton = styled.button`
  width:2.3rem;
  height:2.3rem;

  border:none;

  border-radius:.6rem;

  background:#EFF6FF;

  color:#2563EB;

  cursor:pointer;

  transition:.3s;

  &:hover{
      background:#2563EB;
      color:white;
  }
`;