import { useEffect, useState } from "react";
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

const MOBILE_QUERY = "(max-width: 768px)";

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia(MOBILE_QUERY);
    const handler = (e) => {
      if (e.matches) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    if (mq.matches) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <LayoutWrapper>
      <SuperAdminSidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ContentWrapper>
        <TopBar>
          <TopBarToggle onClick={toggleSidebar} aria-label="Toggle sidebar">
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
