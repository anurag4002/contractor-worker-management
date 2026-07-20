import {
  FiUsers,
  FiUserCheck,
  FiMapPin,
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
} from "react-icons/fi";

import {
  Card,
  Top,
  IconBox,
  Badge,
  Title,
  Value,
  Bottom,
  Description,
  Progress,
  ProgressFill,
} from "./StatCard.style";

const iconMap = {
  FiUsers,
  FiUserCheck,
  FiMapPin,
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,

  "Total Workers": FiUsers,
  "Active Workers": FiUserCheck,
  "Present Today": FiUserCheck,
  Present: FiUserCheck,
  Absent: FiUsers,
  Leave: FiTrendingUp,
  "Half Day": FiTrendingUp,
  "Active Sites": FiMapPin,
  "Pending Salary": FiDollarSign,
};

const colorMap = {
  FiUsers: "#2563EB",
  FiUserCheck: "#16A34A",
  FiMapPin: "#F97316",
  FiDollarSign: "#8B5CF6",
  FiTrendingUp: "#0EA5E9",
  FiCreditCard: "#DC2626",

  "Total Workers": "#2563EB",
  "Active Workers": "#16A34A",
  "Present Today": "#16A34A",
  Present: "#16A34A",
  Absent: "#DC2626",
  Leave: "#F59E0B",
  "Half Day": "#0EA5E9",
  "Active Sites": "#F97316",
  "Pending Salary": "#8B5CF6",
};

const StatCard = ({
  title,
  value,
  description = "",
  progress,
  icon,
  change,
  onClick,
}) => {
  const Icon =
    iconMap[icon] ||
    iconMap[title] ||
    FiUsers;

  const color =
    colorMap[icon] ||
    colorMap[title] ||
    "#2563EB";

  const progressValue =
    progress !== undefined
      ? Math.min(
          Math.max(Number(progress), 0),
          100
        )
      : 100;

  return (
    <Card
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Top>
        <IconBox color={color}>
          <Icon />
        </IconBox>

        {change && (
          <Badge>
            {change}
          </Badge>
        )}
      </Top>

      <Title>{title}</Title>

      <Value>{value}</Value>

      {description && (
        <Bottom>
          <Description>
            {description}
          </Description>

          <Progress>
            <ProgressFill
              width={`${progressValue}%`}
            />
          </Progress>
        </Bottom>
      )}
    </Card>
  );
};

export default StatCard;