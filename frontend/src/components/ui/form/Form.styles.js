import styled from "styled-components";

/* ============================================================
   PAGE LAYOUT (full-page forms like EditWorker page, Profile)
   ============================================================ */

export const FormPage = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const FormContainer = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FormTitle = styled.h1`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
`;

export const FormSubtitle = styled.p`
  margin: 0.35rem 0 0;
  color: var(--text-secondary);
`;

/* ============================================================
   FORM LAYOUT
   ============================================================ */

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormRow = styled.div`
  display: grid;
  gap: 0.45rem;
`;

export const FormField = styled.div`
  display: grid;
  gap: 0.45rem;
`;

export const FormFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

export const FormError = styled.div`
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

/* ============================================================
   SECTION CARDS
   ============================================================ */

export const SectionCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
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

/* ============================================================
   INPUTS
   ============================================================ */

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
    background: var(--surface-hover);
    color: var(--text-secondary);
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

export const FormTextarea = styled.textarea`
  ${inputStyles}
  min-height: 7rem;
  resize: vertical;
`;

export const FormDatePicker = styled.input`
  ${inputStyles}
  background: var(--input-bg);

  &::-webkit-calendar-picker-arr {
    filter: invert(0.6) sepia(0.5) saturate(3) hue-rotate(210deg);
  }

  @media (max-width: 768px) {
    &::-webkit-calendar-picker-arr {
      filter: invert(0.7) sepia(0.4) saturate(3) hue-rotate(210deg);
    }
  }
`;

/* DatePicker with dark popup for webkit browsers */
export const DatePickerInput = styled.input.attrs({ type: "date" })`
  ${inputStyles}

  &::-webkit-calendar-picker-arr {
    opacity: 0.6;
  }
`;

/* ============================================================
   CHECKBOX & RADIO
   ============================================================ */

export const FormCheckbox = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;

  input {
    width: 1.05rem;
    height: 1.05rem;
    accent-color: var(--primary);
    cursor: pointer;
  }
`;

export const FormRadio = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;

  input {
    width: 1.05rem;
    height: 1.05rem;
    accent-color: var(--primary);
    cursor: pointer;
  }
`;

/* ============================================================
   BUTTONS
   ============================================================ */

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

export const Button = styled.button`
  border: none;
  border-radius: 0.9rem;
  padding: 0.9rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.95rem;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled(Button)`
  background: var(--primary);
  color: var(--text-on-primary);

  &:hover:not(:disabled) {
    background: var(--primary-hover);
  }
`;

export const SecondaryButton = styled(Button)`
  background: var(--border);
  color: var(--text);

  &:hover:not(:disabled) {
    background: var(--surface-hover);
  }
`;

export const DangerButton = styled(Button)`
  background: var(--danger);
  color: var(--text-on-danger);

  &:hover:not(:disabled) {
    background: var(--danger-hover);
  }
`;

export const FormButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 0.9rem;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.9rem 1.2rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ============================================================
   MODAL SYSTEM (overlay, header, body, footer)
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
  }
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 48rem;
  margin: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  max-height: calc(100vh - 4rem);
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
    border-radius: 1.25rem;
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
  }
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
`;

/* ============================================================
   STATE COMPONENTS
   ============================================================ */

export const FormEmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

export const FormErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--danger);
`;
