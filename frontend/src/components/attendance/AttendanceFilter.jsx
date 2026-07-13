import React from "react";

import {
  FilterContainer,
  SearchInput,
  Select,
  MonthInput,
  ResetButton,
} from "./AttendanceFilter.style";

const AttendanceFilter = ({
  search,
  setSearch,
  site,
  setSite,
  status,
  setStatus,
  month,
  setMonth,
  sites = [],
}) => {

  const handleReset = () => {

    setSearch("");

    setSite("All");

    setStatus("All");

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
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >

        <option value="All">

          All Status

        </option>

        <option value="Present">

          Present

        </option>

        <option value="Absent">

          Absent

        </option>

        <option value="Leave">

          Leave

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

export default AttendanceFilter;