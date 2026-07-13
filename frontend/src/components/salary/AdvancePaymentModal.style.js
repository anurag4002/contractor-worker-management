import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(15, 23, 42, 0.45);

  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 2rem;

  overflow-y: auto;

  z-index: 9999;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 38rem;

  margin: auto;

  background: #fff;

  border-radius: 1rem;

  max-height: calc(100vh - 4rem);

  overflow-y: auto;

  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.18);

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: calc(100vh - 2rem);
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.3rem 1.5rem;

  border-bottom: 1px solid #E2E8F0;

  position: sticky;
  top: 0;

  background: #fff;

  z-index: 10;
`;

export const Title = styled.h3`
  margin: 0;

  color: #0F172A;

  font-size: 1.2rem;

  font-weight: 700;
`;

export const CloseButton = styled.button`
  border: none;
  background: none;

  cursor: pointer;

  font-size: 1.5rem;

  color: #64748B;

  &:hover {
    color: #DC2626;
  }
`;

export const Form = styled.form`
  padding: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  gap: .5rem;

  margin-bottom: 1.2rem;
`;

export const Label = styled.label`
  font-weight: 600;

  color: #334155;
`;

const Field = `
  width:100%;
  padding:.9rem 1rem;
  border:1px solid #CBD5E1;
  border-radius:.75rem;
  outline:none;
  font-size:.95rem;
  box-sizing:border-box;

  &:focus{
    border-color:#2563EB;
    box-shadow:0 0 0 3px rgba(37,99,235,.12);
  }

  &:disabled{
    background:#F8FAFC;
    color:#475569;
  }
`;

export const Input = styled.input`
  ${Field}
`;

export const Select = styled.select`
  ${Field}
`;

export const TextArea = styled.textarea`
  ${Field}

  resize: vertical;

  min-height: 7rem;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  gap: 1rem;

  margin-top: 2rem;

  position: sticky;
  bottom: 0;

  background: #fff;

  padding-top: 1rem;

  border-top: 1px solid #E2E8F0;
`;

export const CancelButton = styled.button`
  border: none;

  background: #E2E8F0;

  color: #334155;

  padding: .85rem 1.5rem;

  border-radius: .75rem;

  cursor: pointer;

  font-weight: 600;
`;

export const SaveButton = styled.button`
  border: none;

  background: #2563EB;

  color: #fff;

  padding: .85rem 1.6rem;

  border-radius: .75rem;

  cursor: pointer;

  font-weight: 600;

  &:hover{
    background:#1D4ED8;
  }
`;