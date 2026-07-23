import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

export const ContentWrapper = styled.div`
  flex: 1;

  min-width: 0;

  margin-left: ${({ sidebarOpen }) =>
    sidebarOpen ? "16rem" : "5rem"};

  transition: margin-left .35s ease;

  display: flex;
  flex-direction: column;

  overflow-x: hidden;

  @media (max-width:768px){
    margin-left:0;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  min-height: 0;
  padding: 2rem;
  background: #f8fafc;
  overflow-x: hidden;
  overflow-y: auto;
`;
