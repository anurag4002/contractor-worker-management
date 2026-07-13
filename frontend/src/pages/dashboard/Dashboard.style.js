import styled from "styled-components";

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #ffffff;

  padding: 1.5rem 2rem;

  border-radius: 1rem;

  border: 1px solid #e2e8f0;

  box-shadow: 0 .25rem .75rem rgba(15,23,42,.05);

  @media (max-width:768px){
    flex-direction: column;
    align-items: flex-start;
    gap:1rem;
  }
`;

export const HeaderLeft = styled.div`
  h2{
    margin:0;
    color:#0f172a;
    font-size:2rem;
    font-weight:700;
  }

  p{
    margin-top:.5rem;
    color:#64748b;
  }
`;

export const HeaderRight = styled.div`
  display:flex;
  align-items:center;
  gap:1rem;

  color:#64748b;

  font-weight:500;
`;

export const ExportButton = styled.button`
  border:none;

  background:#2563eb;

  color:white;

  padding:.8rem 1.3rem;

  border-radius:.7rem;

  cursor:pointer;

  font-weight:600;

  transition:.25s;

  &:hover{
    background:#1d4ed8;
  }
`;

export const StatsGrid = styled.div`
  display:grid;

  grid-template-columns:repeat(4,1fr);

  gap:1.5rem;

  @media(max-width:1100px){
    grid-template-columns:repeat(2,1fr);
  }

  @media(max-width:768px){
    grid-template-columns:1fr;
  }
`;

export const DashboardGrid = styled.div`
  display:grid;

  grid-template-columns:2fr 1fr;

  gap:1.5rem;

  @media(max-width:992px){
    grid-template-columns:1fr;
  }
`;

export const Section = styled.div`
  background:white;

  border-radius:1rem;

  border:1px solid #e2e8f0;

  padding:1.5rem;

  box-shadow:0 .25rem .75rem rgba(15,23,42,.05);
`;

export const SectionTitle = styled.h3`
  margin:0 0 1.25rem;

  color:#0f172a;

  font-size:1.1rem;

  font-weight:600;
`;

export const QuickActions = styled.div`
  display:grid;

  grid-template-columns:repeat(2,1fr);

  gap:1rem;
`;

export const ActionCard = styled.button`
  border:none;

  background:#f8fafc;

  border:1px solid #e2e8f0;

  border-radius:.9rem;

  padding:1.25rem;

  cursor:pointer;

  transition:.25s;

  display:flex;

  flex-direction:column;

  align-items:center;

  gap:.8rem;

  &:hover{

    background:#2563eb;

    color:white;

    transform:translateY(-2px);

  }
`;

export const ActionIcon = styled.div`
  font-size:1.5rem;
`;

export const ActionTitle = styled.span`
  font-size:.95rem;

  font-weight:600;
`;

export const List = styled.div`
  display:flex;

  flex-direction:column;

  gap:1rem;
`;

export const ListItem = styled.div`
  display:flex;

  justify-content:space-between;

  align-items:center;

  padding-bottom:.9rem;

  border-bottom:1px solid #e2e8f0;

  &:last-child{
    border:none;
    padding-bottom:0;
  }
`;

export const Badge = styled.span`
  padding:.3rem .75rem;

  border-radius:999px;

  font-size:.8rem;

  font-weight:600;

  background:${({ success, danger, warning }) =>
    success
      ? "#DCFCE7"
      : danger
      ? "#FEE2E2"
      : warning
      ? "#FEF3C7"
      : "#E2E8F0"};

  color:${({ success, danger, warning }) =>
    success
      ? "#15803D"
      : danger
      ? "#DC2626"
      : warning
      ? "#B45309"
      : "#475569"};
`;