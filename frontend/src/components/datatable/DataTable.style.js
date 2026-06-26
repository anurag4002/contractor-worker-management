import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
`;

export const TableHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Title = styled.h3`
  margin: 0;
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 700;
`;

export const SearchBox = styled.div`
  width: 20rem;
  position: relative;

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  input {
    width: 100%;
    padding: 0.9rem 1rem 0.9rem 2.8rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.8rem;
    outline: none;
    font-size: 0.95rem;
    transition: 0.3s;

    &:focus {
      border-color: #2563eb;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f8fafc;
  }

  th {
    padding: 1rem;
    text-align: left;
    color: #475569;
    font-size: 0.9rem;
    font-weight: 600;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    font-size: 0.94rem;
  }

  tbody tr {
    transition: 0.25s;
  }

  tbody tr:hover {
    background: #f8fafc;
  }
`;

export const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #94a3b8;
`;

export const Pagination = styled.div`
  padding: 1rem 1.5rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const PageButton = styled.button`
  width: 2.3rem;
  height: 2.3rem;

  border: none;
  border-radius: 0.6rem;

  cursor: pointer;

  background: ${({ active }) =>
    active ? "#2563EB" : "#F1F5F9"};

  color: ${({ active }) =>
    active ? "#fff" : "#475569"};

  transition: 0.3s;

  &:hover {
    background: #2563eb;
    color: white;
  }
`;