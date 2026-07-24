import React from "react";
import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 0.5rem;
  flex-wrap: wrap;
`;

const Info = styled.span`
  font-size: 0.85rem;
  color: #64748b;
`;

const NavBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.6rem;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: #334155;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #f1f5f9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/**
 * Server-side pagination bar.
 * @param {{ page: number, totalPages: number, onPageChange: (n: number) => void, total?: number }} props
 */
const Pagination = ({ page, totalPages, onPageChange, total }) => {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <Bar role="navigation" aria-label="Pagination">
            <NavBtn
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
            >
                <FiChevronLeft /> Prev
            </NavBtn>

            <Info>
                Page {page} of {totalPages}
                {total != null && ` · ${total} total`}
            </Info>

            <NavBtn
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
            >
                Next <FiChevronRight />
            </NavBtn>
        </Bar>
    );
};

export default Pagination;
