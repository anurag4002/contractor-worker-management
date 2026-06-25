import styled from "styled-components";
import { COLORS } from "../../constants/Colors";

export const SidebarWrapper = styled.aside`
  width: 280px;
  min-height: 100vh;

  background: linear-gradient(
    180deg,
    rgba(15,23,42,1) 0%,
    rgba(2,6,23,1) 100%
  );

  padding: 2rem;
  color: white;
`;

export const Logo = styled.div`
  margin-bottom: 3rem;

  h2 {
    font-size: 1.5rem;
  }

  p {
    color: ${COLORS.textLight};
    font-size: 0.875rem;
  }
`;

export const Menu = styled.ul`
  list-style: none;
`;

export const MenuItem = styled.li`
  padding: 1rem;
  margin-bottom: 0.75rem;

  border-radius: 12px;

  background: ${({ active }) =>
    active ? COLORS.primary : "transparent"};

  cursor: pointer;

  &:hover {
    background: ${COLORS.sidebarHover};
  }
`;