import React from "react";
import { Card, Title, Time } from "./ActivityCard.style";

const ActivityCard = ({ title, time }) => {
  return (
    <Card>
      <Title>{title}</Title>
      <Time>{time}</Time>
    </Card>
  );
};

export default ActivityCard;