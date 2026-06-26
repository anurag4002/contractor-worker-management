import React from "react";

import { FiCalendar, FiUsers } from "react-icons/fi";

import dashboardData from "./Dashboard.data.json";

import StatCard from "../../components/statcard/StatCard";

import Attendance from "../attendance/Attendance";
import Workers from "../workers/Workers";

import {
  DashboardContainer,
  HeroSection,
  HeroContent,
  HeroInfo,
  HeroImage,
  InfoCard,
  StatsGrid,
} from "./Dashboard.style";

const Dashboard = () => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardContainer>
      {/* ================= Hero Banner ================= */}

      <HeroSection>
        <HeroContent>
          <h5>👋 Welcome Back</h5>

          <h1>
            Contractor Worker
            <br />
            Management System
          </h1>

          <p>
            Manage workers, attendance, salaries,
            sites and reports from one centralized dashboard.
          </p>

          <HeroInfo>
            <InfoCard>
              <FiCalendar />

              <span>{today}</span>
            </InfoCard>

            <InfoCard>
              <FiUsers />

              <span>158 Active Workers</span>
            </InfoCard>
          </HeroInfo>
        </HeroContent>

        <HeroImage>👷</HeroImage>
      </HeroSection>

      {/* ================= Statistics ================= */}

      <StatsGrid>
        {dashboardData.stats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            change={item.change}
            icon={item.icon}
          />
        ))}
      </StatsGrid>

      {/* ================= Attendance ================= */}

      <Attendance />

      {/* ================= Workers ================= */}

      <Workers />
    </DashboardContainer>
  );
};

export default Dashboard;