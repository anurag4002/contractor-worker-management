import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiFilter,
  FiAlertCircle,
  FiUsers,
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
  EmptyState,
  LoadingState,
  ErrorState,
  Pagination,
  PaginationButton,
  PaginationInfo,
} from "./Contractors.style";

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
    case "NONE":
      return <Badge>No Subscription</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const Contractors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
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

    const filter = location.state?.filter;
    if (filter) {
      setSubscriptionFilter(filter);
    }

    loadTenants();
  }, [isAuthenticated, user, navigate, pagination.page, pagination.limit, search, statusFilter, subscriptionFilter]);

  const loadTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
        status: statusFilter || undefined,
        subscriptionStatus: subscriptionFilter || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      const result = await platformService.getTenants(params);
      setTenants(result.tenants);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getBillingCycleLabel = (cycle) => {
    switch (cycle) {
      case "MONTHLY":
        return "Monthly";
      case "YEARLY":
        return "Annual";
      default:
        return "—";
    }
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Contractors</PageTitle>
        <PageSubtitle>
          Manage and monitor all registered contractors
        </PageSubtitle>
      </PageHeader>

      <Toolbar>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", flex: 1, flexWrap: "wrap" }}>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search contractors..."
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
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
          </FilterSelect>
          <FilterSelect
            value={subscriptionFilter}
            onChange={(e) => {
              setSubscriptionFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <option value="">All Subscriptions</option>
            <option value="TRIAL">Trial</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="PAYMENT_FAILED">Payment Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </FilterSelect>
          <ActionButton type="submit">
            <FiFilter /> Filter
          </ActionButton>
          <ActionButton type="button" variant="secondary" onClick={loadTenants}>
            <FiRefreshCw /> Refresh
          </ActionButton>
        </form>
      </Toolbar>

      {loading ? (
        <LoadingState>
          <div className="loading-spinner" />
          <p>Loading contractors...</p>
        </LoadingState>
      ) : error ? (
        <ErrorState>
          <FiAlertCircle size={48} color="#dc2626" />
          <h3>Failed to load contractors</h3>
          <p>Please check your connection and try again.</p>
          <RetryButton onClick={loadTenants}>
            <FiRefreshCw /> Retry
          </RetryButton>
        </ErrorState>
      ) : tenants.length === 0 ? (
        <EmptyState>
          <FiUsers size={48} color="#94a3b8" />
          <h3>No contractors found</h3>
          <p>Try adjusting your search or filters.</p>
        </EmptyState>
      ) : (
        <>
          <TableWrapper>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Company</TableHeaderCell>
                  <TableHeaderCell>Owner</TableHeaderCell>
                  <TableHeaderCell>Contact</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Subscription</TableHeaderCell>
                  <TableHeaderCell>Billing</TableHeaderCell>
                  <TableHeaderCell>Trial Ends</TableHeaderCell>
                  <TableHeaderCell>Subscription Ends</TableHeaderCell>
                  <TableHeaderCell>Created</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant._id}>
                    <TableCell>
                      <strong>{tenant.companyName}</strong>
                    </TableCell>
                    <TableCell>
                      {tenant.owner?.fullName || "—"}
                    </TableCell>
                    <TableCell>
                      <div>{tenant.email}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {tenant.mobileNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge success={tenant.status === "ACTIVE"} danger={tenant.status === "SUSPENDED"}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(tenant.subscriptionStatus)}</TableCell>
                    <TableCell>{getBillingCycleLabel(tenant.billingCycle)}</TableCell>
                    <TableCell>{formatDate(tenant.trialEnd)}</TableCell>
                    <TableCell>{formatDate(tenant.subscriptionEnd)}</TableCell>
                    <TableCell>{formatDate(tenant.createdAt)}</TableCell>
                    <TableCell>
                      <ActionButton
                        size="small"
                        onClick={() => navigate(`/super-admin/contractors/${tenant._id}`)}
                      >
                        <FiEye /> View
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          <Pagination>
            <PaginationInfo>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} contractors
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

export default Contractors;
