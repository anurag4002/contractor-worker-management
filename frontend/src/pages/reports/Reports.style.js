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
    font-size: clamp(1.25rem, 2.5vw, 2rem);
    font-weight: 700;
    color: var(--text);
  }

  p {
    margin-top: 0.5rem;
    color: var(--text-secondary);
    font-size: clamp(0.8rem, 1.5vw, 0.95rem);
  }
`;

export const ActionSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: .5rem;

  border: none;

  background: var(--primary);

  color: var(--surface);

  padding: .9rem 1.4rem;

  border-radius: .8rem;

  cursor: pointer;

  font-weight: 600;

  transition: .25s;

  &:hover {
    background: var(--primary-hover);
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

export const Card = styled.div`
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 1rem;

  padding: var(--content-padding);

  box-shadow: 0 8px 24px rgba(15, 23, 42, .05);

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 0.75rem;
  }
`;