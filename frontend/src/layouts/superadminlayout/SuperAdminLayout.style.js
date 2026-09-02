import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 16rem;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    height: 100dvh;
    width: min(16rem, 85vw);
    z-index: 1100;
    transform: ${({ $sidebarOpen }) =>
      $sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.25s ease;
    box-shadow: 4px 0 24px rgba(0,0,0,.4);
  }
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const LogoIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: var(--text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
    white-space: nowrap;
  }

  p {
    margin: 0;
    font-size: 0.75rem;
    color: var(--text-secondary);
    white-space: nowrap;
  }
`;

export const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const MenuItem = styled.div``;

export const MenuButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.9rem;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "var(--primary)" : "var(--text-secondary)")};
  font-size: 0.95rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: var(--surface-hover);
  }

  svg {
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const BottomSection = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.25rem;
`;

export const Avatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: var(--text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  h4 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 0;
    font-size: 0.75rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.75rem;

  &:hover {
    background: var(--surface-hover);
  }
`;

export const LogoutConfirm = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const LogoutConfirmOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
`;

export const LogoutConfirmCard = styled.div`
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 24rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.25);
`;

export const LogoutConfirmTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--text);
`;

export const LogoutConfirmText = styled.p`
  margin: 0 0 1.25rem 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

export const LogoutConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const LogoutConfirmBtn = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: #dc2626;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #b91c1c;
  }
`;

export const LogoutCancelBtn = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: var(--surface-hover);
  }
`;

export const SidebarBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 900;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

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

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    gap: 0.75rem;
  }
`;

export const TopBarToggle = styled.button`
  background: none;
  border: 1px solid var(--border);
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text);
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: var(--surface-hover);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

export const TopBarTitle = styled.h1`
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  font-weight: 700;
  color: var(--text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: var(--content-padding);
  background: var(--bg);
  min-width: 0;
`;
