import styled from "styled-components";

export const PayrollContainer = styled.div`
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TitleSection = styled.div`
  h2 { margin: 0; font-size: 2rem; font-weight: 700; color: #0f172a; }
  p { margin-top: 0.5rem; color: #64748b; font-size: 0.95rem; }
`;

export const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.4rem;
  border: none;
  border-radius: 0.8rem;
  background: #2563eb;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
  &:hover { background: #1d4ed8; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
