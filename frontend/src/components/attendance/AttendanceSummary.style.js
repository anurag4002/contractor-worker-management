import styled from "styled-components";

export const SummaryGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 1.5rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;