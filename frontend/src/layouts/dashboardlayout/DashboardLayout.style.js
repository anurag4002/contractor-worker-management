import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;

  min-height: 100vh;

  background: #f8fafc;
`;

export const ContentWrapper = styled.div`
  flex: 1;

  margin-left: ${({ sidebarOpen }) =>
    sidebarOpen ? "16rem" : "5rem"};
  transition: margin-left 0.35s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const MainContent = styled.main`
  flex: 1;

  padding: 2rem;

  background: #f8fafc;

  overflow-y: auto;
`;