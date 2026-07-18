import styled from "styled-components";

export const ForgotContainer = styled.div`
  min-height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 2rem;

  background: linear-gradient(
    135deg,
    #eff6ff 0%,
    #dbeafe 100%
  );
`;

export const ForgotCard = styled.div`
  width: 100%;

  max-width: 28rem;

  background: #ffffff;

  border-radius: 1.25rem;

  padding: 2.5rem;

  border: 1px solid #e2e8f0;

  box-shadow: 0 20px 50px rgba(15,23,42,.12);
`;

export const Logo = styled.div`
  width: 4.5rem;

  height: 4.5rem;

  margin: 0 auto 1.5rem;

  border-radius: 50%;

  background: #2563EB;

  color: #ffffff;

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 2rem;
`;

export const Title = styled.h2`
  margin: 0;

  text-align: center;

  color: #0F172A;

  font-size: 1.7rem;

  font-weight: 700;
`;

export const Subtitle = styled.p`
  margin: .8rem 0 2rem;

  text-align: center;

  color: #64748B;

  line-height: 1.6;
`;

export const Form = styled.form`
  display: flex;

  flex-direction: column;

  gap: 1.3rem;
`;

export const FormGroup = styled.div`
  display: flex;

  flex-direction: column;

  gap: .5rem;
`;

export const Label = styled.label`
  font-size: .9rem;

  font-weight: 600;

  color: #334155;
`;

export const Input = styled.input`
  width: 100%;

  padding: .95rem 1rem;

  border: 1px solid #CBD5E1;

  border-radius: .75rem;

  outline: none;

  font-size: .95rem;

  transition: .25s;

  &:focus{

    border-color: #2563EB;

    box-shadow: 0 0 0 3px rgba(37,99,235,.12);

  }
`;

export const ErrorMessage = styled.span`
  color: #DC2626;

  font-size: .85rem;
`;

export const SuccessMessage = styled.div`
  background: #DCFCE7;

  color: #166534;

  padding: 1rem;

  border-radius: .75rem;

  text-align: center;

  font-size: .9rem;
`;

export const SubmitButton = styled.button`
  border: none;

  background: #2563EB;

  color: #ffffff;

  padding: 1rem;

  border-radius: .75rem;

  cursor: pointer;

  font-size: 1rem;

  font-weight: 600;

  transition: .25s;

  &:hover{

    background: #1D4ED8;

  }

  &:disabled{

    background: #94A3B8;

    cursor: not-allowed;

  }
`;

export const BackButton = styled.button`
  border: none;

  background: transparent;

  color: #2563EB;

  cursor: pointer;

  font-size: .95rem;

  font-weight: 600;

  margin-top: 1rem;

  &:hover{

    text-decoration: underline;

  }
`;