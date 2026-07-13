import styled from "styled-components";

export const ReportsContainer = styled.div`
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
  gap: 1rem;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: .5rem;

  border: none;

  background: #2563eb;

  color: #ffffff;

  padding: .9rem 1.4rem;

  border-radius: .8rem;

  cursor: pointer;

  font-weight: 600;

  transition: .25s;

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

  box-shadow: 0 8px 24px rgba(15, 23, 42, .05);
`;