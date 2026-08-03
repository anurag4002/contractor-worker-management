import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiLoader, FiMail, FiPhone, FiMapPin, FiUser, FiShield, FiCalendar, FiClock } from "react-icons/fi";
import styled from "styled-components";

import workerService from "../../services/worker.service";

const Page = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
`;

const Card = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--primary) 0%, #38bdf8 100%);
  color: var(--text-on-primary);
  font-weight: 800;
  font-size: 1.4rem;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.6rem, 3vw, 2.3rem);
`;

const Subtitle = styled.p`
  margin: 0.35rem 0 0;
  color: var(--text-secondary);
`;

const StatusBadge = styled.span`
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: ${({ status }) => (status === "Active" ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)")};
  color: ${({ status }) => (status === "Active" ? "#15803d" : "#b91c1c")};
  font-size: 0.82rem;
  font-weight: 700;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldCard = styled.div`
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
`;

const FieldLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 700;
  margin-bottom: 0.45rem;
`;

const FieldValue = styled.div`
  color: var(--text);
  font-weight: 600;
  word-break: break-word;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.8rem;
`;

const Button = styled.button`
  border: none;
  border-radius: 0.9rem;
  padding: 0.9rem 1.25rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
`;

const SecondaryButton = styled(Button)`
  background: var(--border);
  color: var(--text);
`;

const PrimaryButton = styled(Button)`
  background: var(--primary);
  color: white;
`;

const EmptyState = styled.div`
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--danger);
`;

const getWorkerPayload = (payload) => payload?.data || payload?.worker || payload?.workerData || payload || {};
const valueOrDash = (value) => (value === undefined || value === null || value === "" ? "—" : value);
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const WorkerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorker = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await workerService.getWorkerById(id);
      const nextWorker = getWorkerPayload(response);
      setWorker(nextWorker);
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("Worker not found.");
      } else if (!err?.response && err?.message?.toLowerCase().includes("network")) {
        setError("Network Error. Unable to connect to server.");
      } else {
        setError("Something went wrong while loading worker details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadWorker();
    }
  }, [id]);

  const details = useMemo(() => {
    if (!worker) return [];

    return [
      { label: "Worker Name", value: valueOrDash(worker.name || worker.fullName), icon: <FiUser /> },
      { label: "Employee ID", value: valueOrDash(worker.employeeId || worker.employee_code || worker._id), icon: <FiShield /> },
      { label: "Mobile Number", value: valueOrDash(worker.mobile || worker.mobileNumber), icon: <FiPhone /> },
      { label: "Email", value: valueOrDash(worker.email), icon: <FiMail /> },
      { label: "Site", value: valueOrDash(worker.site || worker.siteName), icon: <FiMapPin /> },
      { label: "Department", value: valueOrDash(worker.department), icon: <FiShield /> },
      { label: "Role", value: valueOrDash(worker.role || worker.workType), icon: <FiUser /> },
      { label: "Status", value: valueOrDash(worker.status), icon: <FiShield /> },
      { label: "Joining Date", value: formatDate(worker.joiningDate || worker.joining_date), icon: <FiCalendar /> },
      { label: "Address", value: valueOrDash(worker.address), icon: <FiMapPin /> },
      { label: "Emergency Contact", value: valueOrDash(worker.emergencyContact || worker.emergencyPhone), icon: <FiPhone /> },
      { label: "Created Date", value: formatDate(worker.createdAt), icon: <FiClock /> },
      { label: "Updated Date", value: formatDate(worker.updatedAt), icon: <FiClock /> },
    ];
  }, [worker]);

  return (
    <Page>
      <Card>
        {loading ? (
          <EmptyState>
            <FiLoader size={22} style={{ animation: "spin 1s linear infinite", marginRight: "0.5rem" }} />
            Loading worker details...
          </EmptyState>
        ) : error ? (
          <ErrorState>
            <div>{error}</div>
            <ButtonRow>
              <SecondaryButton type="button" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
              </SecondaryButton>
              <PrimaryButton type="button" onClick={loadWorker}>
                Retry
              </PrimaryButton>
            </ButtonRow>
          </ErrorState>
        ) : !worker ? (
          <EmptyState>No worker details available.</EmptyState>
        ) : (
          <>
            <HeaderRow>
              <TitleBlock>
                <Avatar>{(worker.name || worker.fullName || "W").charAt(0).toUpperCase()}</Avatar>
                <div>
                  <Title>{valueOrDash(worker.name || worker.fullName)}</Title>
                  <Subtitle>{valueOrDash(worker.employeeId || worker.employee_code || worker._id)}</Subtitle>
                </div>
              </TitleBlock>
              <StatusBadge status={worker.status || "Active"}>{worker.status || "Active"}</StatusBadge>
            </HeaderRow>

            <InfoGrid>
              {details.map((item) => (
                <FieldCard key={item.label}>
                  <FieldLabel>{item.label}</FieldLabel>
                  <FieldValue>{item.value}</FieldValue>
                </FieldCard>
              ))}
            </InfoGrid>

            <ButtonRow>
              <SecondaryButton type="button" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
              </SecondaryButton>
              <PrimaryButton type="button" onClick={() => navigate(`/workers/${id}/edit`)}>
                <FiEdit /> Edit Worker
              </PrimaryButton>
            </ButtonRow>
          </>
        )}
      </Card>
    </Page>
  );
};

export default WorkerDetails;
