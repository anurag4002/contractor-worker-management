import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiDownload, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { showError, showSuccess } from "../../components/common/toast";

import dashboardService from "../../services/dashboard.service";
import DashboardCharts from "../../components/dashboardcharts/DashboardCharts";
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
  SkeletonBlock,
  ErrorContainer,
  ErrorTitle,
  RetryButton,
} from "./Dashboard.style";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [recentWorkers, setRecentWorkers] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentPayroll, setRecentPayroll] = useState([]);
  const [chartsData, setChartsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(false);
      const [
        dashboardRes,
        workersRes,
        attendanceRes,
        payrollRes,
        chartsRes,
      ] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getRecentWorkers(),
        dashboardService.getRecentAttendance(),
        dashboardService.getRecentPayroll(),
        dashboardService.getCharts(),
      ]);

      setDashboard(dashboardRes.data);
      setRecentWorkers(workersRes.data || []);
      setRecentAttendance(attendanceRes.data || []);
      setRecentPayroll(payrollRes.data || []);
      setChartsData(chartsRes.data || null);
    } catch (err) {
      console.error(err);
      setError(true);
      showError(
        err.response?.data?.message ||
        "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportDashboardPDF({
      dashboard,
      recentWorkers,
      recentAttendance,
      recentPayroll,
    });
  };

  if (loading) {
    return (
      <DashboardContainer>
        <DashboardHeader>
          <HeaderLeft>
            <h2>Dashboard</h2>
            <p>Contractor Worker Management System</p>
          </HeaderLeft>
          <HeaderRight>
            <FiCalendar />
            <span>{today}</span>
            <ExportButton disabled style={{ opacity: 0.5 }}>
              <FiDownload /> Export Report
            </ExportButton>
          </HeaderRight>
        </DashboardHeader>
        <StatsGrid>
          {[1, 2, 3, 4, 5].map(i => <SkeletonBlock key={i} height="8rem" />)}
        </StatsGrid>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(24rem, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <SkeletonBlock height="22rem" radius="1rem" />
          <SkeletonBlock height="22rem" radius="1rem" />
          <SkeletonBlock height="22rem" radius="1rem" />
        </div>
      </DashboardContainer>
    );
  }

  if (error || !dashboard) {
    return (
      <DashboardContainer>
        <ErrorContainer>
          <FiAlertCircle size={48} color="#dc2626" />
          <ErrorTitle>Failed to load Dashboard</ErrorTitle>
          <p style={{ color: '#64748b', margin: 0 }}>Please check your configuration or try again.</p>
          <RetryButton onClick={loadDashboard}>
            <FiRefreshCw /> Retry Connection
          </RetryButton>
        </ErrorContainer>
      </DashboardContainer>
    );
  }

  const stats = [
    {
      title: "Total Workers",
      value: dashboard.workers.total,
      description: "Registered Workers",
      route: "/workers",
    },
    {
      title: "Active Workers",
      value: dashboard.workers.active,
      description: "Currently Active",
      route: "/workers",
    },
    {
      title: "Present Today",
      value: dashboard.attendance.present,
      description: "Today's Attendance",
      route: "/attendance",
    },
    {
      title: "Active Sites",
      value: dashboard.sites.active,
      description: "Running Sites",
      route: "/sites",
    },
    {
      title: "Pending Salary",
      value: `₹${Number(
        dashboard.payroll.pendingSalary
      ).toLocaleString("en-IN")}`,
      description: "Pending Payroll",
      route: "/salary",
    },
  ];

  return (
    <DashboardContainer>

      <DashboardHeader>
        <HeaderLeft>
          <h2>Dashboard</h2>
          <p>Contractor Worker Management System</p>
        </HeaderLeft>

        <HeaderRight>
          <FiCalendar />
          <span>{today}</span>

          <ExportButton onClick={handleExport}>
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
            onClick={() => navigate(item.route)}
          />
        ))}
      </StatsGrid>

      <DashboardCharts chartsData={chartsData} />

      <DashboardGrid>

        <Section>
          <SectionTitle>
            Quick Actions
          </SectionTitle>

          <QuickActions>

            <ActionCard
              onClick={() =>
                navigate("/workers")
              }
            >
              <ActionIcon>👷</ActionIcon>
              <ActionTitle>
                Workers
              </ActionTitle>
            </ActionCard>

            <ActionCard
              onClick={() =>
                navigate("/attendance")
              }
            >
              <ActionIcon>📅</ActionIcon>
              <ActionTitle>
                Attendance
              </ActionTitle>
            </ActionCard>

            <ActionCard
              onClick={() =>
                navigate("/salary")
              }
            >
              <ActionIcon>💰</ActionIcon>
              <ActionTitle>
                Payroll
              </ActionTitle>
            </ActionCard>

            <ActionCard
              onClick={() =>
                navigate("/sites")
              }
            >
              <ActionIcon>🏗️</ActionIcon>
              <ActionTitle>
                Sites
              </ActionTitle>
            </ActionCard>

          </QuickActions>
        </Section>

        <Section>

          <SectionTitle>
            Today's Attendance
          </SectionTitle>

          <List>

            <ListItem>
              <span>Present</span>

              <Badge success>
                {dashboard.attendance.present}
              </Badge>
            </ListItem>

            <ListItem>
              <span>Absent</span>

              <Badge danger>
                {dashboard.attendance.absent}
              </Badge>
            </ListItem>

            <ListItem>
              <span>Leave</span>

              <Badge warning>
                {dashboard.attendance.leave}
              </Badge>
            </ListItem>

            <ListItem>
              <span>Half Day</span>

              <Badge>
                {dashboard.attendance.halfDay}
              </Badge>
            </ListItem>

          </List>

        </Section>
        <Section>
          <SectionTitle>
            Recent Workers
          </SectionTitle>

          <List>
            {recentWorkers.length === 0 ? (
              <ListItem>
                No workers found.
              </ListItem>
            ) : (
              recentWorkers.map((worker) => (
                <ListItem
                  key={worker._id}
                  onClick={() =>
                    navigate("/workers")
                  }
                >
                  <div>
                    <strong>
                      {worker.fullName}
                    </strong>
                    <br />
                    <small>
                      {worker.employeeCode}
                    </small>
                  </div>

                  <Badge success>
                    {worker.status}
                  </Badge>
                </ListItem>
              ))
            )}
          </List>
        </Section>

        <Section>
          <SectionTitle>
            Recent Attendance
          </SectionTitle>

          <List>
            {recentAttendance.length === 0 ? (
              <ListItem>
                No attendance found.
              </ListItem>
            ) : (
              recentAttendance.map((item) => (
                <ListItem
                  key={item._id}
                  onClick={() =>
                    navigate("/attendance")
                  }
                >
                  <div>
                    <strong>
                      {item.worker?.fullName ||
                        "Unknown Worker"}
                    </strong>
                    <br />
                    <small>
                      {item.site?.siteName ||
                        "No Site"}
                    </small>
                  </div>

                  <Badge
                    success={
                      item.status === "PRESENT"
                    }
                    danger={
                      item.status === "ABSENT"
                    }
                    warning={
                      item.status === "LEAVE"
                    }
                  >
                    {item.status}
                  </Badge>
                </ListItem>
              ))
            )}
          </List>
        </Section>

        <Section>
          <SectionTitle>
            Recent Payroll
          </SectionTitle>

          <List>
            {recentPayroll.length === 0 ? (
              <ListItem>
                No payroll found.
              </ListItem>
            ) : (
              recentPayroll.map((item) => (
                <ListItem
                  key={item._id}
                  onClick={() =>
                    navigate("/salary")
                  }
                >
                  <div>
                    <strong>
                      {item.worker?.fullName ||
                        "Unknown Worker"}
                    </strong>
                    <br />
                    <small>
                      {item.site?.siteName ||
                        "No Site"}
                    </small>
                  </div>

                  <strong>
                    ₹
                    {Number(
                      item.netSalary || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
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