import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

import {
  LayoutWrapper,
  ContentWrapper,
  MainContent,
} from "./DashboardLayout.style";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <LayoutWrapper>

      <Sidebar sidebarOpen={sidebarOpen} />

      <ContentWrapper sidebarOpen={sidebarOpen}>

        <Header toggleSidebar={toggleSidebar} />

        <MainContent>

          <Outlet />

        </MainContent>

      </ContentWrapper>

    </LayoutWrapper>
  );
};

export default DashboardLayout;