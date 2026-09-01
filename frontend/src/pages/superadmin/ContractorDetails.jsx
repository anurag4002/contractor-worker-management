import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiUser,
  FiCreditCard,
  FiUsers,
  FiMapPin,
  FiShield,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

import platformService from "../../services/platform.service";
import { useAuth } from "../../context/AuthContext";

import {
  PageWrapper,
  BackButton,
  ContentGrid,
  Section,
  SectionTitle,
  SectionIcon,
  InfoRow,
  InfoLabel,
  InfoValue,
  Badge,
  StatsGrid,
  StatCard,
  StatCardIcon,
  StatCardTitle,
  StatCardValue,
  LoadingState,
  ErrorState,
  RetryButton,
} from "./ContractorDetails.style";

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getSubscriptionStatusBadge = (status) => {
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
    case "GRACE_PERIOD":
      return <Badge warning>Grace Period</Badge>;
    case "SUSPENDED":
      return <Badge danger>Suspended</Badge>;
    default:
      return <Badge>{status || "None"}</Badge>;
  }
};

const ContractorDetails = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [data, setData] = useState(null);
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

    loadTenantDetails();
  }, [isAuthenticated, user, tenantId, navigate]);

  const loadTenantDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await platformService.getTenantById(tenantId);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingState>
        <div className="loading-spinner" />
        <p>Loading contractor details...</p>
      </LoadingState>
    );
  }

  if (error || !data) {
    return (
      <ErrorState>
        <FiAlertCircle size={48} color="#dc2626" />
        <h3>Failed to load contractor details</h3>
        <p>{error?.message || "Contractor not found."}</p>
        <RetryButton onClick={loadTenantDetails}>
          <FiRefreshCw /> Retry
        </RetryButton>
      </ErrorState>
    );
  }

  const { tenant, subscription, usage } = data;

  return (
    <PageWrapper>
      <BackButton onClick={() => navigate("/super-admin/contractors")}>
        <FiArrowLeft /> Back to Contractors
      </BackButton>

      <ContentGrid>
        <Section>
          <SectionTitle>
            <SectionIcon>
              <FiBriefcase />
            </SectionIcon>
            Company Information
          </SectionTitle>
          <InfoRow>
            <InfoLabel>Company Name</InfoLabel>
            <InfoValue>{tenant.companyName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>
              <a href={`mailto:${tenant.email}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
                {tenant.email}
              </a>
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Mobile Number</InfoLabel>
            <InfoValue>{tenant.mobileNumber}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Address</InfoLabel>
            <InfoValue>
              {[tenant.address, tenant.city, tenant.district, tenant.state, tenant.pincode]
                .filter(Boolean)
                .join(", ") || "—"}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Status</InfoLabel>
            <InfoValue>
              <Badge success={tenant.status === "ACTIVE"} danger={tenant.status === "SUSPENDED"}>
                {tenant.status}
              </Badge>
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Created</InfoLabel>
            <InfoValue>{formatDate(tenant.createdAt)}</InfoValue>
          </InfoRow>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon>
              <FiUser />
            </SectionIcon>
            Owner Information
          </SectionTitle>
          <InfoRow>
            <InfoLabel>Full Name</InfoLabel>
            <InfoValue>{tenant.owner?.fullName || "—"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>
              <a href={`mailto:${tenant.owner?.email}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
                {tenant.owner?.email || "—"}
              </a>
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Mobile Number</InfoLabel>
            <InfoValue>{tenant.owner?.mobileNumber || "—"}</InfoValue>
          </InfoRow>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon>
              <FiCreditCard />
            </SectionIcon>
            Subscription Information
          </SectionTitle>

          {!subscription ? (
            <InfoRow>
              <InfoLabel>Subscription</InfoLabel>
              <InfoValue>
                <Badge>No Subscription</Badge>
              </InfoValue>
            </InfoRow>
          ) : (
            <>
              <InfoRow>
                <InfoLabel>Plan</InfoLabel>
                <InfoValue>{subscription.plan?.name || "—"}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Status</InfoLabel>
                <InfoValue>{getSubscriptionStatusBadge(subscription.status)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Billing Cycle</InfoLabel>
                <InfoValue>{subscription.billingCycle || "—"}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Pricing</InfoLabel>
                <InfoValue>
                  {subscription.billingCycle === "MONTHLY"
                    ? `₹${subscription.plan?.pricing?.monthly?.toLocaleString("en-IN") || "—"}/mo`
                    : subscription.billingCycle === "YEARLY"
                      ? `₹${subscription.plan?.pricing?.annual?.toLocaleString("en-IN") || "—"}/yr`
                      : "—"}
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Trial Start</InfoLabel>
                <InfoValue>{formatDate(subscription.trialStart)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Trial End</InfoLabel>
                <InfoValue>{formatDate(subscription.trialEndDate)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Subscription Start</InfoLabel>
                <InfoValue>{formatDate(subscription.startDate)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Subscription End</InfoLabel>
                <InfoValue>{formatDate(subscription.endDate)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Auto Renew</InfoLabel>
                <InfoValue>{subscription.autoRenew ? "Yes" : "No"}</InfoValue>
              </InfoRow>
            </>
          )}
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon>
              <FiShield />
            </SectionIcon>
            Usage Statistics
          </SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatCardIcon color="#3b82f6">
                <FiUsers />
              </StatCardIcon>
              <StatCardTitle>Workers</StatCardTitle>
              <StatCardValue>{usage?.workerCount || 0}</StatCardValue>
            </StatCard>
            <StatCard>
              <StatCardIcon color="#22c55e">
                <FiMapPin />
              </StatCardIcon>
              <StatCardTitle>Sites</StatCardTitle>
              <StatCardValue>{usage?.siteCount || 0}</StatCardValue>
            </StatCard>
            <StatCard>
              <StatCardIcon color="#f59e0b">
                <FiShield />
              </StatCardIcon>
              <StatCardTitle>Admins</StatCardTitle>
              <StatCardValue>{usage?.adminCount || 0}</StatCardValue>
            </StatCard>
          </StatsGrid>
        </Section>
      </ContentGrid>
    </PageWrapper>
  );
};

export default ContractorDetails;
