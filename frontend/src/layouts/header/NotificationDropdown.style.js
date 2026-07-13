import styled from "styled-components";

export const Dropdown = styled.div`
  position: absolute;

  top: 3.5rem;

  right: 0;

  width: 22rem;

  background: #ffffff;

  border: 1px solid #E2E8F0;

  border-radius: 1rem;

  overflow: hidden;

  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);

  z-index: 1000;

  @media (max-width: 768px) {
    width: 18rem;
    right: -1rem;
  }
`;

export const DropdownHeader = styled.div`
  padding: 1rem 1.25rem;

  font-size: 1rem;

  font-weight: 700;

  color: #0F172A;

  border-bottom: 1px solid #E2E8F0;

  background: #F8FAFC;
`;

export const NotificationItem = styled.div`
  display: flex;

  align-items: center;

  gap: 1rem;

  padding: 1rem 1.25rem;

  cursor: pointer;

  transition: 0.25s;

  border-bottom: 1px solid #F1F5F9;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #F8FAFC;
  }
`;

export const NotificationIcon = styled.div`
  width: 2.5rem;

  height: 2.5rem;

  border-radius: 50%;

  background: #EFF6FF;

  color: #2563EB;

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 1rem;

  flex-shrink: 0;
`;

export const NotificationText = styled.div`
  flex: 1;

  color: #334155;

  font-size: 0.9rem;

  line-height: 1.4;
`;

export const EmptyState = styled.div`
  padding: 2rem;

  text-align: center;

  color: #64748B;

  font-size: 0.9rem;
`;