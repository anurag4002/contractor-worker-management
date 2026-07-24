import React, { useEffect, useState } from "react";
import useSites from "../../hooks/useSites";

import WorkerReport from "../../components/reports/WorkerReport";
import AttendanceReport from "../../components/reports/AttendanceReport";
import PayrollReport from "../../components/reports/PayrollReport";
import SiteReport from "../../components/reports/SiteReport";
import DashboardReport from "../../components/reports/DashboardReport";
import ExportPanel from "../../components/reports/ExportPanel";

import {
  ReportsContainer,
  Header,
  TitleSection,
  ActionSection,
  Section,
  Card,
} from "./Reports.style";

const TABS = [
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "workers", label: "👷 Workers" },
  { id: "attendance", label: "📅 Attendance" },
  { id: "payroll", label: "💰 Payroll" },
  { id: "sites", label: "🏗 Sites" },
  { id: "export", label: "📥 Export" },
];

const tabStyle = (active) => ({
  padding: "0.65rem 1.35rem",
  border: "none",
  borderRadius: "0.65rem",
  background: active ? "#2563eb" : "#f1f5f9",
  color: active ? "#fff" : "#475569",
  fontWeight: active ? 700 : 500,
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "0.2s",
});

const Reports = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { sites, fetchSites } = useSites();

  useEffect(() => {
    if (!sites || sites.length === 0) fetchSites({ limit: 100 });
  }, []);

  const sitesData = Array.isArray(sites) ? sites : [];

  return (
    <ReportsContainer>
      <Header>
        <TitleSection>
          <h2>Reports</h2>
          <p>Worker, Attendance, Payroll & Site Reports from the backend</p>
        </TitleSection>
        <ActionSection>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                style={tabStyle(activeTab === t.id)}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </ActionSection>
      </Header>

      <Section>
        <Card>
          {activeTab === "dashboard" && <DashboardReport />}
          {activeTab === "workers" && <WorkerReport sites={sitesData} />}
          {activeTab === "attendance" && <AttendanceReport sites={sitesData} />}
          {activeTab === "payroll" && <PayrollReport sites={sitesData} />}
          {activeTab === "sites" && <SiteReport />}
          {activeTab === "export" && <ExportPanel />}
        </Card>
      </Section>
    </ReportsContainer>
  );
};

export default Reports;