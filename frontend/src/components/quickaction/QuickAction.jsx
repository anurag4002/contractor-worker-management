import React from "react";
import { Card, IconWrapper, Title } from "./QuickAction.style";

const QuickAction = ({ icon, title }) => {
  return (
    <Card>
      <IconWrapper>{icon}</IconWrapper>
      <Title>{title}</Title>
    </Card>
  );
};

export default QuickAction;