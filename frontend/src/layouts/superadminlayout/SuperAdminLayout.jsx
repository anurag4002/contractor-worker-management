import { useState } from "react";
import { Outlet } from "react-router-dom";

import SuperAdminSidebar from "./SuperAdminSidebar";

import {
  LayoutWrapper,
  ContentWrapper,
  MainContent,
  TopBar,
  TopBarTitle,
  TopBarToggle,
} from "./SuperAdminLayout.style";

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <LayoutWrapper>
      <SuperAdminSidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ContentWrapper>
        <TopBar>
          <TopBarToggle onClick={toggleSidebar}>
            ☰
          </TopBarToggle>
          <TopBarTitle>Platform Administration</TopBarTitle>
        </TopBar>
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentWrapper>
    </LayoutWrapper>
  );
};

export default SuperAdminLayout;
