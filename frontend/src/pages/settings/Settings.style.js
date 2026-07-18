import styled from "styled-components";

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  h2 {
    margin: 0;
    color: #0f172a;
    font-size: 2rem;
    font-weight: 700;
  }

  p {
    margin-top: .5rem;
    color: #64748b;
    font-size: .95rem;
  }
`;
export const CardTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0F172A;
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(15, 23, 42, .05);
`;

export const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.5rem;

  border-bottom: 1px solid #f1f5f9;

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
    background: #eff6ff;
    color: #2563eb;
    flex-shrink: 0;
  }

  h4 {
    margin: 0;
    color: #0f172a;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: .3rem 0 0;
    color: #64748b;
    font-size: .9rem;
  }
`;

export const SettingButton = styled.button`
  border: none;
  outline: none;

  background: #2563eb;
  color: #ffffff;

  padding: .8rem 1.5rem;

  border-radius: .75rem;

  font-weight: 600;

  cursor: pointer;

  transition: .25s;

  &:hover {
    background: #1d4ed8;
  }
`;