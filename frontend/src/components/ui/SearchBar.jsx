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
  color: #94a3b8;
  font-size: 0.95rem;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.9rem 0.6rem 2.2rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.6rem;
  font-size: 0.88rem;
  background: #fff;
  color: #0f172a;
  transition: border-color 0.15s;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder { color: #94a3b8; }
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
