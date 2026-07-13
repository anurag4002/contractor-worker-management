import React from "react";

import {
  FilterContainer,
  SearchInput,
  Select,
  ResetButton,
} from "./SiteFilter.style";

const SiteFilter = ({
  search,
  setSearch,
  status,
  setStatus,
}) => {

  const handleReset = () => {

    setSearch("");

    setStatus("All");

  };

  return (

    <FilterContainer>

      <SearchInput

        type="text"

        placeholder="Search by Site Name, Location or Supervisor..."

        value={search}

        onChange={(e) =>
          setSearch(e.target.value)
        }

      />

      <Select

        value={status}

        onChange={(e) =>
          setStatus(e.target.value)
        }

      >

        <option value="All">

          All Status

        </option>

        <option value="Active">

          Active

        </option>

        <option value="Completed">

          Completed

        </option>

        <option value="On Hold">

          On Hold

        </option>

      </Select>

      <ResetButton

        type="button"

        onClick={handleReset}

      >

        Clear Filters

      </ResetButton>

    </FilterContainer>

  );

};

export default SiteFilter;