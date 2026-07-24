import React from "react";
import styled from "styled-components";
import { FiAlertCircle } from "react-icons/fi";

const ErrorText = styled.div`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FormError = ({ error }) => {
    if (!error) return null;

    return (
        <ErrorText role="alert">
            <FiAlertCircle size={14} /> {error}
        </ErrorText>
    );
};

export default FormError;
