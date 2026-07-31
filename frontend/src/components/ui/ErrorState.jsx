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
  color: var(--danger);
`;

const Msg = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
`;

const RetryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  padding: 0.55rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  background: var(--surface);
  font-size: 0.85rem;
  cursor: pointer;
  color: var(--text);
  &:hover { background: var(--surface-hover); }
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