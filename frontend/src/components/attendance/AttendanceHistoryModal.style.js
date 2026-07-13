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
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 42rem;

  margin: auto;

  background: #fff;

  border-radius: 1rem;

  max-height: calc(100vh - 4rem);

  overflow-y: auto;

  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: calc(100vh - 2rem);
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.25rem 1.5rem;

  border-bottom: 1px solid #E2E8F0;

  position: sticky;
  top: 0;

  background: #fff;

  z-index: 10;
`;

export const Title = styled.h3`
  margin: 0;

  color: #0F172A;

  font-size: 1.2rem;

  font-weight: 700;
`;

export const CloseButton = styled.button`
  border: none;
  background: none;

  cursor: pointer;

  font-size: 1.5rem;

  color: #64748B;

  &:hover {
    color: #DC2626;
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

    background: #F8FAFC;

    color: #475569;

    border-bottom: 1px solid #E2E8F0;
  }

  td {
    padding: 1rem;

    border-bottom: 1px solid #F1F5F9;

    color: #334155;
  }

  tbody tr:hover {
    background: #F8FAFC;
  }
`;

export const EmptyState = styled.div`
  padding: 3rem;

  text-align: center;

  color: #64748B;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  padding: 1.5rem;

  border-top: 1px solid #E2E8F0;

  position: sticky;
  bottom: 0;

  background: #fff;
`;

export const Button = styled.button`
  border: none;

  background: #2563EB;

  color: #fff;

  padding: .85rem 1.5rem;

  border-radius: .75rem;

  cursor: pointer;

  font-weight: 600;

  &:hover {
    background: #1D4ED8;
  }
`;