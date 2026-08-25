import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg);
`;

export const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg);
`;

export const MainContent = styled.main`
  flex: 1;
  padding: var(--content-padding);
  background: var(--bg);
  min-width: 0;
`;

export const TrialBanner = styled.div`
  background: ${({ $expired }) =>
    $expired
      ? "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.05) 100%)"
      : "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.05) 100%)"};
  border-bottom: 1px solid
    ${({ $expired }) =>
      $expired ? "rgba(239, 68, 68, 0.25)" : "rgba(59, 130, 246, 0.25)"};
  padding: 0.9rem var(--content-padding);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TrialBannerContent = styled.div`
  width: 100%;
  max-width: 60rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
`;

export const TrialBannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const TrialBannerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ $expired }) =>
    $expired ? "var(--danger)" : "var(--primary)"};
  font-weight: 700;
  font-size: clamp(0.9rem, 1.5vw, 1rem);

  @media (max-width: 768px) {
    justify-content: center;
  }

  svg {
    font-size: 1.1rem;
  }
`;

export const TrialBannerDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.8rem, 1.3vw, 0.9rem);

  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const TrialBannerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const TrialBannerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.55rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: clamp(0.78rem, 1.2vw, 0.85rem);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: var(--primary-hover);
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.78rem;
  }
`;

export const TrialBannerButtonSecondary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  padding: 0.55rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: clamp(0.78rem, 1.2vw, 0.85rem);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.78rem;
  }
`;