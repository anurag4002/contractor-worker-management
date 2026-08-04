import styled from "styled-components";

export const Dropdown = styled.div`
  position: absolute;
  top: 3.8rem;
  right: 0;
  width: 18rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 40px var(--shadow-lg);
  z-index: 1000;

  @media (max-width:768px) {
    width: 16rem;
    right: -1rem;
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--table-header-bg);
  border-bottom: 1px solid var(--border);
`;

export const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--primary);
  color: var(--text-on-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const UserDetails = styled.div`
  h4 {
    margin: 0;
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0.25rem 0 0;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  color: ${({ danger }) =>
    danger ? "var(--danger)" : "var(--text)"};
  cursor: pointer;
  transition: 0.25s;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: ${({ danger }) =>
    danger ? "var(--badge-danger-bg)" : "var(--table-header-bg)"};
  }
`;