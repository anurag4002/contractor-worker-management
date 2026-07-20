import styled from "styled-components";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 12rem;

  padding: 1.5rem;

  background: #ffffff;

  border: 1px solid #e2e8f0;
  border-radius: 1rem;

  box-shadow: 0 0.25rem 0.75rem
    rgba(15, 23, 42, 0.05);

  transition: all 0.3s ease;

  cursor: ${({ onClick }) =>
    (onClick ? "pointer" : "default")};

  &:hover {
    transform: translateY(-0.35rem);

    border-color: #2563eb;

    box-shadow: 0 1rem 2rem
      rgba(37, 99, 235, 0.15);
  }

  @media (max-width: 768px) {
    min-height: auto;

    padding: 1.25rem;
  }
`;

export const Top = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 1rem;
`;

export const IconBox = styled.div`
  width: 3.25rem;

  height: 3.25rem;

  border-radius: 0.9rem;

  display: flex;

  align-items: center;

  justify-content: center;

  background: ${({ color }) => color};

  transition: all 0.3s ease;

  svg {
    color: #ffffff;

    font-size: 1.5rem;
  }

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

export const Badge = styled.div`
  min-width: 3rem;

  padding: 0.35rem 0.8rem;

  border-radius: 999px;

  background: #dcfce7;

  color: #15803d;

  font-size: 0.75rem;

  font-weight: 700;

  text-align: center;
`;

export const Title = styled.p`
  margin: 0;

  color: #64748b;

  font-size: 0.95rem;

  font-weight: 500;
`;

export const Value = styled.h2`
  margin: 0.6rem 0;

  color: #0f172a;

  font-size: 2rem;

  font-weight: 700;

  line-height: 1.2;

  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.65rem;
  }
`;

export const Bottom = styled.div`
  display: flex;

  flex-direction: column;

  gap: 0.75rem;

  margin-top: auto;
`;

export const Description = styled.p`
  margin: 0;

  color: #94a3b8;

  font-size: 0.85rem;

  line-height: 1.5;
`;

export const Progress = styled.div`
  width: 100%;

  height: 0.45rem;

  background: #e2e8f0;

  border-radius: 999px;

  overflow: hidden;
`;

export const ProgressFill = styled.div`
  width: ${({ width }) => width || "100%"};

  height: 100%;

  background: linear-gradient(
    90deg,
    #2563eb,
    #3b82f6
  );

  border-radius: inherit;

  transition: width 0.4s ease;
`;