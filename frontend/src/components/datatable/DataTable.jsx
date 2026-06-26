import React, { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

import {
  TableContainer,
  TableHeader,
  Title,
  SearchBox,
  TableWrapper,
  StyledTable,
  EmptyState,
  Pagination,
  PageButtons,
  PageButton,
} from "./DataTable.style";

const ITEMS_PER_PAGE = 10;

const DataTable = ({
  title,
  columns,
  data,
  renderActions,
}) => {
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {

    return data.filter((item) => {

      return Object.values(item).some((value) =>
        String(value)
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    });

  }, [data, search]);

  const totalPages = Math.ceil(
    filteredData.length / ITEMS_PER_PAGE
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <TableContainer>

      {/* Header */}

      <TableHeader>

        <Title>{title}</Title>

        <SearchBox>

          <FiSearch />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

        </SearchBox>

      </TableHeader>

      {/* Table */}

      <TableWrapper>

        <StyledTable>

          <thead>

            <tr>

              {columns.map((column) => (

                <th key={column.accessor}>
                  {column.header}
                </th>

              ))}

              {renderActions && (
                <th>Actions</th>
              )}

            </tr>

          </thead>

          <tbody>

            {paginatedData.length === 0 ? (

              <tr>

                <td
                  colSpan={
                    columns.length + (renderActions ? 1 : 0)
                  }
                >
                  <EmptyState>

                    No Data Found

                  </EmptyState>
                </td>

              </tr>

            ) : (

              paginatedData.map((row, index) => (

                <tr key={row.id || index}>

                  {columns.map((column) => (

                    <td key={column.accessor}>

                      {column.render
                        ? column.render(row)
                        : row[column.accessor]}

                    </td>

                  ))}

                  {renderActions && (

                    <td>

                      {renderActions(row)}

                    </td>

                  )}

                </tr>

              ))

            )}

          </tbody>

        </StyledTable>

      </TableWrapper>

      {/* Pagination */}

      <Pagination>

        <span>

          Showing {paginatedData.length} of {filteredData.length}

        </span>

        <PageButtons>

          {Array.from(
            { length: totalPages },
            (_, index) => (

              <PageButton
                key={index}
                active={currentPage === index + 1}
                onClick={() =>
                  setCurrentPage(index + 1)
                }
              >
                {index + 1}
              </PageButton>

            )
          )}

        </PageButtons>

      </Pagination>

    </TableContainer>
  );
};

export default DataTable;