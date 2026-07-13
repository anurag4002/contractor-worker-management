import React from "react";

import {
  FilterContainer,
  SearchInput,
  Select,
  MonthInput,
  ResetButton,
} from "./SalaryFilter.style";

const SalaryFilter = ({
  search,
  setSearch,
  site,
  setSite,
  wageType,
  setWageType,
  month,
  setMonth,
  sites = [],
}) => {

  const handleReset = () => {

    setSearch("");

    setSite("All");

    setWageType("All");

    setMonth("");

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

        <option value="All">

          All Sites

        </option>

        {

          sites
            .filter((item) => item !== "All")
            .map((item) => (

              <option
                key={item}
                value={item}
              >

                {item}

              </option>

            ))

        }

      </Select>

      <Select
        value={wageType}
        onChange={(e) =>
          setWageType(e.target.value)
        }
      >

        <option value="All">

          All Wage Types

        </option>

        <option value="Daily">

          Daily Wage

        </option>

        <option value="Monthly">

          Monthly Salary

        </option>

      </Select>

      <MonthInput
        type="month"
        value={month}
        onChange={(e) =>
          setMonth(e.target.value)
        }
      />

      <ResetButton
        type="button"
        onClick={handleReset}
      >

        Clear Filters

      </ResetButton>

    </FilterContainer>

  );

};

export default SalaryFilter;