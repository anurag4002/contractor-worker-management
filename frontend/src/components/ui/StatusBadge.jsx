import styled from "styled-components";

const COLOR = {
    ACTIVE: { bg: "var(--badge-success-bg)", fg: "var(--badge-success-fg)" },
    PRESENT: { bg: "var(--badge-success-bg)", fg: "var(--badge-success-fg)" },
    PAID: { bg: "var(--badge-success-bg)", fg: "var(--badge-success-fg)" },
    GENERATED: { bg: "var(--badge-info-bg)", fg: "var(--badge-info-fg)" },
    HALF_DAY: { bg: "var(--badge-info-bg)", fg: "var(--badge-info-fg)" },
    COMPLETED: { bg: "var(--badge-purple-bg)", fg: "var(--badge-purple-fg)" },
    PENDING: { bg: "var(--badge-warning-bg)", fg: "var(--badge-warning-fg)" },
    LEAVE: { bg: "var(--badge-warning-bg)", fg: "var(--badge-warning-fg)" },
    HOLIDAY: { bg: "var(--badge-warning-bg)", fg: "var(--badge-warning-fg)" },
    INACTIVE: { bg: "var(--badge-danger-bg)", fg: "var(--badge-danger-fg)" },
    ABSENT: { bg: "var(--badge-danger-bg)", fg: "var(--badge-danger-fg)" },
    CANCELLED: { bg: "var(--badge-danger-bg)", fg: "var(--badge-danger-fg)" },
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
  background: ${({ $status }) => COLOR[$status]?.bg ?? "var(--surface-hover)"};
  color: ${({ $status }) => COLOR[$status]?.fg ?? "var(--text-secondary)"};
`;

const StatusBadge = ({ status, children }) => (
    <Badge $status={status}>{children ?? status}</Badge>
);

export default StatusBadge;