import styled from "styled-components";

export const Dropdown = styled.div`
  position: absolute;

  top: 3.8rem;

  right: 0;

  width: 18rem;

  background: #ffffff;

  border: 1px solid #E2E8F0;

  border-radius: 1rem;

  overflow: hidden;

  box-shadow: 0 20px 40px rgba(15, 23, 42, .12);

  z-index: 1000;

  @media (max-width:768px) {
    width: 16rem;
    right: -1rem;
  }
`;

export const UserSection = styled.div`
  display: flex;

  align-items: center;

  gap: 1rem;

  padding: 1.25rem;

  background: #F8FAFC;

  border-bottom: 1px solid #E2E8F0;
`;

export const Avatar = styled.div`
  width: 3rem;

  height: 3rem;

  border-radius: 50%;

  background: #2563EB;

  color: #ffffff;

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 1.1rem;

  font-weight: 700;

  flex-shrink: 0;
`;

export const UserDetails = styled.div`
  h4 {
    margin: 0;

    color: #0F172A;

    font-size: 1rem;

    font-weight: 600;
  }

  p {
    margin: .25rem 0 0;

    color: #64748B;

    font-size: .85rem;
  }
`;

export const Menu = styled.div`
  display: flex;

  flex-direction: column;
`;

export const MenuItem = styled.button`
  width: 100%;

  border: none;

  background: transparent;

  display: flex;

  align-items: center;

  gap: .9rem;

  padding: 1rem 1.25rem;

  font-size: .95rem;

  color: ${({ danger }) =>
    danger ? "#DC2626" : "#334155"};

  cursor: pointer;

  transition: .25s;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: ${({ danger }) =>
      danger ? "#FEF2F2" : "#F8FAFC"};
  }
`;