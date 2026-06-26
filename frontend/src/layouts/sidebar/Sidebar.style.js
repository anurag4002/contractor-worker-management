import styled from "styled-components";

export const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;

  width: ${({ $sidebarOpen }) =>
    $sidebarOpen ? "16rem" : "5rem"};

  height: 100vh;

  background: #0f172a;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  overflow: hidden;

  transition: all 0.35s ease;

  z-index: 1000;

  border-right: 1px solid rgba(255,255,255,.08);

  @media (max-width:768px){
    transform: ${({ $sidebarOpen }) =>
      $sidebarOpen
        ? "translateX(0)"
        : "translateX(-100%)"};

    width:16rem;
  }
`;

export const TopSection = styled.div`
  display:flex;
  flex-direction:column;
`;

export const LogoSection = styled.div`
  height:5rem;

  display:flex;
  align-items:center;

  padding:0 1.4rem;

  border-bottom:1px solid rgba(255,255,255,.08);
`;

export const LogoIcon = styled.div`
  width:2.8rem;
  height:2.8rem;

  border-radius:.8rem;

  background:#2563EB;

  display:flex;
  justify-content:center;
  align-items:center;

  color:white;

  font-size:1.2rem;
  font-weight:700;

  flex-shrink:0;
`;

export const LogoText = styled.div`
  margin-left:1rem;

  display:${({ $sidebarOpen }) =>
    $sidebarOpen ? "block" : "none"};

  h2{
    margin:0;
    color:white;
    font-size:1.05rem;
  }

  p{
    margin:.2rem 0 0;
    color:#94A3B8;
    font-size:.78rem;
  }
`;

export const Menu = styled.ul`
  list-style:none;

  padding:1rem;

  margin:0;

  display:flex;
  flex-direction:column;

  gap:.45rem;
`;

export const MenuItem = styled.li`
  width:100%;
`;

export const MenuButton = styled.button`
  width:100%;

  border:none;
  outline:none;

  background:${({ $active }) =>
    $active ? "#2563EB" : "transparent"};

  color:${({ $active }) =>
    $active ? "#ffffff" : "#CBD5E1"};

  border-radius:.9rem;

  padding:.95rem 1rem;

  display:flex;
  align-items:center;

  gap:1rem;

  cursor:pointer;

  transition:.3s;

  &:hover{
    background:#1E293B;
    color:white;
  }

  svg{
    font-size:1.25rem;
    min-width:1.25rem;
  }

  span{
    display:${({ $sidebarOpen }) =>
      $sidebarOpen ? "block" : "none"};

    white-space:nowrap;

    font-size:.95rem;

    font-weight:500;
  }
`;

export const BottomSection = styled.div`
  padding:1rem;

  border-top:1px solid rgba(255,255,255,.08);
`;

export const UserCard = styled.div`
  display:flex;
  align-items:center;

  gap:.8rem;

  padding:.8rem;

  border-radius:.9rem;

  background:rgba(255,255,255,.05);
`;

export const Avatar = styled.div`
  width:2.8rem;
  height:2.8rem;

  border-radius:50%;

  background:#2563EB;

  display:flex;
  justify-content:center;
  align-items:center;

  color:white;

  font-weight:700;

  flex-shrink:0;
`;

export const UserInfo = styled.div`
  display:${({ $sidebarOpen }) =>
    $sidebarOpen ? "block" : "none"};

  h4{
    margin:0;
    color:white;
    font-size:.9rem;
  }

  p{
    margin:.2rem 0 0;
    color:#94A3B8;
    font-size:.75rem;
  }
`;

export const LogoutButton = styled.button`
  width:100%;

  margin-top:1rem;

  border:none;

  background:#DC2626;

  color:white;

  padding:.85rem;

  border-radius:.8rem;

  cursor:pointer;

  font-weight:600;

  transition:.3s;

  &:hover{
    background:#B91C1C;
  }
`;