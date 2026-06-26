import styled from "styled-components";

export const AttendanceContainer = styled.div`
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
    flex-direction: column;
    align-items: flex-start;
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
    margin:.4rem 0 0;
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
    padding:.9rem 1rem;
    border:1px solid #CBD5E1;
    border-radius:.8rem;
    outline:none;
    transition:.3s;

    &:focus{
      border-color:#2563EB;
    }
  }

  @media(max-width:768px){
    width:100%;
  }
`;

export const Select = styled.select`
  padding:.9rem 1rem;

  border:1px solid #CBD5E1;

  border-radius:.8rem;

  outline:none;

  cursor:pointer;

  background:white;
`;

export const DateInput = styled.input`
  padding:.9rem 1rem;

  border:1px solid #CBD5E1;

  border-radius:.8rem;

  outline:none;
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

  border-radius:1rem;

  overflow:hidden;

  border:1px solid #E2E8F0;

  box-shadow:0 10px 30px rgba(15,23,42,.05);
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
    border-bottom:1px solid #E2E8F0;
  }

  td{
    padding:1rem;
    border-bottom:1px solid #E2E8F0;
    color:#334155;
  }

  tbody tr{
    transition:.25s;
  }

  tbody tr:hover{
    background:#F8FAFC;
  }
`;

export const StatusBadge = styled.span`
  display:inline-block;

  padding:.4rem .9rem;

  border-radius:999px;

  font-size:.8rem;

  font-weight:600;

  background:${({status})=>{

    switch(status){

      case "Present":
        return "#DCFCE7";

      case "Absent":
        return "#FEE2E2";

      default:
        return "#FEF3C7";

    }

  }};

  color:${({status})=>{

    switch(status){

      case "Present":
        return "#15803D";

      case "Absent":
        return "#DC2626";

      default:
        return "#B45309";

    }

  }};
`;

export const ActionButtons = styled.div`
  display:flex;
  gap:.5rem;
`;

export const ActionButton = styled.button`
  border:none;

  padding:.55rem .9rem;

  border-radius:.6rem;

  cursor:pointer;

  color:white;

  font-size:.8rem;

  background:${({type})=>{

    switch(type){

      case "present":
        return "#16A34A";

      case "absent":
        return "#DC2626";

      default:
        return "#F59E0B";

    }

  }};

  transition:.3s;

  &:hover{
    opacity:.9;
  }
`;