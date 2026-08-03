import styled, { keyframes } from "styled-components";

export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const SkeletonBlock = styled.div`
  background: linear-gradient(90deg, var(--surface-hover) 25%, var(--border) 50%, var(--surface-hover) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: ${(props) => props.radius || '1rem'};
  height: ${(props) => props.height || '10rem'};
  width: ${(props) => props.width || '100%'};
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: var(--surface);
  border-radius: 1rem;
  border: 1px solid var(--border);
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const ErrorTitle = styled.h3`
  color: var(--danger);
  margin: 0;
  font-size: 1.5rem;
`;

export const RetryButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: 0.2s;

  &:hover {
    background: var(--primary-hover);
  }
`;

export const HelperText = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  padding: 1rem 0;
  text-align: center;
`;

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface);
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  box-shadow: 0 0.25rem 0.75rem var(--shadow);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const HeaderLeft = styled.div`
  h2 {
    margin: 0;
    color: var(--text);
    font-size: 2rem;
    font-weight: 700;
  }

  p {
    margin: 0.5rem 0 0;
    color: var(--text-secondary);
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  flex-wrap: wrap;
`;

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: var(--primary);
  color: var(--text);
  padding: 0.85rem 1.4rem;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s;

  &:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
  }

  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.25);
    outline-offset: 2px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(15rem, 1fr)
  );
  gap: 1.5rem;
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(22rem, 1fr)
  );
  gap: 1.5rem;
  align-items: start;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  min-height: 22rem;
  box-shadow: 0 0.25rem 0.75rem var(--shadow);
`;

export const SectionTitle = styled.h3`
  margin: 0 0 1.5rem;
  color: var(--text);
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
  border: 1px solid var(--border);
  background: var(--bg);
  border-radius: 1rem;
  padding: 1.6rem;
  cursor: pointer;
  color: var(--text);
  transition: 0.3s;

  &:hover {
    background: var(--primary);
    color: var(--text);
    border-color: var(--primary);
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(37, 99, 235, 0.2);
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
  gap: 0.75rem;
  overflow-y: auto;
  flex: 1;
  max-height: 20rem;
`;

export const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  cursor: ${({ onClick }) =>
    onClick ? "pointer" : "default"};
  transition: all 0.25s ease;

  &:hover {
    background: ${({ onClick }) =>
    onClick ? "var(--primary-light)" : "var(--surface)"};
    border-color: ${({ onClick }) =>
    onClick ? "var(--primary)" : "var(--border)"};
  }

  strong {
    color: var(--text);
    font-weight: 600;
  }
`;

export const Badge = styled.span`
  min-width: 2.2rem;
  text-align: center;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ success, danger, warning, holiday }) =>
    success
      ? "var(--badge-success-bg)"
      : danger
        ? "var(--badge-danger-bg)"
        : warning
          ? "var(--badge-warning-bg)"
          : holiday
            ? "var(--badge-purple-bg)"
            : "var(--badge-info-bg)"};
  color: ${({ success, danger, warning, holiday }) =>
    success
      ? "var(--badge-success-fg)"
      : danger
        ? "var(--badge-danger-fg)"
        : warning
          ? "var(--badge-warning-fg)"
          : holiday
            ? "var(--badge-purple-fg)"
            : "var(--badge-info-fg)"};
`;