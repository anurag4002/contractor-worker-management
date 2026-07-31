import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary), #1e3a8a);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 28rem;
  background: var(--surface);
  border-radius: 1.25rem;
  padding: 2.5rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);

  animation: popup 0.3s ease;

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
`;

export const Title = styled.h2`
  margin: 0;
  text-align: center;
  color: var(--text);
  font-size: 2rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  margin: 1rem 0 2rem;
  text-align: center;
  color: var(--text-secondary);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 3rem;
  border: 1px solid var(--input-border);
  border-radius: 0.8rem;
  outline: none;
  font-size: 0.95rem;
  transition: 0.25s;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
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
  font-size: 1rem;

  &:hover {
    color: var(--primary);
  }
`;

export const PasswordStrength = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ color }) => color};
`;

export const ErrorMessage = styled.div`
  padding: 0.85rem;
  border-radius: 0.75rem;
  background: var(--badge-danger-bg);
  color: var(--danger);
  font-size: 0.9rem;
  font-weight: 500;
`;

export const Button = styled.button`
  width: 100%;
  border: none;
  background: var(--primary);
  color: var(--surface);
  padding: 1rem;
  border-radius: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: var(--primary-hover);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
  }

  a:hover {
    text-decoration: underline;
  }
`;