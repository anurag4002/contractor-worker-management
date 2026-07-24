import styled from "styled-components";

/**
 * Shared Select matching Input styling.
 * Drop-in replacement for <select style={sel}>.
 */
const Select = styled.select`
  padding: 0.6rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.6rem;
  font-size: 0.88rem;
  background: #fff;
  color: #0f172a;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

export default Select;
