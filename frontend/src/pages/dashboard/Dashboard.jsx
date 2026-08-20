import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiDownload, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { showError } from "../../components/common/toast";

import dashboardService from "../../services/dashboard.service";
import useAttendance from "../../hooks/useAttendance";
import DashboardCharts from "../../components/dashboardcharts/DashboardCharts";
import StatCard from "../../components/statcard/StatCard";
import exportDashboardPDFFn from "../../utils/exportDashboardPDF";
import { useSearch } from "../../context/SearchContext";

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
  HelperText,
} from "./Dashboard.style";

const Dashboard = () => {
  const navigate = useNavigate();

  const { attendanceRecords } = useAttendance();
  const { searchQuery, searchResults, isLoading } = useSearch();

  const [dashboard, setDashboard] = useState(null);
  const [recentWorkers, setRecentWorkers] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentPayroll, setRecentPayroll] = useState([]);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

      setDashboard(dashboardRes || {});
      setRecentWorkers(workersRes || []);
      setRecentAttendance(attendanceRes || []);
      setRecentPayroll(payrollRes || []);
      setCharts(chartsRes || {});
    } catch (err) {
      console.error(err);
      setError(true);
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const hasSearchQuery = searchQuery && searchQuery.trim() !== "";

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (attendanceRecords && attendanceRecords.length > 0 && !hasSearchQuery) {
      loadDashboard();
    }
  }, [attendanceRecords, hasSearchQuery]);

  // Search results view (independent of dashboard data)
  if (hasSearchQuery && !loading) {
    return (
      <DashboardContainer>
        <DashboardHeader>
          <HeaderLeft>
            <h2>Search Results</h2>
            <p>Showing results for "{searchQuery}"</p>
          </HeaderLeft>
        </DashboardHeader>
        {isLoading ? (
          <div style={{ padding: "var(--content-padding)", textAlign: "center", color: "var(--text-secondary)" }}>
            Searching…
          </div>
        ) : searchResults.length === 0 ? (
          <div style={{ padding: "var(--content-padding)", textAlign: "center", color: "var(--text-secondary)" }}>
            No matching results found.
          </div>
        ) : (
          <DashboardGrid>
            {(() => {
              const grouped = searchResults.reduce((acc, result) => {
                const section = result.section || "Results";
                if (!acc[section]) {
                  acc[section] = [];
                }
                acc[section].push(result);
                return acc;
              }, {});

              return Object.entries(grouped).map(([section, items]) => (
                <Section key={section}>
                  <SectionTitle>{section}</SectionTitle>
                  <List>
                    {items.map((result) => (
                      <ListItem
                        key={`${result.type}-${result.data?._id || result.title}`}
                        onClick={() => navigate(result.route)}
                      >
                        <div>
                          <strong>{result.title}</strong>
                          <br />
                          <small>{result.subtitle}</small>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </Section>
              ));
            })()}
          </DashboardGrid>
        )}
      </DashboardContainer>
    );
  }

  // Loading state - MUST come before any data access
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 24rem), 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <SkeletonBlock height="22rem" radius="1rem" />
          <SkeletonBlock height="22rem" radius="1rem" />
          <SkeletonBlock height="22rem" radius="1rem" />
        </div>
      </DashboardContainer>
    );
  }

  // Error or no-data state
  if (error || !dashboard) {
    return (
      <DashboardContainer>
        <ErrorContainer>
          <FiAlertCircle size={48} color="#dc2626" />
          <ErrorTitle>Failed to load Dashboard</ErrorTitle>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Please check your configuration or try again.</p>
          <RetryButton onClick={loadDashboard}>
            <FiRefreshCw /> Retry Connection
          </RetryButton>
        </ErrorContainer>
      </DashboardContainer>
    );
  }

  // ==========================================
  // ALL data-dependent computations AFTER guards
  // ==========================================
  const presentCount = dashboard.attendance?.present || 0;
  const absentCount = dashboard.attendance?.absent || 0;
  const leaveCount = dashboard.attendance?.leave || 0;
  const halfDayCount = dashboard.attendance?.halfDay || 0;
  const holidayCount = dashboard.attendance?.holiday || 0;

  const handleExport = () => {
    if (!dashboard) return;
    exportDashboardPDFFn(dashboard);
  };

  const stats = [
    {
      title: "Total Workers",
      value: dashboard.workers?.total || 0,
      description: "Registered Workers",
      route: "/workers",
    },
    {
      title: "Active Workers",
      value: dashboard.workers?.active || 0,
      description: "Currently Active",
      route: "/workers",
    },
    {
      title: "Present Today",
      value: presentCount,
      description: "Today's Attendance",
      route: "/attendance",
    },
    {
      title: "Active Sites",
      value: dashboard.sites?.active || 0,
      description: "Running Sites",
      route: "/sites",
    },
    {
      title: "Pending Salary",
      value: `₹${Number(
        dashboard.payroll?.pendingSalary || 0
      ).toLocaleString("en-IN")}`,
      description: "Pending Payroll",
      route: "/salary",
    },
  ];

  const hasAttendance = presentCount > 0 || absentCount > 0 || leaveCount > 0 || halfDayCount > 0 || holidayCount > 0;

  const attendanceChart = charts?.attendanceChart || [];
  const payrollChart = charts?.payrollStatusChart || [];
  const siteWorkersChart = charts?.siteWorkerChart || [];

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
        <StatCard
          title="Holiday"
          value={holidayCount}
          description="Today's Holidays"
          route="/attendance"
        />
      </StatsGrid>

      <DashboardCharts
        attendanceChart={attendanceChart}
        payrollChart={payrollChart}
        siteWorkersChart={siteWorkersChart}
      />

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

          {!hasAttendance ? (
            <List>
              <ListItem>
                <HelperText>No attendance has been recorded today.</HelperText>
              </ListItem>
            </List>
          ) : (
            <List>

              <ListItem>
                <span>Present</span>

                <Badge success>
                  {presentCount}
                </Badge>
              </ListItem>

              <ListItem>
                <span>Absent</span>

                <Badge danger>
                  {absentCount}
                </Badge>
              </ListItem>

              <ListItem>
                <span>Leave</span>

                <Badge warning>
                  {leaveCount}
                </Badge>
              </ListItem>

              <ListItem>
                <span>Half Day</span>

                <Badge>
                  {halfDayCount}
                </Badge>
              </ListItem>

              <ListItem>
                <span>Holiday</span>

                <Badge holiday>
                  {holidayCount}
                </Badge>
              </ListItem>

            </List>
          )}

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
