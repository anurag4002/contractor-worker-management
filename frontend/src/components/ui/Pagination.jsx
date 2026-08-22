import React from "react";
import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const Info = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-align: center;
  min-width: 0;
  flex: 1 1 auto;
  order: 2;

  @media (max-width: 480px) {
    width: 100%;
    order: 3;
    text-align: center;
    flex-basis: 100%;
  }
`;

const NavBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  background: var(--surface);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text);
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: var(--surface-hover);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
  }
`;

const Pagination = ({ page, totalPages, onPageChange, total }) => {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <Bar role="navigation" aria-label="Pagination">
            <NavBtn
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
                style={{ order: 1 }}
            >
                <FiChevronLeft /> Prev
            </NavBtn>

            <Info style={{ order: 2 }}>
                Page {page} of {totalPages}
                {total != null && ` · ${total} total`}
            </Info>

            <NavBtn
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
                style={{ order: 3 }}
            >
                Next <FiChevronRight />
            </NavBtn>
        </Bar>
    );
};

export default Pagination;