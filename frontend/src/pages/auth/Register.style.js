import styled from "styled-components";
import { Link } from "react-router-dom";

/* ============================================================
   ANIMATION KEYFRAMES
   ============================================================ */

export const keyframes = {
  fadeInUp: `
    0%   { opacity: 0; transform: translateY(24px); }
    100% { opacity: 1; transform: translateY(0); }
  `,
  fadeIn: `
    0%   { opacity: 0; }
    100% { opacity: 1; }
  `,
  slideInLeft: `
    0%   { opacity: 0; transform: translateX(-16px); }
    100% { opacity: 1; transform: translateX(0); }
  `,
  badgeGlow: `
    0%   { opacity: 0; transform: scale(0.7) translateX(-8px); box-shadow: 0 0 0 0 rgba(37,99,235,0.45); }
    45%  { transform: scale(1.06) translateX(0); box-shadow: 0 0 0 6px rgba(37,99,235,0.12); }
    100% { opacity: 1; transform: scale(1) translateX(0); box-shadow: 0 0 0 0 rgba(37,99,235,0); }
  `,
  checkIn: `
    0%   { opacity: 0; transform: scale(0.55); }
    55%  { transform: scale(1.1); }
    100% { opacity: 1; transform: scale(1); }
  `,
  cardIn: `
    0%   { opacity: 0; transform: translateY(28px) scale(0.98); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  `,
  cardFinishGlow: `
    0%   { box-shadow: 0 10px 30px var(--shadow); }
    50%  { box-shadow: 0 0 0 6px rgba(37,99,235,0.12), 0 10px 30px var(--shadow); }
    100% { box-shadow: 0 10px 30px var(--shadow); }
  `,
  lineGrow: `
    0%   { opacity: 0; transform: scaleY(0); }
    100% { opacity: 1; transform: scaleY(1); }
  `,
  statPop: `
    0%   { transform: scale(1); color: var(--text); }
    50%  { transform: scale(1.06); color: var(--primary); }
    100% { transform: scale(1); color: var(--text); }
  `,

  /* ---- text-specific polished reveals ---- */
  headingLineIn: `
    0%   { opacity: 0; transform: translateY(30px); filter: blur(var(--hl-blur, 6px)); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  `,
  headingGlow: `
    0%   { text-shadow: 0 0 0 rgba(37, 99, 235, 0); }
    50%  { text-shadow: 0 0 14px rgba(37, 99, 235, 0.16); }
    100% { text-shadow: 0 0 0 rgba(37, 99, 235, 0); }
  `,
  descriptionIn: `
    0%   { opacity: 0; transform: translateY(15px); filter: blur(var(--desc-blur, 4px)); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  `,
  statLabelIn: `
    0%   { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  `,
  stepTitleIn: `
    0%   { opacity: 0; transform: translateY(10px); filter: brightness(0.7); }
    52%  { opacity: 1; filter: brightness(1.2); }
    100% { opacity: 1; filter: brightness(1); }
  `,
  stepDescIn: `
    0%   { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  `,
  previewTitleIn: `
    0%   { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  `,
};

/* ============================================================
   ACCESSIBILITY — prefers-reduced-motion
   Surfaces all text immediately. Entrance styles (opacity,
   transform, blur) only come from @keyframes via fill-mode,
   so disabling the animation alone restores the base (visible)
   state without touching interactive hover transforms.
   ============================================================ */
const reducedMotionReset = `
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

/* ============================================================
   PAGE
   ============================================================ */

export const RegisterPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg);
  position: relative;
  overflow: hidden;
  font-family: "Inter", system-ui, -apple-system, sans-serif;

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
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const RegisterWrapper = styled.div`
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

/* ============================================================
   LEFT SECTION (animated introduction)
   ============================================================ */

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
  /* subtle blue highlight sweeps through the heading once it is fully revealed */
  animation: ${keyframes.headingGlow} 0.65s ease-out both 920ms;
  ${reducedMotionReset}
`;

export const HeadingLine = styled.span`
  display: block;
  --hl-blur: 6px;
  animation: ${keyframes.headingLineIn} 0.65s cubic-bezier(0.25, 0.1, 0.25, 1) both;
  animation-delay: ${({ $delay = 0 }) => $delay}ms;
  ${reducedMotionReset}

  @media (max-width: 768px) {
    --hl-blur: 2px;
  }
`;

export const Description = styled.p`
  margin: 0 0 1.85rem;
  max-width: 36rem;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--text-secondary);
  --desc-blur: 4px;
  animation: ${keyframes.descriptionIn} 0.55s ease-out both 700ms;
  ${reducedMotionReset}

  @media (max-width: 768px) {
    --desc-blur: 2px;
  }
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
  animation: ${keyframes.slideInLeft} 0.55s ease-out both;
  animation-delay: ${({ $delay = 0 }) => $delay}ms;
  ${reducedMotionReset}

  &:hover {
    color: var(--text);
  }

  svg {
    color: var(--success);
    font-size: 1.2rem;
    flex-shrink: 0;
    animation: ${keyframes.checkIn} 0.35s 0.12s ease-out both;
  }
`;

export const StepsSection = styled.div`
  position: relative;
  margin-bottom: 2rem;
  ${reducedMotionReset}
`;

export const StepsConnector = styled.div`
  position: absolute;
  left: 1.3rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--primary);
  transform-origin: top;
  animation: ${keyframes.lineGrow} 1.7s ease-out both;
  animation-delay: 1500ms;
  ${reducedMotionReset}

  @media (max-width: 768px) {
    display: none;
  }
`;

export const StepItem = styled.div`
  position: relative;
  padding-left: 2.6rem;
  padding-bottom: 1.15rem;
  animation: ${keyframes.fadeIn} 0.45s ease-out both;
  animation-delay: ${({ $delay = 0 }) => $delay}ms;
  ${reducedMotionReset}

  &:last-child {
    padding-bottom: 0;
  }

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

export const StepNumber = styled.span`
  position: absolute;
  left: 0.3rem;
  top: 0.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 700;
  z-index: 2;
  animation: ${keyframes.badgeGlow} 0.7s ease-out both;
  animation-delay: ${({ $delay = 0 }) => $delay}ms;
  ${reducedMotionReset}

  @media (max-width: 768px) {
    position: static;
    display: inline-flex;
    margin-bottom: 0.3rem;
  }
`;

export const StepContent = styled.div`
  /* animations are applied to the individual children for a
     polished Number -> Title -> Description sequence */
`;

export const StepTitle = styled.span`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  animation: ${keyframes.stepTitleIn} 0.6s cubic-bezier(0.34, 1.16, 0.68, 1) both;
  animation-delay: ${({ $delay = 0 }) => $delay}ms;
  ${reducedMotionReset}

  &:hover {
    color: var(--primary);
  }
`;

export const StepDesc = styled.span`
  margin-top: 0.15rem;
  display: block;
  font-size: 0.82rem;
  color: var(--text-secondary);
  animation: ${keyframes.stepDescIn} 0.45s ease-out both;
  animation-delay: ${({ $delay = 0 }) => $delay}ms;
  ${reducedMotionReset}
`;

export const DashboardPreview = styled.div`
  margin-top: auto;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 10px 30px var(--shadow);
  animation: ${keyframes.cardIn} 0.7s ease-out both 2200ms,
             ${keyframes.cardFinishGlow} 0.8s ease-out both 5150ms;
  ${reducedMotionReset}

  &:hover {
    transform: translateY(-3px);
    border-color: var(--primary);
  }

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
  animation: ${keyframes.previewTitleIn} 0.5s ease-out both 2250ms;
  ${reducedMotionReset}
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
  transition: transform 0.2s ease, border-color 0.2s ease;
  ${reducedMotionReset}

  &:hover {
    transform: translateY(-2px);
    border-color: var(--primary);
  }
`;

export const DashboardStatLabel = styled.span`
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  animation: ${keyframes.statLabelIn} 0.4s ease-out both;
  animation-delay: ${({ $labelDelay = 0 }) => $labelDelay}ms;
  ${reducedMotionReset}
`;

export const DashboardStatValue = styled.span`
  display: block;
  margin-top: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  animation: ${keyframes.statPop} 0.45s ease-out both;
  animation-delay: ${({ $popDelay = 0 }) => $popDelay}ms;
  ${reducedMotionReset}
`;

/* ============================================================
   RIGHT CARD
   ============================================================ */

export const RightSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const RegisterCard = styled.div`
  width: 100%;
  max-width: 28rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  padding: 2.5rem;
  box-shadow: 0 20px 50px var(--shadow-lg);

  @media (max-width: 560px) {
    padding: 1.5rem;
    border-radius: 1rem;
  }

  @media (max-width: 400px) {
    padding: 1.25rem;
    border-radius: 0.75rem;
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

export const RegisterForm = styled.form`
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

export const FormInput = styled.input`
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

export const PasswordField = styled(FormInput)`
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

export const RegisterButton = styled.button`
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

export const LoginLinkRow = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const LoginAnchor = styled(Link)`
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
