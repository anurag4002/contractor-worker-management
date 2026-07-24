import styled from "styled-components";

/**
 * FilterBar — flex wrapper for filter rows.
 * Usage: <FilterBar> <SearchBar ...> <Select ...> <Button ...> </FilterBar>
 */
const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
`;

export default FilterBar;
