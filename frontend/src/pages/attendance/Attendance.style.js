import styled from "styled-components";

export const AttendanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TitleSection = styled.div`
  h2 {
    margin: 0;
    font-size: 2rem;
    color: #0f172a;
    font-weight: 700;
  }

  p {
    margin-top: 0.5rem;
    color: #64748b;
  }
`;

export const ActionSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  border: none;
  outline: none;
  cursor: pointer;

  padding: 0.9rem 1.6rem;

  border-radius: 0.8rem;

  background: #2563eb;
  color: #fff;

  font-size: 0.95rem;
  font-weight: 600;

  transition: 0.3s;

  &:hover {
    background: #1d4ed8;
  }
`;

export const Section = styled.section`
  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 1rem;

  padding: 1.5rem;

  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #0f172a;
  }

  p {
    margin-top: 0.35rem;
    color: #64748b;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const EmptyState = styled.div`
  padding: 3rem;

  text-align: center;

  color: #64748b;

  border: 2px dashed #cbd5e1;

  border-radius: 1rem;

  background: #f8fafc;
`;