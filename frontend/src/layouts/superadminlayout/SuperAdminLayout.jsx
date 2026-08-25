import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../layouts/sidebar/Sidebar";
import Header from "../../layouts/header/Header";

import {
  LayoutWrapper,
  ContentWrapper,
  MainContent,
} from "./SuperAdminLayout.style";

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <LayoutWrapper>
      <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ContentWrapper>
        <Header toggleSidebar={toggleSidebar} />
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentWrapper>
    </LayoutWrapper>
  );
};

export default SuperAdminLayout;
