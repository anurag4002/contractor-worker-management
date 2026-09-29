import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 1.5rem;
`;

export const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text);
`;

export const PageSubtitle = styled.p`
  margin: 0.4rem 0 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;

  &:hover:not(:disabled) {
    background: var(--surface-secondary);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ variant }) =>
    variant === "secondary" &&
    `
    background: var(--surface-secondary);
  `}
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
`;

export const TableHeader = styled.thead`
  background: var(--surface-secondary);
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 0.85rem 1rem;
  font-weight: 700;
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-top: 1px solid var(--border);

  &:hover {
    background: var(--surface-secondary);
  }
`;

export const TableCell = styled.td`
  padding: 0.85rem 1rem;
  color: var(--text);
  vertical-align: middle;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: var(--surface-secondary);
  color: var(--text-secondary);

  ${({ success }) =>
    success &&
    `
    background: rgba(22, 163, 74, 0.12);
    color: #16a34a;
  `}

  ${({ danger }) =>
    danger &&
    `
    background: rgba(220, 38, 38, 0.12);
    color: #dc2626;
  `}
`;

export const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
`;

export const FeatureIcon = styled.span`
  color: var(--success);
  display: flex;
  align-items: center;
`;

export const FeatureText = styled.span``;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
  gap: 1rem;

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
  gap: 0.75rem;
  text-align: center;
`;

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 0.6rem;
  border: none;
  background: var(--primary);
  color: var(--text-on-primary);
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--primary-hover);
  }
`;

/* ============================================================
   EDIT PLAN MODAL STYLES
   ============================================================ */

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  overflow-y: auto;
  z-index: 9999;
  animation: fade 0.25s ease;

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    align-items: flex-end;
  }
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 52rem;
  margin: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  max-height: calc(100vh - 4rem);
  max-height: calc(100dvh - 4rem);
  display: flex;
  flex-direction: column;
  animation: popup 0.25s ease;

  @keyframes popup {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: calc(100vh - 2rem);
    max-height: calc(100dvh - 2rem);
    border-radius: 1.25rem 1.25rem 0 0;
    margin-bottom: 0;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--surface);
  z-index: 10;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  color: var(--text);
  font-size: 1.25rem;
  font-weight: 700;
`;

export const ModalCloseButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--text-secondary);
  transition: color 0.25s;
  padding: 0.2rem;

  &:hover {
    color: var(--danger);
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border);
  position: sticky;
  bottom: 0;
  background: var(--surface);
  z-index: 5;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    flex-wrap: nowrap;
    padding: 1rem;
  }
`;

export const SectionCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 0.6rem;
  }
`;

export const SectionTitle = styled.h4`
  margin: 0 0 1rem;
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary);
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const FormField = styled.div`
  display: grid;
  gap: 0.45rem;
`;

export const FormLabel = styled.label`
  color: var(--text-secondary);
  font-size: 0.86rem;
  font-weight: 700;

  ${({ $required }) =>
    $required &&
    `
    &::after {
      content: " *";
      color: var(--danger);
    }
  `}
`;

const inputStyles = `
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--text);
  font-size: 0.95rem;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: var(--input-placeholder);
  }

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    background: var(--surface-secondary);
    color: #cbd5e1;
    cursor: not-allowed;
  }
`;

export const FormInput = styled.input`
  ${inputStyles}
`;

export const FormSelect = styled.select`
  ${inputStyles}
  cursor: pointer;
  background: var(--input-bg);
  color: var(--text);

  option {
    background: var(--input-bg);
    color: var(--text);
  }
`;

export const FormError = styled.div`
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.9rem;
  margin-top: 1.6rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    flex-wrap: nowrap;
  }
`;

export const PrimaryButton = styled.button`
  background: var(--primary);
  color: var(--text-on-primary);
  border: none;
  border-radius: 0.9rem;
  padding: 0.9rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.95rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  background: var(--border);
  color: var(--text);
  border: none;
  border-radius: 0.9rem;
  padding: 0.9rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.95rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--surface-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LimitGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LimitToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: var(--surface-hover);
  }

  input {
    width: 1.1rem;
    height: 1.1rem;
    accent-color: var(--primary);
    cursor: pointer;
  }

  span {
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

export const LimitInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-left: 1.85rem;
`;

export const LimitInput = styled.input`
  ${inputStyles}
  max-width: 160px;
`;

export const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fade 0.2s ease;
`;

export const ConfirmDialog = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 24rem;
  width: 90%;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
  animation: popup 0.2s ease;

  h3 {
    margin: 0 0 0.5rem;
    color: var(--text);
    font-size: 1.1rem;
    font-weight: 700;
  }

  p {
    margin: 0 0 1.5rem;
    color: var(--text-secondary);
    font-size: 0.95rem;
  }
`;

export const ConfirmButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;
