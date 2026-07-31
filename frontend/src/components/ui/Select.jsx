import styled from "styled-components";

const Select = styled.select`
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--input-border);
  border-radius: 0.6rem;
  font-size: 0.88rem;
  background: var(--input-bg);
  color: var(--input-text);
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

export default Select;