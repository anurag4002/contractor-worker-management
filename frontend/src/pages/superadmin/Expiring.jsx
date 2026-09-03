import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiClock,
  FiCreditCard,
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
  FilterSelect,
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
  Pagination,
  PaginationButton,
  PaginationInfo,
} from "./Expiring.style";

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
    default:
      return <Badge>{status}</Badge>;
  }
};

const Expiring = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expiresWithin, setExpiresWithin] = useState(30);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role?.code !== "SUPER_ADMIN" && user?.role !== "SUPER_ADMIN") {
      navigate("/dashboard", { replace: true });
      return;
    }

    loadExpiring();
  }, [isAuthenticated, user, navigate, pagination.page, pagination.limit, expiresWithin]);

  const loadExpiring = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        expiresWithin,
        sortBy: "endDate",
        sortOrder: "asc",
      };

      const result = await platformService.getExpiringSubscriptions(params);
      setSubscriptions(result.subscriptions || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: result.pagination.totalPages,
        total: result.pagination.total,
      }));
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Expiring Subscriptions</PageTitle>
        <PageSubtitle>
          Subscriptions and trials expiring soon
        </PageSubtitle>
      </PageHeader>

      <Toolbar>
        <FilterSelect
          value={expiresWithin}
          onChange={(e) => {
            setExpiresWithin(Number(e.target.value));
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        >
          <option value={7}>Within 7 days</option>
          <option value={30}>Within 30 days</option>
          <option value={90}>Within 90 days</option>
        </FilterSelect>
        <ActionButton type="button" variant="secondary" onClick={loadExpiring}>
          <FiRefreshCw /> Refresh
        </ActionButton>
      </Toolbar>

      {loading ? (
        <LoadingState>
          <div className="loading-spinner" />
          <p>Loading expiring subscriptions...</p>
        </LoadingState>
      ) : error ? (
        <ErrorState>
          <FiAlertCircle size={48} color="#dc2626" />
          <h3>Failed to load expiring subscriptions</h3>
          <p>Please check your connection and try again.</p>
          <RetryButton onClick={loadExpiring}>
            <FiRefreshCw /> Retry
          </RetryButton>
        </ErrorState>
      ) : (
        <>
          <TableWrapper>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Company</TableHeaderCell>
                  <TableHeaderCell>Owner</TableHeaderCell>
                  <TableHeaderCell>Plan</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Billing</TableHeaderCell>
                  <TableHeaderCell>Expires</TableHeaderCell>
                  <TableHeaderCell>Days Left</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub._id}>
                    <TableCell>
                      <strong>{sub.tenant?.companyName || "—"}</strong>
                    </TableCell>
                    <TableCell>
                      {sub.tenant?.owner?.fullName || "—"}
                    </TableCell>
                    <TableCell>{sub.plan?.name || "—"}</TableCell>
                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                    <TableCell>
                      {sub.billingCycle === "MONTHLY"
                        ? "Monthly"
                        : sub.billingCycle === "YEARLY"
                        ? "Annual"
                        : "—"}
                    </TableCell>
                    <TableCell>{formatDate(sub.endDate)}</TableCell>
                    <TableCell>
                      <Badge
                        success={sub.daysRemaining > 14}
                        warning={sub.daysRemaining > 7 && sub.daysRemaining <= 14}
                        danger={sub.daysRemaining <= 7}
                      >
                        {sub.daysRemaining} days
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {subscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                      No expiring subscriptions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableWrapper>

          <Pagination>
            <PaginationInfo>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} subscriptions
            </PaginationInfo>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <PaginationButton
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </PaginationButton>
              <PaginationButton
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </PaginationButton>
            </div>
          </Pagination>
        </>
      )}
    </PageWrapper>
  );
};

export default Expiring;
