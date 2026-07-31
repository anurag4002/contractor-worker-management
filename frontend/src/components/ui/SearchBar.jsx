import React from "react";
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

const Wrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 180px;
`;

const Icon = styled.span`
  position: absolute;
  left: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.9rem 0.6rem 2.2rem;
  border: 1px solid var(--input-border);
  border-radius: 0.6rem;
  font-size: 0.88rem;
  background: var(--input-bg);
  color: var(--input-text);
  transition: border-color 0.15s;
  outline: none;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder { color: var(--input-placeholder); }
`;

const SearchBar = ({ value, onChange, placeholder = "Search…", ...rest }) => (
    <Wrap>
        <Icon aria-hidden="true"><FiSearch /></Icon>
        <StyledInput
            type="search"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-label={placeholder}
            {...rest}
        />
    </Wrap>
);

export default SearchBar;