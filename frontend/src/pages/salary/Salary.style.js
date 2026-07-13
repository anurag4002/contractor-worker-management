import styled from "styled-components";

export const SalaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const TitleSection = styled.div`
  h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: #0f172a;
  }

  p {
    margin-top: 0.5rem;
    color: #64748b;
    font-size: 0.95rem;
  }
`;

export const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const SearchBox = styled.div`
  width: 22rem;

  input {
    width: 100%;
    padding: 0.9rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    font-size: 0.95rem;
    outline: none;
    transition: 0.3s;

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  padding: 0.9rem 1.4rem;

  border: none;
  border-radius: 0.75rem;

  background: #2563eb;
  color: #ffffff;

  font-size: 0.95rem;
  font-weight: 600;

  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #1d4ed8;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;