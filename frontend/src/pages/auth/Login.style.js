import styled from "styled-components";

export const LoginContainer = styled.div`
  min-height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 2rem;

  background: linear-gradient(
    135deg,
    #eff6ff 0%,
    #dbeafe 100%
  );
`;

export const LoginCard = styled.div`
  width: 100%;

  max-width: 28rem;

  background: #ffffff;

  border-radius: 1.25rem;

  padding: 2.5rem;

  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);

  border: 1px solid #e2e8f0;
`;

export const Logo = styled.div`
  width: 4.5rem;

  height: 4.5rem;

  margin: 0 auto 1.5rem;

  border-radius: 1rem;

  background: #2563eb;

  color: #ffffff;

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 2rem;

  font-weight: 700;
`;

export const Title = styled.h1`
  margin: 0;

  text-align: center;

  color: #0f172a;

  font-size: 1.8rem;

  font-weight: 700;
`;

export const Subtitle = styled.p`
  margin: 0.75rem 0 2rem;

  text-align: center;

  color: #64748b;

  font-size: 0.95rem;

  line-height: 1.5;
`;

export const Form = styled.form`
  display: flex;

  flex-direction: column;

  gap: 1.25rem;
`;

export const FormGroup = styled.div`
  display: flex;

  flex-direction: column;

  gap: 0.5rem;
`;

export const Label = styled.label`
  color: #334155;

  font-size: 0.9rem;

  font-weight: 600;
`;

export const InputWrapper = styled.div`
  position: relative;

  display: flex;

  align-items: center;
`;

export const Input = styled.input`
  width: 100%;

  padding: 0.95rem 1rem;

  border: 1px solid #cbd5e1;

  border-radius: 0.75rem;

  font-size: 0.95rem;

  outline: none;

  transition: 0.25s;

  &:focus {
    border-color: #2563eb;

    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`;

export const PasswordButton = styled.button`
  position: absolute;

  right: 1rem;

  border: none;

  background: transparent;

  color: #64748b;

  cursor: pointer;

  font-size: 1rem;
`;

export const Options = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  font-size: 0.9rem;

  margin-top: -0.25rem;
`;

export const Remember = styled.label`
  display: flex;

  align-items: center;

  gap: 0.5rem;

  color: #475569;

  cursor: pointer;
`;

export const ForgotLink = styled.button`
  border: none;

  background: transparent;

  color: #2563eb;

  cursor: pointer;

  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export const LoginButton = styled.button`
  border: none;

  background: #2563eb;

  color: #ffffff;

  padding: 1rem;

  border-radius: 0.75rem;

  font-size: 1rem;

  font-weight: 600;

  cursor: pointer;

  transition: 0.25s;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    background: #94a3b8;

    cursor: not-allowed;
  }
`;

export const Footer = styled.div`
  margin-top: 2rem;

  text-align: center;

  color: #64748b;

  font-size: 0.9rem;
`;

export const ContactText = styled.span`
  color: #2563eb;

  font-weight: 600;
`;

export const ErrorMessage = styled.span`
  color: #dc2626;

  font-size: 0.85rem;
`;