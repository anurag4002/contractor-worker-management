import styled from "styled-components";

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 0.25rem 0.75rem
    rgba(15, 23, 42, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const HeaderLeft = styled.div`
  h2 {
    margin: 0;
    color: #0f172a;
    font-size: 2rem;
    font-weight: 700;
  }

  p {
    margin: 0.5rem 0 0;
    color: #64748b;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-weight: 500;
  flex-wrap: wrap;
`;

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: #2563eb;
  color: #ffffff;
  padding: 0.85rem 1.4rem;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px
      rgba(37, 99, 235, 0.25);
  }

  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.25);
    outline-offset: 2px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.75rem
    rgba(15, 23, 42, 0.05);
`;

export const SectionTitle = styled.h3`
  margin: 0 0 1.5rem;
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 700;
`;

export const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  width: 100%;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.6rem;
  cursor: pointer;
  color: #0f172a;
  transition: 0.3s;

  &:hover {
    background: #2563eb;
    color: #ffffff;
    border-color: #2563eb;
    transform: translateY(-4px);
    box-shadow: 0 15px 30px
      rgba(37, 99, 235, 0.2);
  }

  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.25);
    outline-offset: 2px;
  }
`;

export const ActionIcon = styled.div`
  font-size: 2rem;
  line-height: 1;
`;

export const ActionTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  cursor: ${({ onClick }) =>
    onClick ? "pointer" : "default"};
  transition: 0.25s;

  &:hover {
    background: ${({ onClick }) =>
      onClick ? "#f1f5f9" : "transparent"};
  }
`;

export const Badge = styled.span`
  min-width: 2rem;
  padding: 0.35rem 0.8rem;
  text-align: center;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ success, danger, warning }) =>
    success
      ? "#dcfce7"
      : danger
      ? "#fee2e2"
      : warning
      ? "#fef3c7"
      : "#e2e8f0"};
  color: ${({ success, danger, warning }) =>
    success
      ? "#15803d"
      : danger
      ? "#dc2626"
      : warning
      ? "#b45309"
      : "#475569"};
`;
