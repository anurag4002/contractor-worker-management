import styled from "styled-components";

export const Dropdown = styled.div`
  position: absolute;
  top: 3.5rem;
  right: 0;
  width: 22rem;
  max-width: calc(100vw - 2rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 40px var(--shadow-lg);
  z-index: 1000;

  @media (max-width: 768px) {
    width: min(18rem, calc(100vw - 2rem));
    right: 0;
  }
`;

export const DropdownHeader = styled.div`
  padding: 1rem 1.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  background: var(--table-header-bg);
`;

export const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: 0.25s;
  border-bottom: 1px solid var(--table-border);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--table-row-hover);
  }
`;

export const NotificationIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  flex-shrink: 0;
`;

export const NotificationText = styled.div`
  flex: 1;
  color: var(--text);
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;