import React from "react";

import {
  FilterContainer,
  SearchInput,
  Select,
  ResetButton,
} from "./ReportFilter.style";

const ReportFilter = ({
  search,
  setSearch,
  site,
  setSite,
  month,
  setMonth,
  status,
  setStatus,
  sites = [],
  months = [],
}) => {

  const handleReset = () => {

    setSearch("");

    setSite("All");

    setMonth("All");

    setStatus("All");

  };

  return (

    <FilterContainer>

      <SearchInput

        type="text"

        placeholder="Search by Worker ID or Name..."

        value={search}

        onChange={(e) =>
          setSearch(e.target.value)
        }

      />

      <Select

        value={site}

        onChange={(e) =>
          setSite(e.target.value)
        }

      >

        {

          sites.map((siteName) => (

            <option

              key={siteName}

              value={siteName}

            >

              {siteName}

            </option>

          ))

        }

      </Select>

      <Select

        value={month}

        onChange={(e) =>
          setMonth(e.target.value)
        }

      >

        {

          months.map((monthName) => (

            <option

              key={monthName}

              value={monthName}

            >

              {monthName}

            </option>

          ))

        }

      </Select>

      <Select

        value={status}

        onChange={(e) =>
          setStatus(e.target.value)
        }

      >

        <option value="All">

          All Status

        </option>

        <option value="Paid">

          Paid

        </option>

        <option value="Partial">

          Partial

        </option>

        <option value="Pending">

          Pending

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

export default ReportFilter;