import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: var(--bg);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 32rem;
  background: var(--surface);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
`;

export const Title = styled.h2`
  margin: 0;
  text-align: center;
  color: var(--text);
  font-size: 2rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  margin: 0.75rem 0 2rem;
  text-align: center;
  color: var(--text-secondary);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Icon = styled.div`
  position: absolute;
  left: 1rem;
  color: var(--text-secondary);
  font-size: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.95rem 3rem 0.95rem 2.9rem;
  border: 1px solid var(--input-border);
  border-radius: 0.8rem;
  outline: none;
  font-size: 0.95rem;
  transition: 0.25s;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    background: var(--bg);
    cursor: not-allowed;
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;

  &:hover {
    color: var(--primary);
  }
`;

export const ErrorText = styled.span`
  margin-top: -0.5rem;
  margin-bottom: 0.25rem;
  color: var(--danger);
  font-size: 0.8rem;
  font-weight: 500;
`;

export const SaveButton = styled.button`
  width: 100%;
  border: none;
  background: var(--primary);
  color: var(--surface);
  padding: 1rem;
  border-radius: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: var(--primary-hover);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;