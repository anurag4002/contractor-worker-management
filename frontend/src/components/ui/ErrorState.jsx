import React from "react";
import styled from "styled-components";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
`;

const IconBox = styled.div`
  font-size: 2.5rem;
  color: #dc2626;
`;

const Msg = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
`;

const RetryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  padding: 0.55rem 1.1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.6rem;
  background: #f8fafc;
  font-size: 0.85rem;
  cursor: pointer;
  color: #334155;
  &:hover { background: #e2e8f0; }
`;

const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
    <Wrap role="alert">
        <IconBox><FiAlertCircle /></IconBox>
        <Msg>{message}</Msg>
        {onRetry && (
            <RetryBtn onClick={onRetry}>
                <FiRefreshCw /> Retry
            </RetryBtn>
        )}
    </Wrap>
);

export default ErrorState;
