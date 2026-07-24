import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Ring = styled.div`
  display: inline-block;
  width: ${({ $size }) => $size || "2rem"};
  height: ${({ $size }) => $size || "2rem"};
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: ${({ $pad }) => $pad || "2.5rem"};
  color: #64748b;
  font-size: 0.9rem;
`;

const Loader = ({ text = "Loading…", size, pad }) => (
    <Wrap $pad={pad} role="status" aria-live="polite" aria-label={text}>
        <Ring $size={size} />
        {text && <span>{text}</span>}
    </Wrap>
);

export default Loader;
