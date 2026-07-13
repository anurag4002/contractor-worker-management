import styled from "styled-components";

export const AuthContainer = styled.div`
  min-height: 100vh;

  display: grid;

  grid-template-columns: 1fr 32rem;

  background: #F8FAFC;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftSection = styled.div`
  background: linear-gradient(
    135deg,
    #2563EB 0%,
    #1D4ED8 100%
  );

  color: #ffffff;

  display: flex;

  flex-direction: column;

  justify-content: center;

  padding: 4rem;

  @media (max-width: 992px) {
    display: none;
  }
`;

export const Brand = styled.div`
  margin-bottom: 3rem;
`;

export const BrandIcon = styled.div`
  width: 5rem;

  height: 5rem;

  border-radius: 1rem;

  background: rgba(255,255,255,.15);

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 2.2rem;

  margin-bottom: 2rem;
`;

export const BrandTitle = styled.h1`
  margin: 0;

  font-size: 2.5rem;

  font-weight: 700;

  line-height: 1.3;
`;

export const BrandDescription = styled.p`
  margin-top: 1.5rem;

  max-width: 32rem;

  color: rgba(255,255,255,.85);

  line-height: 1.8;

  font-size: 1rem;
`;

export const FeatureList = styled.div`
  display: flex;

  flex-direction: column;

  gap: 1rem;
`;

export const FeatureItem = styled.div`
  display: flex;

  align-items: center;

  gap: .75rem;

  font-size: 1rem;

  font-weight: 500;

  color: rgba(255,255,255,.95);
`;

export const RightSection = styled.div`
  display: flex;

  justify-content: center;

  align-items: center;

  padding: 2rem;

  background: #F8FAFC;
`;