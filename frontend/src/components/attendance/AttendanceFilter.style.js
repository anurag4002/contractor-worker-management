import styled from "styled-components";

export const FilterContainer = styled.div`
  display: grid;

  grid-template-columns: 2fr 1fr 1fr 1fr auto;

  gap: 1rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputStyle = `
  width:100%;

  padding:.9rem 1rem;

  border:1px solid var(--input-border);

  border-radius:.8rem;

  outline:none;

  font-size:.95rem;

  transition:.25s;

  &:focus{
    border-color:var(--primary);
  }
`;

export const SearchInput = styled.input`
  ${InputStyle}
`;

export const Select = styled.select`
  ${InputStyle}
`;

export const MonthInput = styled.input`
  ${InputStyle}
`;

export const ResetButton = styled.button`
  border:none;

  background:var(--danger);

  color:#fff;

  border-radius:.8rem;

  padding:.9rem 1.5rem;

  cursor:pointer;

  font-weight:600;

  transition:.25s;

  &:hover{

    background:var(--danger);

  }
`;