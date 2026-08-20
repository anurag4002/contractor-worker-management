import styled from "styled-components";

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  h2 {
    margin: 0;
    color: var(--text);
    font-size: clamp(1.25rem, 2.5vw, 2rem);
    font-weight: 700;
  }

  p {
    margin-top: .5rem;
    color: var(--text-secondary);
    font-size: clamp(0.8rem, 1.5vw, .95rem);
  }
`;
export const CardTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
`;

export const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(15, 23, 42, .05);
`;

export const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.5rem;

  border-bottom: 1px solid var(--surface-hover);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width:768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const SettingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    width: 2.8rem;
    height: 2.8rem;
    padding: .7rem;
    border-radius: .8rem;
    background: var(--primary-light);
    color: var(--primary);
    flex-shrink: 0;
  }

  h4 {
    margin: 0;
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: .3rem 0 0;
    color: var(--text-secondary);
    font-size: .9rem;
  }
`;

export const SettingButton = styled.button`
  border: none;
  outline: none;

  background: var(--primary);
  color: var(--surface);

  padding: .8rem 1.5rem;

  border-radius: .75rem;

  font-weight: 600;

  cursor: pointer;

  transition: .25s;

  &:hover {
    background: var(--primary-hover);
  }
`;