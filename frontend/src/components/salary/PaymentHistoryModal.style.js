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
  padding:1.4rem 1.6rem;
  border-bottom:1px solid #E2E8F0;
`;

export const Title = styled.h3`
  margin:0;
  color:#0F172A;
`;

export const CloseButton = styled.button`
  border:none;
  background:none;
  cursor:pointer;
  font-size:1.5rem;
`;

export const Body = styled.div`
  padding:1.5rem;
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
    color:#334155;
    border-bottom:1px solid #F1F5F9;
  }

  tbody tr:hover{
    background:#F8FAFC;
  }
`;

export const EmptyState = styled.div`
  padding:3rem;
  text-align:center;
  color:#64748B;
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
  padding:.85rem 1.5rem;
  border-radius:.75rem;
  cursor:pointer;

  &:hover{
    background:#1D4ED8;
  }
`;