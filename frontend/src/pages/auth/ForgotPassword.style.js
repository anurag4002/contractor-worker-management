import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 1.5rem;

  background: linear-gradient(
    135deg,
    var(--primary),
    #1E3A8A
  );

  @media (max-width: 768px) {
    padding: 1rem;
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const Card = styled.div`
  width: 100%;

  max-width: 28rem;

  background: var(--surface);

  border-radius: 1.25rem;

  padding: 2.5rem;

  box-shadow: 0 20px 50px rgba(15,23,42,.18);

  animation: popup .3s ease;

  @keyframes popup {

    from{
      opacity:0;
      transform:translateY(20px);
    }

    to{
      opacity:1;
      transform:translateY(0);
    }

  }

  @media (max-width: 560px) {
    padding: 1.75rem;
  }

  @media (max-width: 400px) {
    padding: 1.25rem;
    border-radius: 1rem;
  }
`;

export const Title = styled.h2`
  margin:0;

  text-align:center;

  color:var(--text);

  font-size:clamp(1.5rem, 4vw, 2rem);

  font-weight:700;
`;

export const Subtitle = styled.p`
  margin:1rem 0 2rem;

  text-align:center;

  color:var(--text-secondary);

  line-height:1.6;
`;

export const SuccessMessage = styled.div`
  margin-bottom:1.5rem;

  padding:1rem;

  border-radius:.75rem;

  background:var(--badge-success-bg);

  color:#15803D;

  text-align:center;

  font-size:.9rem;

  font-weight:600;
`;

export const Form = styled.form`
  display:flex;

  flex-direction:column;

  gap:1.25rem;
`;

export const InputGroup = styled.div`
  position:relative;

  display:flex;

  align-items:center;
`;

export const Icon = styled.div`
  position:absolute;

  left:1rem;

  color:var(--text-secondary);

  font-size:1rem;
`;

export const Input = styled.input`
  width:100%;

  padding:1rem 1rem 1rem 3rem;

  border:1px solid var(--input-border);

  border-radius:.8rem;

  outline:none;

  font-size:.95rem;

  transition:.25s;

  &:focus{

    border-color:var(--primary);

    box-shadow:0 0 0 3px rgba(37,99,235,.15);

  }
`;

export const Button = styled.button`
  border:none;

  background:var(--primary);

  color:var(--surface);

  padding:1rem;

  border-radius:.8rem;

  font-size:1rem;

  font-weight:600;

  cursor:pointer;

  transition:.25s;

  &:hover{

    background:var(--primary-hover);

  }

  &:active{

    transform:scale(.98);

  }
`;

export const Footer = styled.div`
  margin-top:2rem;

  text-align:center;

  a{

    display:inline-flex;

    align-items:center;

    gap:.5rem;

    color:var(--primary);

    text-decoration:none;

    font-weight:600;

    transition:.25s;

  }

  a:hover{

    color:var(--primary-hover);

  }
`;