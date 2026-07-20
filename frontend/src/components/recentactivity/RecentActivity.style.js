import styled from "styled-components";

export const Container = styled.div`
  display: grid;

  grid-template-columns: repeat(
    auto-fit,
    minmax(22rem, 1fr)
  );

  gap: 1.5rem;

  margin-top: 1.5rem;
`;

export const Section = styled.div`
  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 0.25rem 0.75rem
    rgba(15, 23, 42, 0.05);
`;

export const Title = styled.h3`
  margin: 0 0 1rem;

  font-size: 1.1rem;

  color: #0f172a;
`;

export const List = styled.div`
  display: flex;

  flex-direction: column;

  gap: 0.75rem;
`;

export const Item = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 1rem;

  border-radius: 0.75rem;

  border: 1px solid #e2e8f0;

  cursor: pointer;

  transition: 0.25s;

  &:hover {
    background: #eff6ff;

    border-color: #2563eb;
  }
`;

export const Primary = styled.div`
  font-weight: 600;

  color: #0f172a;
`;

export const Secondary = styled.div`
  margin-top: 0.25rem;

  font-size: 0.85rem;

  color: #64748b;
`;

export const Status = styled.span`
  padding: 0.35rem 0.8rem;

  border-radius: 999px;

  background: #dbeafe;

  color: #2563eb;

  font-size: 0.75rem;

  font-weight: 600;
`;

export const Empty = styled.div`
  padding: 2rem 1rem;

  text-align: center;

  color: #94a3b8;
`;