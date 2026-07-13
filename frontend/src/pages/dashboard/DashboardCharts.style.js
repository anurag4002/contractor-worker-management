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
  background: #fff;

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 0.5rem 1.5rem
    rgba(15, 23, 42, 0.08);

  border: 1px solid #e2e8f0;
`;

export const ChartTitle = styled.h3`
  margin-bottom: 1rem;

  font-size: 1rem;

  color: #0f172a;

  font-weight: 600;
`;