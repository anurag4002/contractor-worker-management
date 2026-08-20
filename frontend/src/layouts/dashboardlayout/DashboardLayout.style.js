import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg);
`;

export const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg);
`;

export const MainContent = styled.main`
  flex: 1;
  padding: var(--content-padding);
  background: var(--bg);
  min-width: 0;
`;