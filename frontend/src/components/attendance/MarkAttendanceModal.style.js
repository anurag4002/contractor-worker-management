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
  max-width: 40rem;

  margin: auto;

  background: var(--surface);

  border-radius: 1rem;

  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);

  max-height: calc(100vh - 4rem);

  overflow-y: auto;

  animation: popup .25s ease;

  @keyframes popup {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width:768px) {
    max-width: 100%;
    max-height: calc(100vh - 2rem);
    border-radius: .75rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.25rem 1.5rem;

  border-bottom: 1px solid var(--border);

  position: sticky;
  top: 0;

  background: var(--surface);

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

  font-size: 1.4rem;

  cursor: pointer;

  color: var(--text-secondary);

  transition: .25s;

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

export const Select = styled.select`
  width: 100%;

  padding: .9rem 1rem;

  border: 1px solid var(--input-border);

  border-radius: .75rem;

  outline: none;

  box-sizing: border-box;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37,99,235,.12);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;

  min-height: 8rem;

  padding: 1rem;

  border: 1px solid var(--input-border);

  border-radius: .75rem;

  resize: vertical;

  outline: none;

  box-sizing: border-box;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37,99,235,.12);
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  gap: 1rem;

  margin-top: 2rem;

  position: sticky;
  bottom: 0;

  background: var(--surface);

  padding-top: 1rem;

  border-top: 1px solid var(--border);
`;

export const CancelButton = styled.button`
  border: none;

  background: var(--border);

  color: var(--text);

  padding: .85rem 1.4rem;

  border-radius: .75rem;

  cursor: pointer;

  font-weight: 600;
`;

export const SaveButton = styled.button`
  border: none;

  background: var(--primary);

  color: var(--text-on-primary);

  padding: .85rem 1.5rem;

  border-radius: .75rem;

  cursor: pointer;

  font-weight: 600;

  transition: .25s;

  &:hover {
    background: var(--primary-hover);
  }
`;