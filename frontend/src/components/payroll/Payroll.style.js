import styled from "styled-components";

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const Card = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const IconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: ${({ color }) => color || "#2563eb"}22;
  color: ${({ color }) => color || "#2563eb"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

export const Info = styled.div`
  p { margin: 0; font-size: 0.85rem; color: #64748b; }
  h3 { margin: 0.25rem 0 0; font-size: 1.5rem; font-weight: 700; color: #0f172a; }
`;

export const TableCard = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  thead tr { background: #f8fafc; }
  th {
    padding: 1rem 1.25rem;
    text-align: left;
    font-weight: 600;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }
  td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
  }
  tbody tr:hover { background: #f8fafc; }
  tbody tr:last-child td { border-bottom: none; }
`;

export const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${({ status }) =>
        status === "PAID" ? "#dcfce7" :
            status === "GENERATED" ? "#dbeafe" :
                status === "PENDING" ? "#fef9c3" :
                    status === "CANCELLED" ? "#fee2e2" : "#f1f5f9"};
  color: ${({ status }) =>
        status === "PAID" ? "#16a34a" :
            status === "GENERATED" ? "#2563eb" :
                status === "PENDING" ? "#ca8a04" :
                    status === "CANCELLED" ? "#dc2626" : "#64748b"};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const IconButton = styled.button`
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  color: #64748b;
  font-size: 0.85rem;
  transition: 0.2s;
  &:hover { background: #f1f5f9; color: #0f172a; }
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 180px;
  padding: 0.65rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.65rem;
  font-size: 0.9rem;
  outline: none;
  &:focus { border-color: #2563eb; }
`;

export const FilterSelect = styled.select`
  padding: 0.65rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.65rem;
  font-size: 0.9rem;
  background: #fff;
  outline: none;
  cursor: pointer;
  &:focus { border-color: #2563eb; }
`;

export const ResetButton = styled.button`
  padding: 0.65rem 1.1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.65rem;
  background: #f8fafc;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover { background: #f1f5f9; }
`;
