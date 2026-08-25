import styled from "styled-components";
import { Link } from "react-router-dom";

export const PageWrapper = styled.div`
  max-width: 32rem;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`;

export const SuccessCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px var(--shadow);
`;

export const SuccessIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: rgba(22, 163, 74, 0.15);
  color: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
`;

export const SuccessTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 0.75rem;
`;

export const SuccessMessage = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 2rem;
`;

export const PlanSummary = styled.div`
  background: var(--surface-secondary);
  border-radius: 0.8rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`;

export const PlanRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
`;

export const PlanLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const PlanValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
`;

export const CTAButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 0.8rem;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.95rem 1.1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  &:hover {
    background: var(--primary-hover);
  }
`;

export const SecondaryLink = styled(Link)`
  font-size: 0.9rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;
