import styled from "styled-components";

export const Card = styled.div`
  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 0.25rem 0.75rem
    rgba(15, 23, 42, 0.05);
`;

export const Title = styled.h3`
  margin: 0 0 1.5rem;

  color: var(--text);

  font-size: 1.1rem;

  font-weight: 700;
`;