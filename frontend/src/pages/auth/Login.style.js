import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #2563eb, #1e40af);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 28rem;
  background: #ffffff;
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

export const Logo = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 1rem;
  background: #2563eb;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  font-size: 1.4rem;
  font-weight: 700;
`;

export const Title = styled.h2`
  margin: 1.5rem 0 0.4rem;
  text-align: center;
  color: #0f172a;
  font-size: 2rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  margin-bottom: 2rem;
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
  color: #64748b;
  font-size: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.95rem 3rem 0.95rem 2.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.8rem;
  outline: none;
  font-size: 0.95rem;
  transition: 0.25s;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

export const PasswordButton = styled.button`
  position: absolute;
  right: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;

  &:hover {
    color: #2563eb;
  }
`;

export const ErrorText = styled.span`
  margin-top: -0.5rem;
  margin-bottom: 0.25rem;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 500;
`;

export const Options = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: #475569;
  cursor: pointer;

  input {
    width: 1rem;
    height: 1rem;
    accent-color: #2563eb;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  border: none;
  background: #2563eb;
  color: #ffffff;
  padding: 1rem;
  border-radius: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const FooterText = styled.p`
  margin-top: 2rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.85rem;
`;