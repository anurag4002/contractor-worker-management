import styled from "styled-components";

export const WorkersContainer = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2rem;

  width: 100%;

  overflow-x: hidden;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width:768px){
    flex-direction:column;
    align-items:flex-start;
  }
`;

export const TitleSection = styled.div`
  h2{
    margin:0;
    font-size:2rem;
    color:var(--text);
    font-weight:700;
  }

  p{
    margin:.5rem 0 0;
    color:var(--text-secondary);
  }
`;

export const ActionSection = styled.div`
  display:flex;
  gap:1rem;
  flex-wrap:wrap;
`;

export const SearchBox = styled.div`
  width:20rem;
  position:relative;

  input{
    width:100%;
    padding:0.9rem 1rem;
    border:1px solid var(--input-border);
    border-radius:0.8rem;
    outline:none;
    font-size:.95rem;

    &:focus{
      border-color:var(--primary);
    }
  }

  @media(max-width:768px){
      width:100%;
  }
`;

export const Button = styled.button`
  border:none;

  background:var(--primary);

  color:white;

  padding:.9rem 1.4rem;

  border-radius:.8rem;

  cursor:pointer;

  font-weight:600;

  transition:.3s;

  &:hover{
      background:var(--primary-hover);
  }
`;

export const TableCard = styled.div`
  background:white;

  border-radius:1.25rem;

  overflow:hidden;

  border:1px solid var(--border);

  box-shadow:0 10px 25px rgba(15,23,42,.05);
`;

export const Table = styled.table`
  width:100%;
  border-collapse:collapse;

  thead{
      background:var(--table-header-bg);
  }

  th{
      padding:1rem;
      text-align:left;
      color:var(--text);
      font-size:.9rem;
      font-weight:600;
      border-bottom:1px solid var(--border);
  }

  td{
      padding:1rem;
      border-bottom:1px solid var(--border);
      color:var(--text);
      font-size:.95rem;
  }

  tbody tr{
      transition:.3s;
  }

  tbody tr:hover{
      background:var(--table-header-bg);
  }
`;

export const WorkerInfo = styled.div`
  display:flex;
  align-items:center;
  gap:1rem;
`;

export const Avatar = styled.div`
  width:2.8rem;
  height:2.8rem;

  border-radius:50%;

  background:var(--primary);

  display:flex;
  justify-content:center;
  align-items:center;

  color:white;

  font-weight:700;
`;

export const Status = styled.span`
  display:inline-block;

  padding:.35rem .9rem;

  border-radius:999px;

  background:${({status})=>
    status==="Present"
    ? "var(--badge-success-bg)"
    : "var(--badge-danger-bg)"};

  color:${({status})=>
    status==="Present"
    ? "#15803D"
    : "var(--danger)"};

  font-size:.8rem;

  font-weight:600;
`;

export const ActionButtons = styled.div`
  display:flex;
  gap:.6rem;
`;

export const IconButton = styled.button`
  width:2.3rem;
  height:2.3rem;

  border:none;

  border-radius:.6rem;

  background:var(--primary-light);

  color:var(--primary);

  cursor:pointer;

  transition:.3s;

  &:hover{
      background:var(--primary);
      color:white;
  }
`;