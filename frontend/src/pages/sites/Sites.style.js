import styled from "styled-components";

export const SitesContainer = styled.div`
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
    color: var(--text);
  }

  p {
    margin-top: 0.5rem;
    color: var(--text-secondary);
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
    border: 1px solid var(--input-border);
    border-radius: 0.8rem;
    outline: none;
    font-size: 0.95rem;
    transition: 0.3s;

    &:focus {
      border-color: var(--primary);
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
  border-radius: 0.8rem;

  background: var(--primary);
  color: var(--surface);

  font-size: 0.95rem;
  font-weight: 600;

  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: var(--primary-hover);
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Card = styled.div`
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;