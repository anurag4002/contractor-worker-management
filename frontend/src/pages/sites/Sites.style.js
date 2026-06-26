import styled from "styled-components";

export const SitesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TitleSection = styled.div`
  h2 {
    margin: 0;
    font-size: 2rem;
    color: #0f172a;
    font-weight: 700;
  }

  p {
    margin-top: .5rem;
    color: #64748b;
  }
`;

export const ActionSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const SearchBox = styled.div`
  position: relative;
  width: 20rem;

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }

  input {
    width: 100%;
    padding: .9rem 1rem .9rem 2.8rem;
    border: 1px solid #CBD5E1;
    border-radius: .8rem;
    outline: none;

    &:focus {
      border-color: #2563EB;
    }
  }

  @media (max-width:768px){
    width:100%;
  }
`;

export const Button = styled.button`
  border: none;
  background: #2563EB;
  color: white;
  padding: .9rem 1.3rem;
  border-radius: .8rem;
  cursor: pointer;

  display:flex;
  align-items:center;
  gap:.5rem;

  font-weight:600;

  transition:.3s;

  &:hover{
    background:#1D4ED8;
  }
`;

export const SiteGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
  gap:1.5rem;
`;

export const SiteCard = styled.div`
  background:white;
  border:1px solid #E2E8F0;
  border-radius:1rem;
  padding:1.5rem;
  box-shadow:0 10px 30px rgba(15,23,42,.05);
  transition:.3s;

  &:hover{
    transform:translateY(-5px);
    box-shadow:0 15px 40px rgba(15,23,42,.1);
  }
`;

export const SiteHeader = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:1rem;

  h3{
    margin:0;
    color:#0F172A;
    font-size:1.2rem;
  }
`;

export const StatusBadge = styled.span`
  padding:.35rem .8rem;
  border-radius:999px;
  font-size:.75rem;
  font-weight:600;

  background:${({status}) =>
    status==="Completed"
      ? "#DCFCE7"
      : "#DBEAFE"};

  color:${({status}) =>
    status==="Completed"
      ? "#15803D"
      : "#2563EB"};
`;

export const SiteInfo = styled.div`
  display:flex;
  flex-direction:column;
  gap:.8rem;

  p{
    margin:0;
    color:#64748B;
    display:flex;
    align-items:center;
    gap:.5rem;
  }
`;

export const ProgressWrapper = styled.div`
  margin-top:1.5rem;
`;

export const ProgressTop = styled.div`
  display:flex;
  justify-content:space-between;
  margin-bottom:.5rem;

  span{
    font-size:.85rem;
    color:#64748B;
  }
`;

export const ProgressBar = styled.div`
  height:.6rem;
  background:#E2E8F0;
  border-radius:999px;
  overflow:hidden;
`;

export const ProgressFill = styled.div`
  height:100%;
  width:${({progress}) => progress}%;
  background:#2563EB;
  border-radius:999px;
`;

export const CardFooter = styled.div`
  margin-top:1.5rem;
  display:flex;
  justify-content:space-between;
  align-items:center;
`;

export const WorkerCount = styled.span`
  color:#2563EB;
  font-weight:600;
`;

export const ViewButton = styled.button`
  border:none;
  background:#EFF6FF;
  color:#2563EB;
  padding:.65rem 1rem;
  border-radius:.7rem;
  cursor:pointer;
  font-weight:600;
  transition:.3s;

  &:hover{
    background:#2563EB;
    color:white;
  }
`;