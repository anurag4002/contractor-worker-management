import styled from "styled-components";

export const ChartsGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(
    auto-fit,
    minmax(24rem, 1fr)
  );

  gap: 1.5rem;

  margin-top: 1.5rem;
`;

export const ChartCard = styled.div`
  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 0.25rem 0.75rem
    rgba(15, 23, 42, 0.05);
`;

export const ChartTitle = styled.h3`
  margin: 0 0 1.5rem;

  color: #0f172a;

  font-size: 1.1rem;

  font-weight: 700;
`;