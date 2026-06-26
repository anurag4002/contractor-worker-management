import styled from "styled-components";

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const HeroSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 2.5rem;

  border-radius: 1.5rem;

  background: linear-gradient(135deg, #2563eb, #1d4ed8);

  color: white;

  overflow: hidden;

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
`;

export const HeroContent = styled.div`
  max-width: 38rem;

  h5 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }

  h1 {
    margin: 1rem 0;
    font-size: 2.5rem;
    line-height: 1.2;
  }

  p {
    line-height: 1.8;
  }
`;

export const HeroInfo = styled.div`
  margin-top: 2rem;

  display: flex;
  gap: 1rem;

  flex-wrap: wrap;
`;

export const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: .7rem;

  padding: .9rem 1.2rem;

  border-radius: .8rem;

  background: rgba(255,255,255,.15);

  backdrop-filter: blur(10px);
`;

export const HeroImage = styled.div`
  width: 18rem;
  height: 18rem;

  border-radius: 50%;

  background: rgba(255,255,255,.15);

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 6rem;
`;

export const StatsGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(4,1fr);

  gap: 1.5rem;

  @media(max-width:1100px){
    grid-template-columns:repeat(2,1fr);
  }

  @media(max-width:768px){
    grid-template-columns:1fr;
  }
`;

export const ChartSection = styled.section`
  display: grid;

  grid-template-columns: 2fr 1fr;

  gap: 1.5rem;

  @media(max-width:1100px){
    grid-template-columns:1fr;
  }
`;

export const ChartCard = styled.div`
  background: white;

  border-radius: 1.25rem;

  padding: 1.5rem;

  border: 1px solid #e2e8f0;

  box-shadow: 0 10px 30px rgba(15,23,42,.05);
`;

export const CardTitle = styled.h3`
  margin: 0 0 1.5rem;

  color: #0f172a;

  font-size: 1.1rem;
`;