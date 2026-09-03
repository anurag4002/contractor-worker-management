import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

import platformService from "../../services/platform.service";
import { useAuth } from "../../context/AuthContext";

import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  Toolbar,
  ActionButton,
  TableWrapper,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  LoadingState,
  ErrorState,
  RetryButton,
} from "./Subscriptions.style";

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusBadge = (status) => {
  switch (status) {
    case "ACTIVE":
      return <Badge success>Active</Badge>;
    case "TRIAL":
      return <Badge warning>Trial</Badge>;
    case "EXPIRED":
      return <Badge danger>Expired</Badge>;
    case "PAYMENT_FAILED":
      return <Badge danger>Payment Failed</Badge>;
    case "CANCELLED":
      return <Badge>Cancelled</Badge>;
    case "SUSPENDED":
      return <Badge danger>Suspended</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const Subscriptions = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role?.code !== "SUPER_ADMIN" && user?.role !== "SUPER_ADMIN") {
      navigate("/dashboard", { replace: true });
      return;
    }

    loadSubscriptions();
  }, [isAuthenticated, user, navigate]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await platformService.getTenants({});
      const tenants = data?.tenants || [];

      const subs = (tenants || []).map((tenant) => ({
        _id: tenant._id,
        companyName: tenant.companyName,
        createdAt: tenant.createdAt,
        status: tenant.status,
        plan: tenant.plan,
        billingCycle: tenant.billingCycle,
        subscriptionStatus: tenant.subscriptionStatus || "NONE",
        trialEndDate: tenant.trialEnd,
        endDate: tenant.subscriptionEnd,
        subscription: tenant.plan
          ? {
              plan: tenant.plan,
              billingCycle: tenant.billingCycle,
              status: tenant.subscriptionStatus,
              trialEndDate: tenant.trialEnd,
              endDate: tenant.subscriptionEnd,
            }
          : null,
      }));

      setSubscriptions(subs);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Subscriptions</PageTitle>
        <PageSubtitle>
          Monitor all contractor subscriptions across the platform
        </PageSubtitle>
      </PageHeader>

      <Toolbar>
        <ActionButton type="button" variant="secondary" onClick={loadSubscriptions}>
          <FiRefreshCw /> Refresh
        </ActionButton>
      </Toolbar>

      {loading ? (
        <LoadingState>
          <div className="loading-spinner" />
          <p>Loading subscriptions...</p>
        </LoadingState>
      ) : error ? (
        <ErrorState>
          <FiAlertCircle size={48} color="#dc2626" />
          <h3>Failed to load subscriptions</h3>
          <p>Please check your connection and try again.</p>
          <RetryButton onClick={loadSubscriptions}>
            <FiRefreshCw /> Retry
          </RetryButton>
        </ErrorState>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Contractor</TableHeaderCell>
                <TableHeaderCell>Plan</TableHeaderCell>
                <TableHeaderCell>Billing</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Trial Ends</TableHeaderCell>
                <TableHeaderCell>Current Period</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {subscriptions.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <strong>{item.companyName}</strong>
                  </TableCell>
                  <TableCell>
                    {item.plan?.name || (
                      item.subscriptionStatus === "TRIAL"
                        ? "Free Trial"
                        : "No active plan"
                    )}
                  </TableCell>
                  <TableCell>
                    {item.billingCycle === "MONTHLY"
                      ? "Monthly"
                      : item.billingCycle === "YEARLY"
                      ? "Annual"
                      : item.subscriptionStatus === "TRIAL"
                      ? "Trial"
                      : "Not subscribed"}
                  </TableCell>
                  <TableCell>
                    {item.subscriptionStatus === "NONE"
                      ? <Badge>No Subscription</Badge>
                      : getStatusBadge(item.subscriptionStatus)}
                  </TableCell>
                  <TableCell>{formatDate(item.trialEndDate)}</TableCell>
                  <TableCell>
                    {item.endDate
                      ? formatDate(item.endDate)
                      : "—"}
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
              {subscriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </PageWrapper>
  );
};

export default Subscriptions;
