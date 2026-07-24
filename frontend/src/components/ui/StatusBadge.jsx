import styled from "styled-components";

const COLOR = {
    ACTIVE: { bg: "#dcfce7", fg: "#16a34a" },
    PRESENT: { bg: "#dcfce7", fg: "#16a34a" },
    PAID: { bg: "#dcfce7", fg: "#16a34a" },
    GENERATED: { bg: "#dbeafe", fg: "#2563eb" },
    HALF_DAY: { bg: "#dbeafe", fg: "#2563eb" },
    COMPLETED: { bg: "#f3e8ff", fg: "#7c3aed" },
    PENDING: { bg: "#fef9c3", fg: "#ca8a04" },
    LEAVE: { bg: "#fef9c3", fg: "#ca8a04" },
    HOLIDAY: { bg: "#fef9c3", fg: "#ca8a04" },
    INACTIVE: { bg: "#fee2e2", fg: "#dc2626" },
    ABSENT: { bg: "#fee2e2", fg: "#dc2626" },
    CANCELLED: { bg: "#fee2e2", fg: "#dc2626" },
};

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
  background: ${({ $status }) => COLOR[$status]?.bg ?? "#f1f5f9"};
  color: ${({ $status }) => COLOR[$status]?.fg ?? "#64748b"};
`;

const StatusBadge = ({ status, children }) => (
    <Badge $status={status}>{children ?? status}</Badge>
);

export default StatusBadge;
