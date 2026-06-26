import React from "react";

import {
  FiUsers,
  FiUserCheck,
  FiDollarSign,
  FiMapPin,
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
  FiUsers: FiUsers,
  FiUserCheck: FiUserCheck,
  FiDollarSign: FiDollarSign,
  FiMapPin: FiMapPin,
};

const colors = {
  FiUsers: "#2563EB",
  FiUserCheck: "#16A34A",
  FiDollarSign: "#F59E0B",
  FiMapPin: "#8B5CF6",
};

const StatCard = ({
  title,
  value,
  change,
  icon,
}) => {

  const Icon = iconMap[icon];

  return (
    <Card>

      <Top>

        <IconBox color={colors[icon]}>
          <Icon />
        </IconBox>

        <Badge>

          {change}

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

          Compared to last month

        </Description>

        <Progress>

          <ProgressFill width="75%" />

        </Progress>

      </Bottom>

    </Card>
  );
};

export default StatCard;