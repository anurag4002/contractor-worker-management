import styled from "styled-components";

export const HeaderContainer = styled.header`
  height: 5rem;
  background: var(--surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 999;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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

  &:hover {
    background: var(--primary);
    color: white;
  }
`;

export const SearchBar = styled.div`
  width: 24rem;
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

    &::placeholder {
      color: var(--input-placeholder);
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  gap: 0.8rem;
  cursor: pointer;
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