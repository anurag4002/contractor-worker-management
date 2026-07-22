import styled from "styled-components";

export const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  padding: 2rem;
`;

export const RegisterCard = styled.div`
  width: 100%;
  max-width: 34rem;
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 3rem;
  box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.15);
`;

export const Logo = styled.div`
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1.5rem;
  border-radius: 1rem;
  background: #2563eb;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  font-weight: 700;
`;

export const Heading = styled.h1`
  text-align: center;
  color: #0f172a;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
`;

export const SubHeading = styled.p`
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
  display: flex;
  align-items: center;
  border: 1px solid #dbe3ef;
  border-radius: 0.9rem;
  height: 3.6rem;
  padding: 0 1rem;
  background: #fff;

  &:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  svg {
    color: #64748b;
  }

  span {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 0.8rem;
  font-size: 1rem;
`;

export const Select = styled.select`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 0.8rem;
  font-size: 1rem;
  appearance: none;
`;

export const RegisterButton = styled.button`
  margin-top: 0.8rem;
  height: 3.5rem;
  border: none;
  border-radius: 0.9rem;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: #1d4ed8;
  }
`;

export const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.95rem;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.3rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin: -0.4rem 0 0.2rem;
`;

export const SuccessText = styled.p`
  color: #16a34a;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
`;