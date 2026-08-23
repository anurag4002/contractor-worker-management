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
  grid-template-columns:repeat(5,1fr);
  gap:0.75rem;
  padding:1.5rem;

  @media(max-width:768px){
    grid-template-columns:repeat(2,1fr);
  }
`;

export const SummaryCard = styled.div`
  background:var(--table-header-bg);
  border:1px solid var(--border);
  border-radius:1rem;
  padding:1rem;
  text-align:center;

  h4{
    margin:0;
    color:var(--text-secondary);
    font-size:.8rem;
  }

  span{
    display:block;
    margin-top:.4rem;
    font-size:1.6rem;
    font-weight:700;
    color:var(--text);
  }
`;

export const Controls = styled.div`
  display:flex;
  align-items:flex-end;
  gap:1.25rem;
  flex-wrap:wrap;
  padding:0 1.5rem;

  @media (max-width: 768px) {
    flex-direction:column;
    align-items:stretch;
    gap:1rem;
  }
`;

export const Field = styled.div`
  display:flex;
  flex-direction:column;
  gap:0.4rem;

  label{
    font-size:0.8rem;
    font-weight:600;
    color:var(--text-secondary);
  }

  @media (max-width: 768px) {
    width:100%;
  }
`;

export const Input = styled.input`
  width:100%;
  padding:0.7rem 0.9rem;
  border:1px solid var(--input-border);
  border-radius:0.7rem;
  outline:none;
  font-size:0.95rem;
  background:var(--surface);
  color:var(--text);
  transition:0.3s;

  &:focus{
    border-color:var(--primary);
    box-shadow:0 0 0 3px rgba(37,99,235,0.1);
  }
`;

export const SearchInput = styled.input`
  width:100%;
  min-width:16rem;
  padding:0.7rem 0.9rem;
  border:1px solid var(--input-border);
  border-radius:0.7rem;
  outline:none;
  font-size:0.95rem;
  background:var(--surface);
  color:var(--text);
  transition:0.3s;

  &:focus{
    border-color:var(--primary);
    box-shadow:0 0 0 3px rgba(37,99,235,0.1);
  }

  @media (max-width: 768px) {
    min-width:0;
  }
`;

export const WorkerList = styled.div`
  display:flex;
  flex-direction:column;
  gap:0.75rem;
  padding:1.5rem;
  overflow-y:auto;
`;

export const WorkerCard = styled.div`
  display:grid;
  grid-template-columns:1.6fr 1fr 1fr 2.4fr;
  gap:1rem;
  align-items:center;
  padding:0.9rem 1rem;
  border:1px solid var(--border);
  border-radius:0.8rem;
  background:var(--surface);

  @media (max-width: 768px) {
    grid-template-columns:1fr;
    gap:0.6rem;
  }
`;

export const WorkerIdentity = styled.div`
  display:flex;
  flex-direction:column;

  strong{
    color:var(--text);
    font-size:0.95rem;
  }

  span{
    color:var(--text-secondary);
    font-size:0.8rem;
  }
`;

export const MetaCell = styled.div`
  color:var(--text);
  font-size:0.9rem;

  @media (max-width: 768px) {
    display:flex;
    justify-content:space-between;
    gap:1rem;

    &::before{
      content:attr(data-label);
      color:var(--text-secondary);
      font-size:0.78rem;
      font-weight:600;
    }
  }
`;

export const StatusGroup = styled.div`
  display:flex;
  flex-wrap:wrap;
  gap:0.4rem;
`;

export const StatusPill = styled.button`
  padding:0.5rem 0.85rem;
  min-height:40px;
  border-radius:0.6rem;
  border:1px solid ${({ $selected }) => ($selected ? "transparent" : "var(--border)")};
  background:${({ $selected, $color }) => ($selected ? $color : "var(--surface)")};
  color:${({ $selected }) => ($selected ? "#fff" : "var(--text)")};
  font-size:0.82rem;
  font-weight:600;
  cursor:pointer;
  transition:0.2s;

  &:hover{
    border-color:${({ $color }) => $color};
  }
`;

export const Footer = styled.div`
  display:flex;
  justify-content:flex-end;
  gap:1rem;
  padding:1.5rem;
  border-top:1px solid var(--border);
  flex-wrap:wrap;

  @media (max-width: 768px) {
    flex-direction:column-reverse;
  }
`;

export const Button = styled.button`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:0.5rem;

  border:none;
  border-radius:0.75rem;
  padding:0.9rem 1.6rem;
  cursor:pointer;
  font-size:0.95rem;
  font-weight:600;
  transition:0.25s;

  ${({ $primary }) =>
    $primary
      ? `
    background:var(--primary);
    color:var(--surface);

    &:hover{
      background:var(--primary-hover);
    }
  `
      : `
    background:var(--surface);
    color:var(--text);
    border:1px solid var(--border);

    &:hover{
      border-color:var(--primary);
      color:var(--primary);
    }
  `}

  &:disabled{
    opacity:0.6;
    cursor:not-allowed;
  }

  @media (max-width: 768px) {
    width:100%;
  }
`;

export const EmptyState = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:1rem;
  text-align:center;
  padding:2.5rem 1.5rem;

  p{
    margin:0;
    color:var(--text-secondary);
  }
`;

export const Message = styled.div`
  padding:2.5rem 1.5rem;
  text-align:center;
  color:var(--text-secondary);
`;
