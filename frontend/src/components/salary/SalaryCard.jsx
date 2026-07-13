import React from "react";

import {
  Card,
  Top,
  IconBox,
  Title,
  Value,
} from "./SalaryCard.style";

const SalaryCard = ({
  title,
  value,
  icon,
  color,
}) => {

  return (

    <Card>

      <Top>

        <IconBox color={color}>

          {icon}

        </IconBox>

      </Top>

      <Title>

        {title}

      </Title>

      <Value>

        {value}

      </Value>

    </Card>

  );

};

export default SalaryCard;