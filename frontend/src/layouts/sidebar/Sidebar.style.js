import styled from "styled-components";

export const SidebarContainer = styled.aside`
  position: sticky;
  top: 0;
  width: ${({ $sidebarOpen }) =>
    $sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed-width)"};
  height: 100vh;
  height: 100dvh;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: all 0.35s ease;
  z-index: 1000;
  border-right: 1px solid rgba(255,255,255,.08);
  flex-shrink: 0;

  @media (max-width:768px){
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    height: 100dvh;
    transform: ${({ $sidebarOpen }) =>
    $sidebarOpen
      ? "translateX(0)"
      : "translateX(-100%)"};
    width: var(--sidebar-width);
    box-shadow: 4px 0 24px rgba(0,0,0,.4);
  }
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LogoSection = styled.div`
  height: 5rem;
  display: flex;
  align-items: center;
  padding: 0 1.4rem;
  border-bottom: 1px solid rgba(255,255,255,.08);
`;

export const LogoIcon = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 0.8rem;
  background: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const LogoText = styled.div`
  margin-left: 1rem;
  display: ${({ $sidebarOpen }) =>
    $sidebarOpen ? "block" : "none"};

  h2 {
    margin: 0;
    color: white;
    font-size: 1.05rem;
  }

  p {
    margin: 0.2rem 0 0;
    color: var(--sidebar-text);
    font-size: 0.78rem;
  }
`;

export const Menu = styled.ul`
  list-style: none;
  padding: 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

export const MenuItem = styled.li`
  width: 100%;
`;

export const MenuButton = styled.button`
  width: 100%;
  border: none;
  outline: none;
  background: ${({ $active }) =>
    $active ? "var(--sidebar-active-bg)" : "transparent"};
  color: ${({ $active }) => $active ? "var(--text-on-primary)" : "var(--sidebar-text)"};
  border-radius: 0.9rem;
  padding: 0.95rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: var(--sidebar-hover-bg);
    color: white;
  }

  svg {
    font-size: 1.25rem;
    min-width: 1.25rem;
  }

  span {
    display: ${({ $sidebarOpen }) =>
    $sidebarOpen ? "block" : "none"};
    white-space: nowrap;
    font-size: 0.95rem;
    font-weight: 500;
  }
`;

export const BottomSection = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,.08);
  position: relative;
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  border-radius: 0.9rem;
  background: rgba(255,255,255,.05);
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    background: rgba(255,255,255,.12);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  &:active {
    background: rgba(255,255,255,.18);
    transform: translateX(2px);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
`;

export const Avatar = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  display: ${({ $sidebarOpen }) =>
    $sidebarOpen ? "block" : "none"};

  h4 {
    margin: 0;
    color: white;
    font-size: 0.9rem;
  }

  p {
    margin: 0.2rem 0 0;
    color: var(--sidebar-text);
    font-size: 0.75rem;
  }
`;

export const LogoutButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  border: none;
  background: var(--danger);
  color: white;
  padding: 0.85rem;
  border-radius: 0.8rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: var(--danger-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid var(--danger);
    outline-offset: 2px;
  }
`;

export const LogoutConfirm = styled.div`
  position: absolute;
  bottom: 100%;
  left: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  justify-content: center;
  padding-bottom: 0.5rem;
`;

export const LogoutConfirmOverlay = styled.div`
  position: absolute;
  inset: -0.5rem;
  background: rgba(0,0,0,0.4);
  border-radius: 1rem;
`;

export const LogoutConfirmCard = styled.div`
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  text-align: center;
`;

export const LogoutConfirmTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 700;
`;

export const LogoutConfirmText = styled.p`
  margin: 0 0 1.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

export const LogoutConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

export const LogoutConfirmBtn = styled.button`
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 0.6rem;
  background: var(--danger);
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: var(--danger-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--danger);
    outline-offset: 2px;
  }
`;

export const LogoutCancelBtn = styled.button`
  padding: 0.6rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: var(--surface-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
`;

export const SidebarBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;