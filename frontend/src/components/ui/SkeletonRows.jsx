import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const Cell = styled.td`
  padding: 0.9rem 1rem;
`;

const Bar = styled.div`
  height: 0.85rem;
  border-radius: 4px;
  width: ${({ $w }) => $w || "80%"};
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;

/**
 * Renders `count` skeleton rows each with `cols` shimmer cells.
 */
const SkeletonRows = ({ cols = 5, count = 5 }) =>
    Array.from({ length: count }).map((_, r) => (
        <tr key={r} aria-hidden="true">
            {Array.from({ length: cols }).map((_, c) => (
                <Cell key={c}>
                    <Bar $w={c === 0 ? "30%" : c === cols - 1 ? "50%" : "75%"} />
                </Cell>
            ))}
        </tr>
    ));

export default SkeletonRows;
