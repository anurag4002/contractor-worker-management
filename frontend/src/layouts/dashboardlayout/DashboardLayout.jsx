import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiClock, FiXCircle, FiCreditCard } from "react-icons/fi";

import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

import {
  LayoutWrapper,
  ContentWrapper,
  MainContent,
  TrialBanner,
  TrialBannerContent,
  TrialBannerText,
  TrialBannerTitle,
  TrialBannerDescription,
  TrialBannerActions,
  TrialBannerButton,
  TrialBannerButtonSecondary,
} from "./DashboardLayout.style";

import { useSubscription } from "../../context/SubscriptionContext";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, isExpired, getDaysRemaining } = useSubscription();

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const showBanner = subscription && !isSuperAdmin;

  if (!showBanner) {
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
  }

  const expired = isExpired();
  const daysRemaining = getDaysRemaining();

  return (
    <LayoutWrapper>
      <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ContentWrapper>
        <Header toggleSidebar={toggleSidebar} />

        {subscription?.status === "TRIAL" && !expired && (
          <TrialBanner $expired={false}>
            <TrialBannerContent>
              <TrialBannerText>
                <TrialBannerTitle $expired={false}>
                  <FiClock /> 7-day free trial
                </TrialBannerTitle>
                <TrialBannerDescription>
                  {daysRemaining > 0
                    ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`
                    : "Trial ending soon"}
                </TrialBannerDescription>
              </TrialBannerText>
              <TrialBannerButton onClick={() => navigate("/subscription")}>
                View Subscription
              </TrialBannerButton>
            </TrialBannerContent>
          </TrialBanner>
        )}

        {expired && (
          <TrialBanner $expired={true}>
            <TrialBannerContent>
              <TrialBannerText>
                <TrialBannerTitle $expired={true}>
                  <FiXCircle /> Your free trial has ended.
                </TrialBannerTitle>
                <TrialBannerDescription>
                  Subscribe now to continue using all features.
                </TrialBannerDescription>
              </TrialBannerText>
              <TrialBannerActions>
                <TrialBannerButton onClick={() => navigate("/checkout", { state: { billingCycle: "MONTHLY" } })}>
                  <FiCreditCard />
                  Subscribe Monthly — ₹2,499/mo
                </TrialBannerButton>
                <TrialBannerButtonSecondary onClick={() => navigate("/checkout", { state: { billingCycle: "YEARLY" } })}>
                  <FiCreditCard />
                  Subscribe Annual — ₹24,999/yr
                </TrialBannerButtonSecondary>
              </TrialBannerActions>
            </TrialBannerContent>
          </TrialBanner>
        )}

        <MainContent>
          <Outlet />
        </MainContent>
      </ContentWrapper>
    </LayoutWrapper>
  );
};

export default DashboardLayout;
