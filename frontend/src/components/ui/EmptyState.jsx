import React from "react";
import styled from "styled-components";
import { FiInbox } from "react-icons/fi";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: ${({ $pad }) => $pad || "3rem 1rem"};
  color: #94a3b8;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 2.5rem;
  color: #cbd5e1;
`;

const Msg = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
`;

const Sub = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
`;

const EmptyState = ({ icon, message = "No data found.", sub, children }) => (
    <Wrap aria-live="polite">
        <Icon>{icon ?? <FiInbox />}</Icon>
        <Msg>{message}</Msg>
        {sub && <Sub>{sub}</Sub>}
        {children}
    </Wrap>
);

export default EmptyState;
