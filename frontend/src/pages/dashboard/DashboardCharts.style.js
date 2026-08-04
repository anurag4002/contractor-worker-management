import styled from "styled-components";

export const ChartsGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(
    auto-fit,
    minmax(30rem, 1fr)
  );

  gap: 1.5rem;

  margin-top: 1.5rem;
`;

export const ChartCard = styled.div`
  background: var(--surface);

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 0.5rem 1.5rem
    rgba(15, 23, 42, 0.08);

  border: 1px solid var(--border);
`;

export const ChartTitle = styled.h3`
  margin-bottom: 1rem;

  font-size: 1rem;

  color: var(--text);

  font-weight: 600;
`;