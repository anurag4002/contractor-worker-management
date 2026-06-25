import styled from "styled-components";
import { COLORS } from "../../constants/Colors";

export const HeaderWrapper = styled.header`
  height: 80px;

  background: ${COLORS.white};

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 2rem;

  border-bottom: 1px solid ${COLORS.border};
`;

export const Search = styled.input`
  width: 320px;

  padding: 0.85rem 1rem;

  border-radius: 12px;

  border: 1px solid ${COLORS.border};

  outline: none;
`;

export const UserBox = styled.div`
  font-weight: 600;
`;