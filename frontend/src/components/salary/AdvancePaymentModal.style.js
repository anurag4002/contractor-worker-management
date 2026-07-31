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

  border-bottom: 1px solid var(--border);

  position: sticky;
  top: 0;

  background: #fff;

  z-index: 10;
`;

export const Title = styled.h3`
  margin: 0;

  color: var(--text);

  font-size: 1.2rem;

  font-weight: 700;
`;

export const CloseButton = styled.button`
  border: none;
  background: none;

  cursor: pointer;

  font-size: 1.5rem;

  color: var(--text-secondary);

  &:hover {
    color: var(--danger);
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

  color: var(--text);
`;

const Field = `
  width:100%;
  padding:.9rem 1rem;
  border:1px solid var(--input-border);
  border-radius:.75rem;
  outline:none;
  font-size:.95rem;
  box-sizing:border-box;

  &:focus{
    border-color:var(--primary);
    box-shadow:0 0 0 3px rgba(37,99,235,.12);
  }

  &:disabled{
    background:var(--table-header-bg);
    color:var(--text);
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

  border-top: 1px solid var(--border);
`;

export const CancelButton = styled.button`
  border: none;

  background: var(--border);

  color: var(--text);

  padding: .85rem 1.5rem;

  border-radius: .75rem;

  cursor: pointer;

  font-weight: 600;
`;

export const SaveButton = styled.button`
  border: none;

  background: var(--primary);

  color: #fff;

  padding: .85rem 1.6rem;

  border-radius: .75rem;

  cursor: pointer;

  font-weight: 600;

  &:hover{
    background:var(--primary-hover);
  }
`;