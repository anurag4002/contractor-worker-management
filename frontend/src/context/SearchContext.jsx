import { createContext, useContext, useState, useCallback, useMemo } from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("/dashboard");

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsLoading(false);
    setActiveIndex(-1);
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      searchResults,
      setSearchResults,
      isLoading,
      setIsLoading,
      activeIndex,
      setActiveIndex,
      isOpen,
      setIsOpen,
      currentRoute,
      setCurrentRoute,
      clearSearch,
    }),
    [
      searchQuery,
      searchResults,
      isLoading,
      activeIndex,
      isOpen,
      currentRoute,
      clearSearch,
    ]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export default SearchContext;