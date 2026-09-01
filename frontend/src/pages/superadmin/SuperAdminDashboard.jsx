import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiCreditCard,
  FiXCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";

import platformService from "../../services/platform.service";
import { useAuth } from "../../context/AuthContext";

import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  StatsGrid,
  StatCard,
  StatCardIcon,
  StatCardTitle,
  StatCardValue,
  StatCardDescription,
  LoadingState,
  ErrorState,
  RetryButton,
  Section,
  SectionTitle,
  TableWrapper,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  RecentSection,
} from "./SuperAdminDashboard.style";

const formatNumber = (value) => {
  if (value === undefined || value === null) return "0";
  return Number(value).toLocaleString("en-IN");
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "₹0";
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statConfig = [
  {
    key: "totalContractors",
    title: "Total Organizations",
    icon: FiUsers,
    color: "#3b82f6",
    description: "Registered contractors",
  },
  {
    key: "activeTrials",
    title: "Active Trials",
    icon: FiClock,
    color: "#f59e0b",
    description: "Currently on trial",
  },
  {
    key: "trialsExpiringSoon",
    title: "Trials Expiring Soon",
    icon: FiAlertCircle,
    color: "#ef4444",
    description: "Expiring within 30 days",
  },
  {
    key: "activeSubscriptions",
    title: "Active Subscriptions",
    icon: FiCheckCircle,
    color: "#22c55e",
    description: "Paying contractors",
  },
  {
    key: "monthlySubscribers",
    title: "Monthly Subscribers",
    icon: FiCreditCard,
    color: "#8b5cf6",
    description: "Monthly billing",
  },
  {
    key: "yearlySubscribers",
    title: "Annual Subscribers",
    icon: FiTrendingUp,
    color: "#06b6d4",
    description: "Annual billing",
  },
  {
    key: "expiredSubscriptions",
    title: "Expired Subscriptions",
    icon: FiXCircle,
    color: "#ef4444",
    description: "Trial or plan expired",
  },
  {
    key: "paymentFailed",
    title: "Payment Failed",
    icon: FiAlertCircle,
    color: "#ef4444",
    description: "Requires attention",
  },
  {
    key: "cancelledSubscriptions",
    title: "Cancelled Subscriptions",
    icon: FiXCircle,
    color: "#94a3b8",
    description: "Cancelled plans",
  },
  {
    key: "totalRevenue",
    title: "Total Revenue",
    icon: FiDollarSign,
    color: "#10b981",
    description: "All-time successful payments",
  },
  {
    key: "monthlyRevenue",
    title: "This Month Revenue",
    icon: FiActivity,
    color: "#3b82f6",
    description: "Revenue this month",
  },
  {
    key: "annualRevenue",
    title: "This Year Revenue",
    icon: FiTrendingUp,
    color: "#8b5cf6",
    description: "Revenue this year",
  },
  {
    key: "expiringSoon",
    title: "Expiring Soon",
    icon: FiAlertCircle,
    color: "#f59e0b",
    description: "Subscriptions expiring within 30 days",
  },
];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await platformService.getPlatformDashboard();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role !== "SUPER_ADMIN") {
      navigate("/dashboard", { replace: true });
      return;
    }

    loadDashboard();
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <LoadingState>
        <div className="loading-spinner" />
        <p>Loading platform dashboard...</p>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState>
        <FiAlertCircle size={48} color="#dc2626" />
        <h3>Failed to load dashboard</h3>
        <p>Please check your connection and try again.</p>
        <RetryButton onClick={loadDashboard}>
          <FiRefreshCw /> Retry
        </RetryButton>
      </ErrorState>
    );
  }

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Platform Dashboard</PageTitle>
        <PageSubtitle>
          Overview of all contractors and subscription metrics
        </PageSubtitle>
      </PageHeader>

      <StatsGrid>
        {statConfig.map((stat) => (
          <StatCard
            key={stat.key}
            onClick={() => {
              if (
                stat.key === "activeTrials" ||
                stat.key === "activeSubscriptions" ||
                stat.key === "expiredSubscriptions" ||
                stat.key === "paymentFailed" ||
                stat.key === "cancelledSubscriptions" ||
                stat.key === "expiringSoon"
              ) {
                navigate("/super-admin/contractors", {
                  state: { filter: stat.key },
                });
              }
            }}
          >
            <StatCardIcon color={stat.color}>
              <stat.icon />
            </StatCardIcon>
            <StatCardTitle>{stat.title}</StatCardTitle>
            <StatCardValue>
              {stat.key.includes("Revenue")
                ? formatCurrency(stats?.[stat.key])
                : formatNumber(stats?.[stat.key])}
            </StatCardValue>
            <StatCardDescription>{stat.description}</StatCardDescription>
          </StatCard>
        ))}
      </StatsGrid>

      {stats?.recentUsers && stats.recentUsers.length > 0 && (
        <RecentSection>
          <SectionTitle>
            <FiUsers /> Recent Registrations
          </SectionTitle>
          <TableWrapper>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Mobile</TableHeaderCell>
                  <TableHeaderCell>Registered</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {stats.recentUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <strong>{user.fullName}</strong>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </RecentSection>
      )}

      {stats?.recentPayments && stats.recentPayments.length > 0 && (
        <RecentSection>
          <SectionTitle>
            <FiCreditCard /> Recent Payments
          </SectionTitle>
          <TableWrapper>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Company</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Billing</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {stats.recentPayments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      <strong>{payment.tenant?.companyName || "—"}</strong>
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      {payment.billingCycle === "MONTHLY"
                        ? "Monthly"
                        : payment.billingCycle === "YEARLY"
                        ? "Annual"
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge success={payment.status === "COMPLETED"} danger={payment.status === "FAILED"}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </RecentSection>
      )}
    </PageWrapper>
  );
};

export default SuperAdminDashboard;
