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
  background:var(--surface);
  border-radius:1rem;
  overflow:hidden;
  box-shadow:0 20px 60px rgba(15,23,42,.18);
`;

export const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:1.4rem 1.6rem;
  border-bottom:1px solid var(--border);
`;

export const Title = styled.h3`
  margin:0;
  color:var(--text);
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
    color:var(--text);
    border-bottom:1px solid var(--surface-hover);
  }

  tbody tr:hover{
    background:var(--table-header-bg);
  }
`;

export const EmptyState = styled.div`
  padding:3rem;
  text-align:center;
  color:var(--text-secondary);
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
  padding:.85rem 1.5rem;
  border-radius:.75rem;
  cursor:pointer;

  &:hover{
    background:var(--primary-hover);
  }
`;