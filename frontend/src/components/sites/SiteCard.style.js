import styled from "styled-components";

export const Card = styled.div`
  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);

  transition: 0.25s;

  &:hover {
    transform: translateY(-4px);

    box-shadow: 0 16px 35px rgba(15, 23, 42, 0.08);
  }
`;

export const Top = styled.div`
  display: flex;

  justify-content: flex-start;

  margin-bottom: 1rem;
`;

export const IconBox = styled.div`
  width: 3.2rem;

  height: 3.2rem;

  border-radius: .9rem;

  background: ${({ color }) => color};

  display: flex;

  justify-content: center;

  align-items: center;

  color: #ffffff;

  font-size: 1.35rem;
`;

export const Title = styled.p`
  margin: 0;

  color: #64748B;

  font-size: .95rem;

  font-weight: 500;
`;

export const Value = styled.h2`
  margin-top: .6rem;

  color: #0F172A;

  font-size: 2rem;

  font-weight: 700;
`;