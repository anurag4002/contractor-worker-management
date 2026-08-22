import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(15, 23, 42, 0.45);

  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 2rem;

  overflow-y: auto;

  z-index: 9999;

  @media (max-width: 768px) {
    padding: 0.75rem;
    align-items: flex-end;
  }
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 42rem;

  margin: auto;

  background: var(--surface);

  border-radius: 1rem;

  max-height: calc(100vh - 4rem);
  max-height: calc(100dvh - 4rem);

  overflow-y: auto;

  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: calc(100vh - 1.5rem);
    max-height: calc(100dvh - 1.5rem);
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.25rem 1.5rem;

  border-bottom: 1px solid var(--border);

  position: sticky;
  top: 0;

  background: var(--surface);

  z-index: 10;
`;

export const Title = styled.h3`
  margin: 0;

  color: var(--text);

  font-size: 1.2rem;

  font-weight: 700;
`;

export const CloseButton = styled.button`
  border: none;
  background: none;

  cursor: pointer;

  font-size: 1.5rem;

  color: var(--text-secondary);

  &:hover {
    color: var(--danger);
  }
`;

export const Body = styled.div`
  padding: 1.5rem;
`;

export const Table = styled.table`
  width: 100%;

  border-collapse: collapse;

  th {
    padding: 1rem;

    text-align: left;

    background: var(--table-header-bg);

    color: var(--text);

    border-bottom: 1px solid var(--border);
  }

  td {
    padding: 1rem;

    border-bottom: 1px solid var(--surface-hover);

    color: var(--text);
  }

  tbody tr:hover {
    background: var(--table-header-bg);
  }
`;

export const EmptyState = styled.div`
  padding: 3rem;

  text-align: center;

  color: var(--text-secondary);
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  padding: 1.5rem;

  border-top: 1px solid var(--border);

  position: sticky;
  bottom: 0;

  background: var(--surface);
`;

export const Button = styled.button`
  border: none;

  background: var(--primary);

  color: var(--text-on-primary);

  padding: .85rem 1.5rem;

  border-radius: .75rem;

  cursor: pointer;

  font-weight: 600;

  &:hover {
    background: var(--primary-hover);
  }
`;