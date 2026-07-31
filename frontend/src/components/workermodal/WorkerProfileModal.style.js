import styled from "styled-components";

export const ProfileContainer = styled.div`
  display:flex;
  align-items:center;
  gap:1.5rem;
  padding:2rem;
  border-bottom:1px solid var(--border);
`;

export const ProfileImage = styled.div`
  width:6rem;
  height:6rem;
  border-radius:50%;
  background:var(--primary);
  color:#fff;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:2rem;
  font-weight:700;
  overflow:hidden;

  img{
    width:100%;
    height:100%;
    object-fit:cover;
  }
`;

export const ProfileInfo = styled.div`
  h2{
    margin:0;
    color:var(--text);
  }

  p{
    margin:.5rem 0 0;
    color:var(--text-secondary);
  }
`;

export const ProfileGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:1.25rem;
  padding:2rem;

  @media(max-width:768px){
    grid-template-columns:1fr;
  }
`;

export const ProfileItem = styled.div`
  display:flex;
  flex-direction:column;
  gap:.35rem;
`;

export const Label = styled.span`
  font-size:.85rem;
  color:var(--text-secondary);
`;

export const Value = styled.span`
  font-size:1rem;
  font-weight:600;
  color:var(--text);
`;

export const StatusBadge = styled.span`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:max-content;

  padding:.35rem .9rem;

  border-radius:999px;

  background:${({status}) =>
    status === "Active"
      ? "var(--badge-success-bg)"
      : "var(--badge-danger-bg)"};

  color:${({status}) =>
    status === "Active"
      ? "#15803D"
      : "var(--danger)"};

  font-size:.8rem;

  font-weight:600;
`;