import React from "react";

import {
  FiSearch,
  FiRotateCcw,
} from "react-icons/fi";

import styled from "styled-components";

const FilterContainer = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:1rem;
  flex-wrap:wrap;

  margin-bottom:2rem;
`;

const LeftSection = styled.div`
  display:flex;
  gap:1rem;
  flex-wrap:wrap;
`;

const SearchBox = styled.div`
  position:relative;
  width:18rem;

  svg{
    position:absolute;
    left:1rem;
    top:50%;
    transform:translateY(-50%);
    color:#64748B;
  }

  input{
    width:100%;
    padding:.9rem 1rem .9rem 2.8rem;

    border:1px solid #CBD5E1;

    border-radius:.8rem;

    outline:none;

    transition:.3s;

    &:focus{
      border-color:#2563EB;
    }
  }
`;

const Select = styled.select`
  padding:.9rem 1rem;

  border:1px solid #CBD5E1;

  border-radius:.8rem;

  outline:none;

  background:white;

  cursor:pointer;
`;

const Button = styled.button`
  display:flex;
  align-items:center;
  gap:.5rem;

  border:none;

  background:#2563EB;

  color:white;

  padding:.9rem 1.3rem;

  border-radius:.8rem;

  cursor:pointer;

  font-weight:600;

  transition:.3s;

  &:hover{
    background:#1D4ED8;
  }
`;

const SalaryFilter = ({
  search,
  setSearch,
  site,
  setSite,
  status,
  setStatus,
  sites,
}) => {

  const handleReset = () => {

    setSearch("");

    setSite("All");

    setStatus("All");

  };

  return (

    <FilterContainer>

      <LeftSection>

        <SearchBox>

          <FiSearch/>

          <input
            type="text"
            placeholder="Search Worker..."
            value={search}
            onChange={(e)=>
              setSearch(e.target.value)
            }
          />

        </SearchBox>

        <Select
          value={site}
          onChange={(e)=>
            setSite(e.target.value)
          }
        >

          <option value="All">
            All Sites
          </option>

          {sites.map((item)=>(

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </Select>

        <Select
          value={status}
          onChange={(e)=>
            setStatus(e.target.value)
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Pending">
            Pending
          </option>

        </Select>

      </LeftSection>

      <Button
        onClick={handleReset}
      >

        <FiRotateCcw/>

        Reset

      </Button>

    </FilterContainer>

  );

};

export default SalaryFilter;