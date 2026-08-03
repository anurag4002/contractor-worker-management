import styled from "styled-components";

const VARIANTS = {
  primary: `
    background: var(--primary); color: var(--text-on-primary); border: none;
    box-shadow: 0 4px 12px rgba(37,99,235,0.2);
    &:hover:not(:disabled) { background: var(--primary-hover); }
  `,
  secondary: `
    background: var(--surface-hover); color: var(--text); border: 1px solid var(--border);
    &:hover:not(:disabled) { background: var(--border); }
  `,
  danger: `
    background: var(--danger); color: var(--text-on-danger); border: none;
    &:hover:not(:disabled) { background: var(--danger-hover); }
  `,
  ghost: `
    background: transparent; color: var(--primary); border: 1px solid var(--primary);
    &:hover:not(:disabled) { background: var(--primary-light); }
  `,
  icon: `
    background: var(--primary-light); color: var(--primary); border: none;
    width: 2.4rem; height: 2.4rem; padding: 0;
    &:hover:not(:disabled) { background: var(--primary); color: var(--text-on-primary); }
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