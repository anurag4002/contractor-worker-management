import styled from "styled-components";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  padding: 1rem;

  background: var(--surface);

  border: 1px solid var(--border);

  border-radius: 0.75rem;

  transition: all 0.3s ease;

  cursor: pointer;

  &:hover {
    background: var(--bg);
    border-color: var(--primary);
  }
`;

export const Title = styled.h4`
  margin: 0;

  font-size: 1rem;

  font-weight: 600;

  color: var(--text);
`;

export const Time = styled.p`
  margin: 0;

  font-size: 0.875rem;

  color: var(--text-secondary);
`;