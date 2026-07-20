import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: #f8fafc;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 40rem;
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
`;

export const Avatar = styled.div`
  width: 6rem;
  height: 6rem;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.h2`
  text-align: center;
  color: #0f172a;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const InputGroup = styled.div`
  position: relative;
`;

export const Icon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #64748b;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.95rem 1rem 0.95rem 3rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    background: #f8fafc;
    color: #475569;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.4rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
`;

export const PrimaryButton = styled(Button)`
  background: #2563eb;
  color: #ffffff;

  &:hover {
    background: #1d4ed8;
  }
`;

export const SecondaryButton = styled(Button)`
  background: #e2e8f0;
  color: #0f172a;

  &:hover {
    background: #cbd5e1;
  }
`;