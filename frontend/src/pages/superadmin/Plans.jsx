import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";

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
  FeaturesList,
  FeatureItem,
  FeatureIcon,
  FeatureText,
} from "./Plans.style";

const Plans = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role !== "SUPER_ADMIN") {
      navigate("/dashboard", { replace: true });
      return;
    }

    loadPlans();
  }, [isAuthenticated, user, navigate]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/subscription-plans`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setPlans(result.data || []);
      } else {
        throw new Error(result.message || "Failed to load plans");
      }
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
        <PageTitle>Subscription Plans</PageTitle>
        <PageSubtitle>
          Manage available subscription plans
        </PageSubtitle>
      </PageHeader>

      <Toolbar>
        <ActionButton type="button" variant="secondary" onClick={loadPlans}>
          <FiRefreshCw /> Refresh
        </ActionButton>
      </Toolbar>

      {loading ? (
        <LoadingState>
          <div className="loading-spinner" />
          <p>Loading plans...</p>
        </LoadingState>
      ) : error ? (
        <ErrorState>
          <FiAlertCircle size={48} color="#dc2626" />
          <h3>Failed to load plans</h3>
          <p>Please try again.</p>
          <RetryButton onClick={loadPlans}>
            <FiRefreshCw /> Retry
          </RetryButton>
        </ErrorState>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Plan</TableHeaderCell>
                <TableHeaderCell>Code</TableHeaderCell>
                <TableHeaderCell>Monthly</TableHeaderCell>
                <TableHeaderCell>Annual</TableHeaderCell>
                <TableHeaderCell>Features</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>
                    <strong>{plan.name}</strong>
                  </TableCell>
                  <TableCell>{plan.code}</TableCell>
                  <TableCell>₹{plan.pricing?.monthly?.toLocaleString("en-IN") || "—"}</TableCell>
                  <TableCell>₹{plan.pricing?.annual?.toLocaleString("en-IN") || "—"}</TableCell>
                  <TableCell>
                    <FeaturesList>
                      {(plan.features || []).slice(0, 3).map((feature) => (
                        <FeatureItem key={feature}>
                          <FeatureIcon>
                            <FiCheck />
                          </FeatureIcon>
                          <FeatureText>{feature}</FeatureText>
                        </FeatureItem>
                      ))}
                      {(plan.features || []).length > 3 && (
                        <FeatureItem>
                          <FeatureText>+{(plan.features || []).length - 3} more</FeatureText>
                        </FeatureItem>
                      )}
                    </FeaturesList>
                  </TableCell>
                  <TableCell>
                    <Badge success={plan.status === "ACTIVE"} danger={plan.status === "INACTIVE"}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {plans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                    No plans found.
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

export default Plans;
