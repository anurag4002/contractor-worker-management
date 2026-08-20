import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  overflow-x: hidden;
`;

export const Container = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 0 16px;
  }
`;

/* ==========================================================================
   TOP ANNOUNCEMENT BAR & NAVBAR
   ========================================================================== */
export const AnnouncementBar = styled.div`
  background: #0f172a;
  color: #f8fafc;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 8px 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  span {
    background: #2563eb;
    color: #ffffff;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 9999px;
    text-transform: uppercase;
  }
`;

export const StickyHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
`;

export const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

export const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
`;

export const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #2563eb;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.15rem;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
`;

export const LogoText = styled.div`
  span {
    display: block;
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  small {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

export const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.92rem;
    font-weight: 600;
    transition: color 200ms ease;

    &:hover {
      color: var(--primary);
    }
  }

  @media (max-width: 868px) {
    display: none;
  }
`;

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 200ms ease;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.2);

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled.button`
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 200ms ease;

  &:hover {
    background-color: var(--surface-hover);
    border-color: var(--text-secondary);
    color: var(--text);
  }
`;

/* ==========================================================================
   HERO SECTION
   ========================================================================== */
export const HeroSection = styled.section`
  padding: 56px 0 40px;
  text-align: center;
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-light);
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2.1rem, 4vw, 3.25rem);
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.03em;
  line-height: 1.2;
  max-width: 960px;
  margin: 0 auto 16px;
`;

export const HeroDescription = styled.p`
  font-size: clamp(1rem, 1.4vw, 1.15rem);
  color: var(--text-secondary);
  max-width: 720px;
  margin: 0 auto 28px;
  line-height: 1.6;
`;

export const HeroButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 44px;
`;

/* REALISTIC DASHBOARD PREVIEW MOCK */
export const DashboardMockWrapper = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  text-align: left;
  width: 100%;
  margin: 0 auto;
`;

export const MockHeader = styled.div`
  background: var(--surface-secondary);
  border-bottom: 1px solid var(--border);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MockDots = styled.div`
  display: flex;
  gap: 6px;
  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    &:nth-child(1) { background: #ef4444; }
    &:nth-child(2) { background: #f59e0b; }
    &:nth-child(3) { background: #22c55e; }
  }
`;

export const MockTitle = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

export const MockBody = styled.div`
  padding: 24px;
  background: var(--surface-secondary);
`;

export const MockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const MockCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .meta {
    span { display: block; font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); }
    h4 { margin: 6px 0 0; font-size: 1.35rem; font-weight: 800; color: var(--text); }
  }

  .icon-box {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    font-size: 1.1rem;
  }
`;

export const MockTableCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  overflow-x: auto;

  h5 {
    margin: 0 0 12px;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;

    th {
      text-align: left;
      padding: 8px 12px;
      color: var(--text-secondary);
      font-weight: 600;
      border-bottom: 1px solid var(--border);
      background: var(--table-header-bg);
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--table-border);
      color: var(--text);
    }

    tr:last-child td {
      border-bottom: none;
    }
  }
`;

export const MockBadge = styled.span`
  padding: 3px 8px;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ type }) =>
    type === 'active' ? 'var(--badge-success-bg)' : type === 'present' ? 'var(--badge-info-bg)' : 'var(--badge-warning-bg)'};
  color: ${({ type }) =>
    type === 'active' ? 'var(--badge-success-fg)' : type === 'present' ? 'var(--badge-info-fg)' : 'var(--badge-warning-fg)'};
`;

/* ==========================================================================
   TRUST / STATS SECTION
   ========================================================================== */
export const TrustSection = styled.section`
  padding: 40px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
`;

export const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const TrustCard = styled.div`
  text-align: center;
  padding: 12px;

  h3 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--primary);
    margin: 0 0 4px;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0;
  }
`;

/* ==========================================================================
   SECTION HEADER (COMMON)
   ========================================================================== */
export const SectionHeader = styled.div`
  text-align: center;
  max-width: 680px;
  margin: 0 auto 40px;

  h2 {
    font-size: clamp(1.6rem, 3vw, 2.25rem);
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.02em;
    margin: 0 0 10px;
  }

  p {
    font-size: 0.98rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }
`;

/* ==========================================================================
   FEATURES SECTION
   ========================================================================== */
export const FeaturesSection = styled.section`
  padding: 72px 0;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  transition: all 200ms ease;

  &:hover {
    border-color: var(--border);
    box-shadow: var(--shadow);
    transform: translateY(-2px);
  }
`;

export const FeatureIconBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--primary-light);
  color: var(--primary);
  display: grid;
  place-items: center;
  font-size: 1.2rem;
  margin-bottom: 16px;
`;

export const FeatureCardTitle = styled.h3`
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
`;

export const FeatureCardDesc = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
`;

/* ==========================================================================
   MODULES SECTION
   ========================================================================== */
export const ModulesSection = styled.section`
  padding: 72px 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
`;

export const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ModuleCard = styled.div`
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  transition: all 200ms ease;

  &:hover {
    background: var(--surface);
    border-color: var(--primary);
    box-shadow: var(--shadow);
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .module-icon {
    font-size: 1.35rem;
    color: var(--primary);
  }

  .tag {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--badge-info-fg);
    background: var(--badge-info-bg);
    padding: 3px 10px;
    border-radius: 9999px;
    text-transform: uppercase;
  }

  h4 {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 6px;
  }

  p {
    font-size: 0.88rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }
`;

/* ==========================================================================
   WORKFLOW SECTION
   ========================================================================== */
export const WorkflowSection = styled.section`
  padding: 72px 0;
`;

export const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

export const WorkflowStepCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px 20px;
  position: relative;

  .step-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #2563eb;
    color: #ffffff;
    font-weight: 700;
    font-size: 0.88rem;
    display: grid;
    place-items: center;
    margin-bottom: 16px;
  }

  h4 {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 8px;
  }

  p {
    font-size: 0.86rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }
`;

/* ==========================================================================
   WHY CHOOSE US / COMPARISON SECTION
   ========================================================================== */
export const ComparisonSection = styled.section`
  padding: 72px 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
`;

export const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ComparisonCard = styled.div`
  border-radius: 12px;
  padding: 28px 24px;
  border: 1px solid var(--border);
  background: var(--surface);

  h3 {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text);
    margin: 0 0 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const ComparisonList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ComparisonItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--text);

  .icon {
    font-size: 1.1rem;
    margin-top: 2px;
    flex-shrink: 0;
    color: ${({ type }) => (type === 'modern' ? 'var(--success)' : 'var(--danger)')};
  }

  span {
    line-height: 1.45;
  }
`;

/* ==========================================================================
   CALL TO ACTION
   ========================================================================== */
export const CTASection = styled.section`
  padding: 72px 0;
`;

export const CTABox = styled.div`
  background: #0f172a;
  color: #ffffff;
  border-radius: 12px;
  padding: 48px 32px;
  text-align: center;
  max-width: 880px;
  margin: 0 auto;

  h2 {
    font-size: clamp(1.6rem, 3vw, 2.25rem);
    font-weight: 800;
    margin: 0 0 12px;
  }

  p {
    font-size: 1rem;
    color: #9ca3af;
    max-width: 540px;
    margin: 0 auto 28px;
  }
`;

/* ==========================================================================
   FOOTER
   ========================================================================== */
export const Footer = styled.footer`
  background: #0f172a;
  color: #9ca3af;
  border-top: 1px solid #1e293b;
  padding: 56px 0 32px;
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 868px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FooterCol = styled.div`
  h5 {
    color: #ffffff;
    font-size: 0.92rem;
    font-weight: 700;
    margin: 0 0 16px;
  }

  p {
    font-size: 0.88rem;
    line-height: 1.6;
    margin: 12px 0 0;
    color: var(--text-secondary);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 10px;

      a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.88rem;
        transition: color 200ms ease;

        &:hover {
          color: #ffffff;
        }
      }
    }
  }
`;

export const SocialRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;

  a {
    width: 34px;
    height: 34px;
    border-radius: 6px;
    background: var(--surface-secondary);
    color: var(--text-secondary);
    display: grid;
    place-items: center;
    font-size: 1rem;
    transition: all 200ms ease;

    &:hover {
      background: #2563eb;
      color: #ffffff;
    }
  }
`;

export const FooterBottom = styled.div`
  border-top: 1px solid var(--border);
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
  gap: 12px;
`;
