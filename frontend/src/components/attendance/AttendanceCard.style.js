import styled from "styled-components";

export const Card = styled.div`
  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);

  transition: 0.3s;

  &:hover {
    transform: translateY(-3px);

    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  }
`;

export const Top = styled.div`
  display: flex;

  justify-content: flex-start;

  margin-bottom: 1rem;
`;

export const IconBox = styled.div`
  width: 3rem;

  height: 3rem;

  border-radius: 0.75rem;

  background: ${({ color }) => color};

  display: flex;

  justify-content: center;

  align-items: center;

  color: #ffffff;

  font-size: 1.3rem;
`;

export const Title = styled.h4`
  margin: 0;

  color: #64748b;

  font-size: 0.95rem;

  font-weight: 500;
`;

export const Value = styled.h2`
  margin-top: 0.6rem;

  color: #0f172a;

  font-size: 2rem;

  font-weight: 700;
`;