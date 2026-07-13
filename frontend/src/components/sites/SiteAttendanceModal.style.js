import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.45);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:999;
`;

export const Modal = styled.div`
  width:100%;
  max-width:60rem;
  background:#ffffff;
  border-radius:1rem;
  overflow:hidden;
  box-shadow:0 20px 60px rgba(15,23,42,.18);
`;

export const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:1.5rem;
  border-bottom:1px solid #E2E8F0;
`;

export const Title = styled.h3`
  margin:0;
  color:#0F172A;
`;

export const CloseButton = styled.button`
  border:none;
  background:none;
  font-size:1.6rem;
  cursor:pointer;
`;

export const Summary = styled.div`
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1rem;
  padding:1.5rem;

  @media(max-width:768px){
    grid-template-columns:1fr;
  }
`;

export const SummaryCard = styled.div`
  background:#F8FAFC;
  border:1px solid #E2E8F0;
  border-radius:1rem;
  padding:1.2rem;
  text-align:center;

  h4{
    margin:0;
    color:#64748B;
    font-size:.95rem;
  }

  span{
    display:block;
    margin-top:.5rem;
    font-size:2rem;
    font-weight:700;
    color:#0F172A;
  }
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
    border-bottom:1px solid #E2E8F0;
  }

  td{
    padding:1rem;
    border-bottom:1px solid #F1F5F9;
    color:#334155;
  }

  tbody tr:hover{
    background:#F8FAFC;
  }
`;

export const Footer = styled.div`
  display:flex;
  justify-content:flex-end;
  padding:1.5rem;
  border-top:1px solid #E2E8F0;
`;

export const Button = styled.button`
  border:none;
  background:#2563EB;
  color:#ffffff;
  padding:.9rem 1.6rem;
  border-radius:.75rem;
  cursor:pointer;

  &:hover{
    background:#1D4ED8;
  }
`;