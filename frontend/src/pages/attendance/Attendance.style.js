import styled from "styled-components";

export const AttendanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TitleSection = styled.div`
  h2 {
    margin: 0;
    font-size: clamp(1.25rem, 2.5vw, 2rem);
    color: var(--text);
    font-weight: 700;
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
`;

export const Button = styled.button`
  border: none;
  outline: none;
  cursor: pointer;

  padding: 0.9rem 1.6rem;

  border-radius: 0.8rem;

  background: var(--primary);
  color: var(--text);

  font-size: 0.95rem;
  font-weight: 600;

  transition: 0.3s;

  &:hover {
    background: var(--primary-hover);
  }
`;

export const Section = styled.section`
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--text);
  }

  p {
    margin-top: 0.35rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const EmptyState = styled.div`
  padding: 3rem;

  text-align: center;

  color: var(--text-secondary);

  border: 2px dashed var(--input-border);

  border-radius: 1rem;

  background: var(--bg);
`;