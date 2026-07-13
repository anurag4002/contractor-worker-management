import styled from "styled-components";

export const Card = styled.div`
  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 1.25rem;

  padding: 1.5rem;

  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);

  transition: all 0.3s ease;

  cursor: pointer;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  min-height: 12rem;

  &:hover {
    transform: translateY(-0.35rem);

    border-color: #2563eb;

    box-shadow: 0 18px 36px rgba(37, 99, 235, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1.2rem;

    min-height: auto;
  }
`;

export const Top = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 1.25rem;
`;

export const IconBox = styled.div`
  width: 3.5rem;

  height: 3.5rem;

  border-radius: 1rem;

  background: ${({ color }) => color || "#2563EB"};

  display: flex;

  justify-content: center;

  align-items: center;

  flex-shrink: 0;

  transition: all 0.3s ease;

  svg {
    color: #ffffff;

    font-size: 1.6rem;
  }

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

export const Badge = styled.div`
  min-width: 3.4rem;

  padding: 0.35rem 0.85rem;

  border-radius: 999px;

  background: #dcfce7;

  color: #15803d;

  font-size: 0.75rem;

  font-weight: 700;

  text-align: center;

  white-space: nowrap;
`;

export const Title = styled.h4`
  margin: 0;

  color: #64748b;

  font-size: 0.95rem;

  font-weight: 500;
`;

export const Value = styled.h2`
  margin: 0.6rem 0 0;

  color: #0f172a;

  font-size: 2rem;

  font-weight: 700;

  line-height: 1.2;

  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

export const Bottom = styled.div`
  margin-top: auto;

  padding-top: 1.2rem;

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 1rem;
`;

export const Description = styled.p`
  margin: 0;

  color: #94a3b8;

  font-size: 0.85rem;

  line-height: 1.5;

  flex: 1;
`;

export const Progress = styled.div`
  width: 4.5rem;

  height: 0.45rem;

  border-radius: 999px;

  background: #e2e8f0;

  overflow: hidden;

  flex-shrink: 0;
`;

export const ProgressFill = styled.div`
  width: ${({ width }) => width || "0%"};

  height: 100%;

  background: linear-gradient(
    90deg,
    #2563eb,
    #3b82f6
  );

  border-radius: inherit;

  transition: width 0.4s ease;
`;