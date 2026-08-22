import styled from "styled-components";

export const HeaderContainer = styled.header`
  height: var(--header-height);
  background: var(--surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--content-padding);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 998;
  gap: 1rem;

  @media (max-width: 640px) {
    padding: 0 1rem;
    gap: 0.5rem;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
`;

export const MenuButton = styled.button`
  width: 2.8rem;
  height: 2.8rem;
  border: none;
  border-radius: 0.75rem;
  background: var(--surface-hover);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: var(--text);
  transition: 0.3s;
  flex-shrink: 0;

  &:hover {
    background: var(--primary);
    color: white;
  }

  @media (max-width: 640px) {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 0.6rem;
  }
`;

export const SearchBar = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 24rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0 0.9rem;
  border: 1px solid var(--input-border);
  border-radius: 0.8rem;
  background: var(--input-bg);

  svg {
    color: var(--text-secondary);
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    padding: 0.9rem 0;
    font-size: 0.95rem;
    background: transparent;
    color: var(--input-text);
    min-width: 0;

    &::placeholder {
      color: var(--input-placeholder);
    }
  }

  @media (max-width: 1024px) {
    max-width: 16rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 1;
  min-width: 0;

  @media (max-width: 640px) {
    gap: 0.25rem;
  }
`;

export const IconButton = styled.button`
  width: 2.8rem;
  height: 2.8rem;
  border: none;
  border-radius: 0.75rem;
  background: var(--surface-hover);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.15rem;
  color: var(--text);
  transition: 0.3s;

  &:hover {
    background: var(--primary);
    color: white;
  }

  @media (max-width: 640px) {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 0.6rem;
    font-size: 1rem;
  }
`;

export const ThemeToggle = styled.button`
  width: 2.8rem;
  height: 2.8rem;
  border: 1px solid var(--toggle-border);
  border-radius: 0.75rem;
  background: var(--toggle-bg);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.15rem;
  color: var(--text);
  transition: 0.3s;

  &:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  @media (max-width: 640px) {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 0.6rem;
    font-size: 1rem;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--danger);
  color: white;
  font-size: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  min-width: 0;

  @media (max-width: 768px) {
    gap: 0;
  }
`;

export const Avatar = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 2.4rem;
    height: 2.4rem;
    font-size: 0.9rem;
  }
`;

export const UserInfo = styled.div`
  h4 {
    margin: 0;
    font-size: 0.95rem;
    color: var(--text);
  }

  p {
    margin: 0.15rem 0 0;
    color: var(--text-secondary);
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;