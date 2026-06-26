import styled from "styled-components";

export const HeaderContainer = styled.header`
  height: 5rem;

  background: white;

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 0 2rem;

  border-bottom: 1px solid #E2E8F0;

  position: sticky;

  top: 0;

  z-index: 999;
`;

export const LeftSection = styled.div`
  display:flex;
  align-items:center;
  gap:1rem;
`;

export const MenuButton = styled.button`
  width:2.8rem;
  height:2.8rem;

  border:none;

  border-radius:.75rem;

  background:#F8FAFC;

  cursor:pointer;

  display:flex;

  justify-content:center;

  align-items:center;

  font-size:1.2rem;

  transition:.3s;

  &:hover{
      background:#2563EB;
      color:white;
  }
`;

export const SearchBar = styled.div`
  width:24rem;

  display:flex;

  align-items:center;

  gap:.8rem;

  padding:0 .9rem;

  border:1px solid #CBD5E1;

  border-radius:.8rem;

  background:white;

  svg{
      color:#64748B;
  }

  input{
      flex:1;
      border:none;
      outline:none;
      padding:.9rem 0;
      font-size:.95rem;
  }

  @media(max-width:768px){
      display:none;
  }
`;

export const RightSection = styled.div`
  display:flex;
  align-items:center;
  gap:1rem;
`;

export const IconButton = styled.button`
  width:2.8rem;
  height:2.8rem;

  border:none;

  border-radius:.75rem;

  background:#F8FAFC;

  position:relative;

  display:flex;

  justify-content:center;

  align-items:center;

  cursor:pointer;

  font-size:1.15rem;

  transition:.3s;

  &:hover{
      background:#2563EB;
      color:white;
  }
`;

export const NotificationBadge = styled.span`
  position:absolute;

  top:.35rem;

  right:.35rem;

  width:1rem;

  height:1rem;

  border-radius:50%;

  background:#EF4444;

  color:white;

  font-size:.6rem;

  display:flex;

  justify-content:center;

  align-items:center;
`;

export const UserProfile = styled.div`
  display:flex;

  align-items:center;

  gap:.8rem;

  cursor:pointer;
`;

export const Avatar = styled.div`
  width:2.8rem;

  height:2.8rem;

  border-radius:50%;

  background:#2563EB;

  color:white;

  display:flex;

  justify-content:center;

  align-items:center;

  font-weight:700;
`;

export const UserInfo = styled.div`
  h4{
      margin:0;
      font-size:.95rem;
      color:#0F172A;
  }

  p{
      margin:.15rem 0 0;
      color:#64748B;
      font-size:.8rem;
  }

  @media(max-width:768px){
      display:none;
  }
`;