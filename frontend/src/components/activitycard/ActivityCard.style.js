import styled from "styled-components";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  padding: 1rem;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 0.75rem;

  transition: all 0.3s ease;

  cursor: pointer;

  &:hover {
    background: #f8fafc;
    border-color: #2563eb;
  }
`;

export const Title = styled.h4`
  margin: 0;

  font-size: 1rem;

  font-weight: 600;

  color: #111827;
`;

export const Time = styled.p`
  margin: 0;

  font-size: 0.875rem;

  color: #6b7280;
`;