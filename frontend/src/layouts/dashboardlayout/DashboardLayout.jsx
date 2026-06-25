import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

import {
  LayoutWrapper,
  ContentWrapper,
  MainContent,
} from "./DashboardLayout.style";

const DashboardLayout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Sidebar />

      <ContentWrapper>
        <Header />

        <MainContent>
          {children}
        </MainContent>
      </ContentWrapper>
    </LayoutWrapper>
  );
};

export default DashboardLayout;