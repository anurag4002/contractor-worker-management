import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 58rem;
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.16);
`;

export const AvatarCircle = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #38bdf8 100%);
  color: #ffffff;
  box-shadow: 0 15px 35px rgba(37, 99, 235, 0.18);
`;

export const HeaderSection = styled.section`
  display: grid;
  gap: 0.5rem;
  max-width: 46rem;
  margin-bottom: 2rem;
`;

export const Name = styled.h1`
  margin: 0;
  font-size: clamp(1.9rem, 3vw, 2.6rem);
  color: #0f172a;
  letter-spacing: -0.02em;
`;

export const RoleLabel = styled.p`
  margin: 0;
  color: #2563eb;
  font-weight: 700;
  font-size: 1rem;
`;

export const SummaryText = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.8;
  max-width: 52rem;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: grid;
  gap: 0.75rem;
`;

export const FieldLabel = styled.label`
  font-size: 0.92rem;
  color: #64748b;
  font-weight: 600;
`;

export const FieldBox = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 0.9rem 1rem;
`;

export const FieldIcon = styled.div`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.95rem;
  color: #2563eb;
  background: rgba(37, 99, 235, 0.08);
  flex-shrink: 0;
`;

export const FieldInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 600;
  min-width: 0;

  &:focus {
    outline: none;
  }

  &:read-only {
    color: #334155;
    cursor: default;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.95rem 1.5rem;
  border: none;
  border-radius: 0.95rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.22s ease, background-color 0.22s ease, box-shadow 0.22s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const PrimaryButton = styled(Button)`
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.2);

  &:hover {
    background: #1d4ed8;
  }
`;

export const SecondaryButton = styled(Button)`
  background: #e2e8f0;
  color: #0f172a;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);

  &:hover {
    background: #cbd5e1;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 576px) {
    justify-content: stretch;
  }
`;
