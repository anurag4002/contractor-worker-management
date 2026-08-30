import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiCreditCard,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

import platformService from "../../services/platform.service";
import { useAuth } from "../../context/AuthContext";

import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  Toolbar,
  SearchInput,
  SearchIcon,
  FilterSelect,
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
  Pagination,
  PaginationButton,
  PaginationInfo,
} from "./Payments.style";

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount, currency = "INR") => {
  if (amount === undefined || amount === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status) => {
  switch (status) {
    case "COMPLETED":
      return <Badge success>Successful</Badge>;
    case "PENDING":
      return <Badge warning>Pending</Badge>;
    case "FAILED":
      return <Badge danger>Failed</Badge>;
    case "REFUNDED":
      return <Badge>Refunded</Badge>;
    case "CANCELLED":
      return <Badge danger>Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const Payments = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [billingCycleFilter, setBillingCycleFilter] = useState("");
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

    if (user?.role !== "SUPER_ADMIN") {
      navigate("/dashboard", { replace: true });
      return;
    }

    loadPayments();
  }, [isAuthenticated, user, navigate, pagination.page, pagination.limit, search, statusFilter, billingCycleFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
        status: statusFilter || undefined,
        billingCycle: billingCycleFilter || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      const result = await platformService.getPayments(params);
      setPayments(result.payments || []);
      setSummary(result.summary || null);
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
        <PageTitle>Payments</PageTitle>
        <PageSubtitle>
          Monitor all subscription payments across the platform
        </PageSubtitle>
      </PageHeader>

      {summary && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <Badge success>Total Amount: {formatCurrency(summary.totalAmount)}</Badge>
          <Badge>Successful Payments: {summary.successfulPayments}</Badge>
        </div>
      )}

      <Toolbar>
        <form onSubmit={(e) => { e.preventDefault(); setPagination((prev) => ({ ...prev, page: 1 })); }} style={{ display: "flex", gap: "0.75rem", flex: 1, flexWrap: "wrap" }}>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by company or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Successful</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
            <option value="CANCELLED">Cancelled</option>
          </FilterSelect>
          <FilterSelect
            value={billingCycleFilter}
            onChange={(e) => {
              setBillingCycleFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <option value="">All Cycles</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Annual</option>
          </FilterSelect>
          <ActionButton type="submit">
            <FiFilter /> Filter
          </ActionButton>
          <ActionButton type="button" variant="secondary" onClick={loadPayments}>
            <FiRefreshCw /> Refresh
          </ActionButton>
        </form>
      </Toolbar>

      {loading ? (
        <LoadingState>
          <div className="loading-spinner" />
          <p>Loading payments...</p>
        </LoadingState>
      ) : error ? (
        <ErrorState>
          <FiAlertCircle size={48} color="#dc2626" />
          <h3>Failed to load payments</h3>
          <p>Please try again.</p>
          <RetryButton onClick={loadPayments}>
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
                  <TableHeaderCell>Plan</TableHeaderCell>
                  <TableHeaderCell>Billing</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Order ID</TableHeaderCell>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      <strong>{payment.tenant?.companyName || "—"}</strong>
                    </TableCell>
                    <TableCell>
                      {payment.subscription?.plan?.name || "—"}
                    </TableCell>
                    <TableCell>
                      {payment.billingCycle === "MONTHLY"
                        ? "Monthly"
                        : payment.billingCycle === "YEARLY"
                        ? "Annual"
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <code>{payment.providerOrderId || "—"}</code>
                    </TableCell>
                    <TableCell>
                      <code>{payment.providerPaymentId || "—"}</code>
                    </TableCell>
                    <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                      No payments found.
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
              {pagination.total} payments
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

export default Payments;
