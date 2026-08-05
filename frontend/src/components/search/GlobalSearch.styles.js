import styled from "styled-components";

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 26rem;
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0 0.8rem;
  border: 1px solid var(--input-border);
  border-radius: 0.8rem;
  background: var(--input-bg);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  svg {
    color: var(--text-secondary);
    font-size: 1rem;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    padding: 0.7rem 0;
    font-size: 0.9rem;
    background: transparent;
    color: var(--input-text);
    min-width: 0;

    &::placeholder {
      color: var(--input-placeholder);
    }
  }

  .clear-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 0.9rem;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s, color 0.2s;
    flex-shrink: 0;

    &:hover {
      background: var(--surface-hover);
      color: var(--text);
    }
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  box-shadow: 0 0.5rem 1.5rem var(--shadow-lg);
  max-height: 28rem;
  overflow-y: auto;
  z-index: 1000;
  animation: fadeIn 0.15s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-0.4rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownSection = styled.div`
  padding: 0.5rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }
`;

export const SectionLabel = styled.div`
  padding: 0.4rem 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
`;

export const ResultItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
  border-left: 3px solid transparent;

  &:hover,
  &.active {
    background: var(--surface-hover);
    border-left-color: var(--primary);
  }

  &.active {
    background: var(--primary-light);
  }

  .result-title {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text);
    line-height: 1.3;

    mark {
      background: transparent;
      color: var(--primary);
      font-weight: 600;
    }
  }

  .result-subtitle {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.15rem;
    line-height: 1.3;
  }

  .result-badge {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.1rem 0.4rem;
    border-radius: 0.3rem;
    background: var(--primary-light);
    color: var(--primary);
    text-transform: uppercase;
    margin-right: 0.4rem;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

export const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  color: var(--text-secondary);
  text-align: center;

  .empty-icon {
    font-size: 2rem;
    opacity: 0.4;
  }

  .empty-text {
    font-size: 0.88rem;
    margin: 0;
  }

  .empty-sub {
    font-size: 0.75rem;
    opacity: 0.6;
    margin: 0;
  }
`;

export const Spinner = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;