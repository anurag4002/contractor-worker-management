import styled from "styled-components";

export const SalaryContainer = styled.div`
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

export const Button = styled.button`
  border:none;

  background:#2563EB;

  color:white;

  padding:.9rem 1.4rem;

  border-radius:.8rem;

  cursor:pointer;

  font-weight:600;

  transition:.3s;

  display:flex;
  align-items:center;
  gap:.5rem;

  &:hover{
    background:#1D4ED8;
  }
`;

export const SummaryGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:1.5rem;
`;

export const SummaryCard = styled.div`
  background:white;

  border-radius:1rem;

  padding:1.5rem;

  border:1px solid #E2E8F0;

  box-shadow:0 10px 25px rgba(15,23,42,.05);

  h4{
    margin:0;
    color:#64748B;
    font-size:.95rem;
  }

  h2{
    margin:.75rem 0 0;
    color:#0F172A;
    font-size:1.8rem;
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
    color:#334155;
    border-bottom:1px solid #E2E8F0;
  }

  tbody tr{
    transition:.3s;
  }

  tbody tr:hover{
    background:#F8FAFC;
  }
`;

export const Status = styled.span`
  display:inline-block;

  padding:.4rem .9rem;

  border-radius:999px;

  font-size:.8rem;

  font-weight:600;

  background:${({status})=>
    status==="Paid"
      ? "#DCFCE7"
      : "#FEF3C7"};

  color:${({status})=>
    status==="Paid"
      ? "#15803D"
      : "#B45309"};
`;

export const PaymentButton = styled.button`
  border:none;

  background:#16A34A;

  color:white;

  padding:.65rem 1rem;

  border-radius:.65rem;

  cursor:pointer;

  font-weight:600;

  transition:.3s;

  &:hover{
    background:#15803D;
  }
`;