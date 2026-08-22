import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.45);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:999;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
    align-items: flex-end;
  }
`;

export const Modal = styled.div`
  width:100%;
  max-width:60rem;
  background:var(--surface);
  border-radius:1rem;
  overflow:hidden;
  box-shadow:0 20px 60px rgba(15,23,42,.18);
  max-height: calc(100dvh - 2rem);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-height: calc(100dvh - 1.5rem);
    border-radius: .75rem;
  }
`;

export const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:1.5rem;
  border-bottom:1px solid var(--border);
`;

export const Title = styled.h3`
  margin:0;
  color:var(--text);
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
  background:var(--table-header-bg);
  border:1px solid var(--border);
  border-radius:1rem;
  padding:1.2rem;
  text-align:center;

  h4{
    margin:0;
    color:var(--text-secondary);
    font-size:.95rem;
  }

  span{
    display:block;
    margin-top:.5rem;
    font-size:2rem;
    font-weight:700;
    color:var(--text);
  }
`;

export const Table = styled.table`
  width:100%;
  border-collapse:collapse;

  thead{
    background:var(--table-header-bg);
  }

  th{
    padding:1rem;
    text-align:left;
    color:var(--text);
    border-bottom:1px solid var(--border);
  }

  td{
    padding:1rem;
    border-bottom:1px solid var(--surface-hover);
    color:var(--text);
  }

  tbody tr:hover{
    background:var(--table-header-bg);
  }
`;

export const Footer = styled.div`
  display:flex;
  justify-content:flex-end;
  padding:1.5rem;
  border-top:1px solid var(--border);
`;

export const Button = styled.button`
  border:none;
  background:var(--primary);
  color:var(--surface);
  padding:.9rem 1.6rem;
  border-radius:.75rem;
  cursor:pointer;

  &:hover{
    background:var(--primary-hover);
  }
`;