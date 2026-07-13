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
  max-width:38rem;
  background:#ffffff;
  border-radius:1rem;
  overflow:hidden;
  box-shadow:0 20px 60px rgba(15,23,42,.18);
`;

export const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:1.4rem;
  border-bottom:1px solid #E2E8F0;
`;

export const Title = styled.h3`
  margin:0;
`;

export const CloseButton = styled.button`
  border:none;
  background:none;
  font-size:1.6rem;
  cursor:pointer;
`;

export const SearchInput = styled.input`
  width:calc(100% - 3rem);

  margin:1.5rem;

  padding:.9rem 1rem;

  border:1px solid #CBD5E1;

  border-radius:.75rem;

  outline:none;

  &:focus{

    border-color:#2563EB;

  }
`;

export const WorkerList = styled.div`
  max-height:20rem;

  overflow:auto;

  padding:0 1.5rem 1.5rem;
`;

export const WorkerItem = styled.div`
  padding:1rem 0;

  border-bottom:1px solid #F1F5F9;
`;

export const Checkbox = styled.label`
  display:flex;

  align-items:center;

  gap:.8rem;

  cursor:pointer;

  span{

    color:#334155;

    font-weight:500;

  }
`;

export const Footer = styled.div`
  display:flex;

  justify-content:flex-end;

  gap:1rem;

  padding:1.5rem;

  border-top:1px solid #E2E8F0;
`;

export const CancelButton = styled.button`
  border:none;

  background:#E2E8F0;

  color:#334155;

  padding:.85rem 1.5rem;

  border-radius:.75rem;

  cursor:pointer;
`;

export const SaveButton = styled.button`
  border:none;

  background:#2563EB;

  color:#ffffff;

  padding:.85rem 1.6rem;

  border-radius:.75rem;

  cursor:pointer;

  &:hover{

    background:#1D4ED8;

  }
`;