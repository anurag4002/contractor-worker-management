import styled from "styled-components";
import { Link } from "react-router-dom";

export const LoginPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        1100px circle at 10% 20%,
        rgba(37, 99, 235, 0.055) 0%,
        transparent 35%
      ),
      radial-gradient(
        1100px circle at 95% 85%,
        rgba(59, 130, 246, 0.045) 0%,
        transparent 35%
      );
    pointer-events: none;
  }

  .dark &::before {
    background:
      radial-gradient(
        1100px circle at 10% 20%,
        rgba(59, 130, 246, 0.09) 0%,
        transparent 35%
      ),
      radial-gradient(
        1100px circle at 95% 85%,
        rgba(96, 165, 250, 0.05) 0%,
        transparent 35%
      );
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const LoginWrapper = styled.div`
  width: 100%;
  max-width: 1140px;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 2.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    align-items: start;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;

  @media (max-width: 900px) {
    align-items: center;
    text-align: center;
    height: auto;
  }
`;

export const BrandGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

export const LogoIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.85rem;
  background: var(--primary);
  color: var(--text-on-primary);
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.25rem;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.28);
  flex-shrink: 0;
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text);
  }

  p {
    margin: 0;
    font-size: 0.73rem;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

export const MainHeading = styled.h1`
  margin: 0 0 0.8rem;
  font-size: clamp(1.9rem, 3.4vw, 2.6rem);
  font-weight: 800;
  line-height: 1.18;
  color: var(--text);
`;

export const Description = styled.p`
  margin: 0 0 1.85rem;
  max-width: 36rem;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--text-secondary);
`;

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 2rem;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.95rem;
  color: var(--text-secondary);

  svg {
    color: var(--success);
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

export const DashboardPreview = styled.div`
  margin-top: auto;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 10px 30px var(--shadow);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const DashboardPreviewTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const DashboardStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
`;

export const DashboardStat = styled.div`
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  padding: 0.8rem 0.9rem;
`;

export const DashboardStatLabel = styled.span`
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const DashboardStatValue = styled.span`
  display: block;
  margin-top: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
`;

export const RightSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 28rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  padding: 2.5rem;
  box-shadow: 0 20px 50px var(--shadow-lg);

  @media (max-width: 560px) {
    padding: 2rem;
    border-radius: 1rem;
  }
`;

export const CardHeader = styled.header`
  margin-bottom: 1.85rem;
  text-align: center;
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text);
`;

export const CardSubtitle = styled.p`
  margin: 0.4rem 0 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--text-secondary);
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
`;

export const InputGroup = styled.div`
  display: grid;
  gap: 0.45rem;
`;

export const FieldLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);

  ${({ $required }) =>
    $required &&
    `&::after {
      content: " *";
      color: var(--danger);
    }`}
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 0.9rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const LoginInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 2.9rem;
  border: 1px solid var(--input-border);
  border-radius: 0.8rem;
  background: var(--input-bg);
  color: var(--input-text);
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: var(--input-placeholder);
  }

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    background: var(--surface-secondary);
    color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

export const PasswordInput = styled(LoginInput)`
  padding-right: 2.9rem;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  font-size: 1.15rem;
  transition: color 0.2s;

  &:hover:not(:disabled) {
    color: var(--primary);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
    border-radius: 0.4rem;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;

  @media (max-width: 560px) {
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-start;
  }
`;

export const RememberLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;

  input {
    width: 1.05rem;
    height: 1.05rem;
    accent-color: var(--primary);
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;

export const ForgotLink = styled(Link)`
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export const SignInButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 0.8rem;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.95rem 1.1rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  &:active:not(:disabled) {
    transform: scale(0.985);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const RegisterLink = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const RegisterAnchor = styled(Link)`
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export const CardFooter = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.82rem;
`;
