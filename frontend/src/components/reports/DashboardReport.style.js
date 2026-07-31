import styled from "styled-components";

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

export const StatCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px var(--shadow);
`;

export const IconWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 0.65rem;
  background: ${({ $color }) => `${$color}1a`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
`;

export const StatLabel = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

export const StatValue = styled.h3`
  margin: 0.2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
`;

export const ActivitiesCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
`;

export const ActivitiesTitle = styled.h4`
  margin: 0 0 1rem;
  color: var(--text);
`;

export const ActivitiesPre = styled.pre`
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  overflow-x: auto;
`;