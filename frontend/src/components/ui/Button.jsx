import styled from "styled-components";

const VARIANTS = {
  primary: `
    background: var(--primary);
    color: var(--text-on-primary);
    border: none;
  `,
  secondary: `
    background: var(--border);
    color: var(--text);
    border: 1px solid var(--border);
  `,
  danger: `
    background: var(--danger);
    color: var(--text-on-danger);
    border: none;
  `,
  ghost: `
    background: transparent;
    color: var(--primary);
    border: 1px solid var(--primary);
  `,
  icon: `
    background: var(--primary-light);
    color: var(--primary);
    border: none;
    width: 2.4rem;
    height: 2.4rem;
    padding: 0;
  `,
};

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: ${({ variant }) =>
    variant === "icon" ? "0" : "0.9rem 1.2rem"};
  border-radius: 0.9rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ variant = "primary" }) => VARIANTS[variant] || VARIANTS.primary}

  &:hover:not(:disabled) {
    ${({ variant = "primary" }) => {
      if (variant === "primary") return "background: var(--primary-hover);";
      if (variant === "danger") return "background: var(--danger-hover);";
      if (variant === "ghost") return "background: var(--primary-light);";
      if (variant === "icon") return "background: var(--primary); color: var(--text-on-primary);";
      return "";
    }}
  }
`;

export default Button;
