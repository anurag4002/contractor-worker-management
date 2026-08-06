import styled from "styled-components";
import { FiAlertCircle } from "react-icons/fi";
import { getFriendlyMessage } from "../../utils/errorMapper";

const ErrorText = styled.div`
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const FormError = ({ error }) => {
  if (!error) return null;

  const message = getFriendlyMessage(error);

  return (
    <ErrorText role="alert">
      <FiAlertCircle size={14} /> {message}
    </ErrorText>
  );
};

export default FormError;
