import styled from "styled-components";
import { COLORS } from "../../constants/Colors";

export const LayoutWrapper = styled.div`
  display: flex;
`;

export const ContentWrapper = styled.div`
  flex: 1;
`;

export const MainContent = styled.main`
  min-height: calc(100vh - 80px);
  background: ${COLORS.background};
  padding: 2rem;
`;