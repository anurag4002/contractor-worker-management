import styled from "styled-components";

/**
 * Shared Input styled component.
 */
const Input = styled.input`
  padding: 0.6rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.6rem;
  font-size: 0.88rem;
  background: #fff;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder { color: #94a3b8; }
`;

export default Input;
