import React from "react";

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
  "Present Today": FiUserCheck,
  "Active Sites": FiMapPin,
  "Pending Salary": FiDollarSign,
  "Gross Salary": FiTrendingUp,
  "Salary Paid": FiCreditCard,
};

const colorMap = {
  FiUsers: "#2563EB",
  FiUserCheck: "#16A34A",
  FiMapPin: "#F97316",
  FiDollarSign: "#8B5CF6",
  FiTrendingUp: "#0EA5E9",
  FiCreditCard: "#DC2626",

  "Total Workers": "#2563EB",
  "Present Today": "#16A34A",
  "Active Sites": "#F97316",
  "Pending Salary": "#8B5CF6",
  "Gross Salary": "#0EA5E9",
  "Salary Paid": "#DC2626",
};

const StatCard = ({
  title,
  value,
  description,
  progress = 0,
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

  const progressValue = Math.min(
    Math.max(Number(progress) || 0, 0),
    100
  );

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

        <Badge>

          {change || `${progressValue}%`}

        </Badge>

      </Top>

      <Title>

        {title}

      </Title>

      <Value>

        {value}

      </Value>

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

    </Card>

  );

};

export default StatCard;