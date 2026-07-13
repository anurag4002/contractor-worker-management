import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  h2 {
    margin: 0;
    color: #0F172A;
    font-size: 2rem;
    font-weight: 700;
  }

  p {
    margin-top: .5rem;
    color: #64748B;
    font-size: .95rem;
  }
`;

export const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  background: #ffffff;

  border: 1px solid #E2E8F0;

  border-radius: 1rem;

  padding: 2rem;

  box-shadow: 0 8px 24px rgba(15,23,42,.05);

  @media(max-width:768px){
    flex-direction: column;
    text-align: center;
  }
`;

export const Avatar = styled.div`
  width: 6rem;
  height: 6rem;

  border-radius: 50%;

  background: #2563EB;

  color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 2rem;
  font-weight: 700;

  flex-shrink: 0;
`;

export const Info = styled.div`
  flex: 1;

  h3{
    margin:0;
    color:#0F172A;
    font-size:1.5rem;
  }

  p{
    margin-top:.4rem;
    color:#64748B;
  }
`;

export const EditButton = styled.button`
  display:flex;
  align-items:center;
  gap:.6rem;

  border:none;

  background:#2563EB;

  color:#ffffff;

  padding:.9rem 1.5rem;

  border-radius:.75rem;

  font-weight:600;

  cursor:pointer;

  transition:.25s;

  &:hover{
    background:#1D4ED8;
  }
`;

export const InfoGrid = styled.div`
  display:grid;

  grid-template-columns:repeat(2,1fr);

  gap:1.5rem;

  @media(max-width:768px){
    grid-template-columns:1fr;
  }
`;

export const InfoItem = styled.div`
  background:#ffffff;

  border:1px solid #E2E8F0;

  border-radius:1rem;

  padding:1.5rem;

  box-shadow:0 8px 24px rgba(15,23,42,.05);
`;

export const Label = styled.div`
  display:flex;
  align-items:center;
  gap:.6rem;

  color:#64748B;

  font-size:.9rem;

  margin-bottom:.8rem;

  svg{
    color:#2563EB;
    font-size:1rem;
  }
`;

export const Value = styled.div`
  color:#0F172A;

  font-size:1rem;

  font-weight:600;
`;