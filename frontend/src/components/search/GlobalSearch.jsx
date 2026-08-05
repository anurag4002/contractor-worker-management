import React, { useRef, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiChevronDown } from "react-icons/fi";
import useGlobalSearch from "./useGlobalSearch";
import {
  SearchContainer,
  SearchInputWrapper,
  Dropdown,
  DropdownSection,
  SectionLabel,
  ResultItem,
  LoadingWrapper,
  EmptyWrapper,
  Spinner,
} from "./GlobalSearch.styles";

const GlobalSearch = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    activeIndex,
    setActiveIndex,
    isOpen,
    setIsOpen,
    handleResultClick,
    handleKeyDown,
    highlightMatch,
    clearSearch,
  } = useGlobalSearch();

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchQuery(value);
      setIsOpen(true);
    },
    [setSearchQuery, setIsOpen]
  );

  const handleClear = useCallback(() => {
    clearSearch();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [clearSearch]);

  const handleFocus = useCallback(() => {
    if (searchQuery.trim()) {
      setIsOpen(true);
    }
  }, [searchQuery, setIsOpen]);

  const renderResults = () => {
    if (isLoading) {
      return (
        <LoadingWrapper>
          <Spinner />
          Searching…
        </LoadingWrapper>
      );
    }

    if (searchResults.length === 0 && searchQuery.trim()) {
      return (
        <EmptyWrapper>
          <span className="empty-icon">🔍</span>
          <p className="empty-text">No matching results</p>
          <p className="empty-sub">
            Try adjusting your search terms
          </p>
        </EmptyWrapper>
      );
    }

    if (searchResults.length === 0) {
      return null;
    }

    const grouped = searchResults.reduce((acc, result) => {
      const section = result.section || "Results";
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(result);
      return acc;
    }, {});

    return Object.entries(grouped).map(([section, items]) => (
      <DropdownSection key={section}>
        <SectionLabel>{section}</SectionLabel>
        {items.map((result, index) => (
          <ResultItem
            key={`${result.type}-${result.data?._id || index}`}
            className={activeIndex === index ? "active" : ""}
            onClick={() => handleResultClick(result)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <span className="result-badge">{result.type}</span>
            <span
              className="result-title"
              dangerouslySetInnerHTML={{
                __html: highlightMatch(result.title, searchQuery),
              }}
            />
            <span className="result-subtitle">{result.subtitle}</span>
          </ResultItem>
        ))}
      </DropdownSection>
    ));
  };

  return (
    <SearchContainer ref={containerRef}>
      <SearchInputWrapper>
        <FiSearch />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search workers, sites, attendance…"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          aria-label="Global search"
          aria-expanded={isOpen && searchResults.length > 0}
          aria-autocomplete="list"
          role="combobox"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <FiX />
          </button>
        )}
        <FiChevronDown style={{ fontSize: "0.75rem", opacity: 0.5 }} />
      </SearchInputWrapper>

      {isOpen && (searchResults.length > 0 || isLoading || searchQuery.trim()) && (
        <Dropdown>
          {renderResults()}
        </Dropdown>
      )}
    </SearchContainer>
  );
};

export default GlobalSearch;