import { useNavigate } from "react-router-dom";
import { FiCalendar, FiDownload } from "react-icons/fi";

import useWorkers from "../../hooks/useWorkers";
import StatCard from "../../components/statcard/StatCard";
import exportDashboardPDF from "../../utils/exportDashboardPDF";

import {
  DashboardContainer,
  DashboardHeader,
  HeaderLeft,
  HeaderRight,
  ExportButton,
  StatsGrid,
  DashboardGrid,
  Section,
  SectionTitle,
  QuickActions,
  ActionCard,
  ActionIcon,
  ActionTitle,
  List,
  ListItem,
  Badge,
} from "./Dashboard.style";

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    workers = [],
    sites = [],
    attendanceSummary = {},
    expenseReport = {},
  } = useWorkers();

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const activeSites = sites.filter(
    (site) => site.status === "Active"
  );

  const stats = [
    {
      title: "Total Workers",
      value: workers.length,
      description: "Registered Workers",
      icon: "FiUsers",
      progress: 100,
      route: "/workers",
    },
    {
      title: "Present Today",
      value: attendanceSummary.present || 0,
      description: "Today's Attendance",
      icon: "FiUserCheck",
      progress:
        attendanceSummary.attendancePercentage || 0,
      route: "/attendance",
    },
    {
      title: "Active Sites",
      value: activeSites.length,
      description: "Running Projects",
      icon: "FiCreditCard",
      progress: 100,
      route: "/sites",
    },
    {
      title: "Pending Salary",
      value: `₹${Number(
        expenseReport.totalBalance || 0
      ).toLocaleString("en-IN")}`,
      description: "Remaining Balance",
      icon: "FiDollarSign",
      progress: 100,
      route: "/salary",
    },
  ];

  const handleExport = () => {
    exportDashboardPDF({
      workers,
      attendanceSummary,
      expenseReport,
      activeSites,
    });
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderLeft>
          <h2>Dashboard</h2>
          <p>
            Contractor Worker Management System
          </p>
        </HeaderLeft>

        <HeaderRight>
          <FiCalendar />
          <span>{today}</span>

          <ExportButton
            type="button"
            onClick={handleExport}
          >
            <FiDownload />
            Export Report
          </ExportButton>
        </HeaderRight>
      </DashboardHeader>

      <StatsGrid>
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            icon={item.icon}
            progress={item.progress}
            onClick={() => navigate(item.route)}
          />
        ))}
      </StatsGrid>

      <DashboardGrid>
        <Section>
          <SectionTitle>
            Quick Actions
          </SectionTitle>

          <QuickActions>
            <ActionCard
              type="button"
              onClick={() => navigate("/workers")}
            >
              <ActionIcon>👷</ActionIcon>
              <ActionTitle>Add Worker</ActionTitle>
            </ActionCard>

            <ActionCard
              type="button"
              onClick={() => navigate("/attendance")}
            >
              <ActionIcon>📅</ActionIcon>
              <ActionTitle>Attendance</ActionTitle>
            </ActionCard>

            <ActionCard
              type="button"
              onClick={() => navigate("/salary")}
            >
              <ActionIcon>💰</ActionIcon>
              <ActionTitle>Salary</ActionTitle>
            </ActionCard>

            <ActionCard
              type="button"
              onClick={() => navigate("/sites")}
            >
              <ActionIcon>🏗</ActionIcon>
              <ActionTitle>Sites</ActionTitle>
            </ActionCard>
          </QuickActions>
        </Section>

        <Section>
          <SectionTitle>
            Today's Attendance
          </SectionTitle>

          <List>
            <ListItem
              onClick={() => navigate("/attendance")}
            >
              <span>Present</span>
              <Badge success>
                {attendanceSummary.present || 0}
              </Badge>
            </ListItem>

            <ListItem
              onClick={() => navigate("/attendance")}
            >
              <span>Absent</span>
              <Badge danger>
                {attendanceSummary.absent || 0}
              </Badge>
            </ListItem>

            <ListItem
              onClick={() => navigate("/attendance")}
            >
              <span>Leave</span>
              <Badge warning>
                {attendanceSummary.leave || 0}
              </Badge>
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            Salary Overview
          </SectionTitle>

          <List>
            <ListItem>
              <span>Gross Salary</span>
              <strong>
                ₹{Number(
                  expenseReport.totalGross || 0
                ).toLocaleString("en-IN")}
              </strong>
            </ListItem>

            <ListItem>
              <span>Advance Paid</span>
              <strong>
                ₹{Number(
                  expenseReport.totalAdvance || 0
                ).toLocaleString("en-IN")}
              </strong>
            </ListItem>

            <ListItem>
              <span>Salary Paid</span>
              <strong>
                ₹{Number(
                  expenseReport.totalPaid || 0
                ).toLocaleString("en-IN")}
              </strong>
            </ListItem>

            <ListItem>
              <span>Pending</span>
              <strong>
                ₹{Number(
                  expenseReport.totalBalance || 0
                ).toLocaleString("en-IN")}
              </strong>
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            Active Sites
          </SectionTitle>

          <List>
            {activeSites.length === 0 ? (
              <ListItem>
                No Active Site
              </ListItem>
            ) : (
              activeSites.map((site) => (
                <ListItem
                  key={
                    site.id ||
                    site._id ||
                    site.name
                  }
                  onClick={() => navigate("/sites")}
                >
                  {site.name}
                </ListItem>
              ))
            )}
          </List>
        </Section>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
