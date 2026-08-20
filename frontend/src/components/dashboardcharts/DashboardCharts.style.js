import styled from "styled-components";

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 22rem), 1fr)
  );
  gap: 1rem;
  margin-top: 1rem;
`;

export const ChartCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
  min-width: 0;
`;

export const ChartTitle = styled.h3`
  margin: 0 0 1rem;
  color: var(--text);
  font-size: 1rem;
  font-weight: 700;

  @media (max-width: 640px) {
    font-size: 0.95rem;
  }
`;