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
  max-width:55rem;

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
  color:var(--text-secondary);
  font-size:.9rem;
`;

export const Value = styled.span`
  color:var(--text);
  font-size:1rem;
  font-weight:600;
`;

export const Footer = styled.div`
  display:flex;
  justify-content:flex-end;
  gap:1rem;
  flex-wrap:wrap;

  padding:1.5rem;

  border-top:1px solid var(--border);
`;

export const Button = styled.button`
  display:flex;
  align-items:center;
  gap:.5rem;

  border:none;

  background:var(--primary);

  color:white;

  padding:.9rem 1.5rem;

  border-radius:.75rem;

  cursor:pointer;

  font-weight:600;

  transition:.25s;

  &:hover{
    background:var(--primary-hover);
  }
`;