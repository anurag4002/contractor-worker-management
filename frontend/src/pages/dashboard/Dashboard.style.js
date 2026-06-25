import styled from "styled-components";
import { COLORS } from "../../constants/Colors";

export const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const HeroSection = styled.div`
  background: linear-gradient(
    135deg,
    rgba(20,184,166,1),
    rgba(13,148,136,1)
  );

  border-radius: 24px;

  padding: 2rem;

  color: white;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  opacity: 0.9;
`;

export const StatsGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(250px, 1fr));

  gap: 1.5rem;
`;

export const StatCard = styled.div`
  background: white;

  border-radius: 20px;

  padding: 1.5rem;

  border: 1px solid ${COLORS.border};

  box-shadow:
    0 8px 24px rgba(15,23,42,.06);

  transition: 0.3s;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const CardIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.p`
  color: ${COLORS.text};
`;

export const CardValue = styled.h2`
  margin-top: 0.5rem;
  color: ${COLORS.heading};
`;

export const BottomGrid = styled.div`
  display: grid;

  grid-template-columns: 2fr 1fr;

  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const AttendanceCard = styled.div`
  background: white;

  border-radius: 20px;

  padding: 2rem;

  border: 1px solid ${COLORS.border};
`;

export const ChartPlaceholder = styled.div`
  height: 250px;

  margin-top: 1rem;

  border-radius: 16px;

  background: linear-gradient(
    180deg,
    rgba(20,184,166,.15),
    rgba(20,184,166,.03)
  );
`;

export const ActivityCard = styled.div`
  background: white;

  border-radius: 20px;

  padding: 2rem;

  border: 1px solid ${COLORS.border};
`;

export const ActivityItem = styled.div`
  padding: 1rem 0;

  border-bottom:
    1px solid ${COLORS.border};

  &:last-child {
    border-bottom: none;
  }
`;