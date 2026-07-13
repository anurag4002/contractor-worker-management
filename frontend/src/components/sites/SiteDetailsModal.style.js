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
  max-width:52rem;
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

export const Body = styled.div`
  padding:2rem;
`;

export const Grid = styled.div`
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:1.5rem;

  @media(max-width:768px){
    grid-template-columns:1fr;
  }
`;

export const Item = styled.div`
  display:flex;
  flex-direction:column;
  gap:.45rem;
`;

export const Label = styled.span`
  color:#64748B;
  font-size:.9rem;
`;

export const Value = styled.span`
  color:#0F172A;
  font-size:1rem;
  font-weight:600;
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
  color:#fff;
  padding:.9rem 1.6rem;
  border-radius:.75rem;
  cursor:pointer;

  &:hover{
    background:#1D4ED8;
  }
`;