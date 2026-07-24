import styled from "styled-components";

const VARIANTS = {
    primary: `
    background: #2563eb; color: #fff; border: none;
    box-shadow: 0 4px 12px rgba(37,99,235,0.2);
    &:hover:not(:disabled) { background: #1d4ed8; }
  `,
    secondary: `
    background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0;
    &:hover:not(:disabled) { background: #e2e8f0; }
  `,
    danger: `
    background: #dc2626; color: #fff; border: none;
    &:hover:not(:disabled) { background: #b91c1c; }
  `,
    ghost: `
    background: transparent; color: #2563eb; border: 1px solid #2563eb;
    &:hover:not(:disabled) { background: #eff6ff; }
  `,
    icon: `
    background: #eff6ff; color: #2563eb; border: none;
    width: 2.4rem; height: 2.4rem; padding: 0;
    &:hover:not(:disabled) { background: #2563eb; color: #fff; }
  `,
};

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: ${({ variant }) => variant === "icon" ? "0" : "0.55rem 1.1rem"};
  border-radius: 0.6rem;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ variant = "primary" }) => VARIANTS[variant] || VARIANTS.primary}
`;

export default Button;
