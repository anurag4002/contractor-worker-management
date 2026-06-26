import styled from "styled-components";

export const Card = styled.div`
  background: #ffffff;

  border-radius: 1.25rem;

  padding: 1.5rem;

  border: 1px solid #e2e8f0;

  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.05);

  transition: all 0.35s ease;

  cursor: pointer;

  &:hover {
    transform: translateY(-6px);

    box-shadow: 0 18px 35px rgba(37, 99, 235, 0.15);
  }
`;

export const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const IconBox = styled.div`
  width: 3.5rem;
  height: 3.5rem;

  border-radius: 1rem;

  background: ${({ color }) => color};

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: white;
    font-size: 1.6rem;
  }
`;

export const Badge = styled.div`
  padding: .35rem .8rem;

  border-radius: 999px;

  background: #dcfce7;

  color: #15803d;

  font-size: .8rem;

  font-weight: 600;
`;

export const Title = styled.h4`
  margin: 1.2rem 0 .5rem;

  color: #64748b;

  font-size: .95rem;

  font-weight: 500;
`;

export const Value = styled.h2`
  margin: 0;

  color: #0f172a;

  font-size: 2rem;

  font-weight: 700;
`;

export const Bottom = styled.div`
  margin-top: 1rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Description = styled.p`
  margin: 0;

  color: #94a3b8;

  font-size: .85rem;
`;

export const Progress = styled.div`
  width: 4rem;
  height: .4rem;

  border-radius: 999px;

  background: #e2e8f0;

  overflow: hidden;
`;

export const ProgressFill = styled.div`
  width: ${({ width }) => width};

  height: 100%;

  background: #2563eb;
`;