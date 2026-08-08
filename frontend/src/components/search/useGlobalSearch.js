import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import useWorkers from "../../hooks/useWorkers";
import useAttendance from "../../hooks/useAttendance";
import useSites from "../../hooks/useSites";
import usePayroll from "../../hooks/usePayroll";

const DEBOUNCE_MS = 300;

const getRouteFromPath = (path) => {
  if (path === "/dashboard") return "dashboard";
  if (path === "/workers" || path.startsWith("/workers/")) return "workers";
  if (path === "/attendance" || path.startsWith("/attendance/")) return "attendance";
  if (path === "/salary" || path.startsWith("/salary/")) return "salary";
  if (path === "/sites" || path.startsWith("/sites/")) return "sites";
  if (path === "/payroll" || path.startsWith("/payroll/")) return "payroll";
  if (path === "/reports" || path.startsWith("/reports/")) return "reports";
  return "dashboard";
};

const matchText = (text, query) => {
  if (!text) return false;
  return String(text).toLowerCase().includes(query);
};

const useGlobalSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
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
  } = useSearch();

  const { workers = [] } = useWorkers();
  const { attendanceRecords = [] } = useAttendance();
  const { sites = [] } = useSites();
  const { payrolls = [] } = usePayroll();

  const debounceTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const route = getRouteFromPath(location.pathname);
    setCurrentRoute(route);
  }, [location.pathname, setCurrentRoute]);

  const filterWorkers = useCallback(
    (query) => {
      return workers.filter(
        (w) =>
          matchText(w.fullName, query) ||
          matchText(w._id, query) ||
          matchText(w.mobileNumber, query) ||
          matchText(w.trade, query) ||
          matchText(w.skillLevel, query) ||
          matchText(w.site, query) ||
          matchText(w.employeeCode, query)
      );
    },
    [workers]
  );

  const filterAttendance = useCallback(
    (query) => {
      return attendanceRecords.filter((record) => {
        const worker = record.worker || {};
        const site = record.site || {};
        return (
          matchText(worker.fullName, query) ||
          matchText(worker._id, query) ||
          matchText(worker.employeeCode, query) ||
          matchText(site.siteName, query) ||
          matchText(record.status, query) ||
          matchText(record.date, query) ||
          matchText(record.attendanceDate, query)
        );
      });
    },
    [attendanceRecords]
  );

  const filterSites = useCallback(
    (query) => {
      return sites.filter(
        (s) =>
          matchText(s.siteName, query) ||
          matchText(s._id, query) ||
          matchText(s.clientName, query) ||
          matchText(s.projectName, query) ||
          matchText(s.location, query) ||
          matchText(s.supervisor, query)
      );
    },
    [sites]
  );

  const filterPayroll = useCallback(
    (query) => {
      return payrolls.filter((p) => {
        const worker = p.worker || {};
        const site = p.site || {};
        return (
          matchText(worker.fullName, query) ||
          matchText(worker._id, query) ||
          matchText(worker.employeeCode, query) ||
          matchText(p.wageType, query) ||
          matchText(String(p.grossSalary), query) ||
          matchText(String(p.netSalary), query) ||
          matchText(site.siteName, query)
        );
      });
    },
    [payrolls]
  );

  const performSearch = useCallback(
    (query) => {
      if (!query || query.trim() === "") {
        if (isMountedRef.current) {
          setSearchResults([]);
          setIsLoading(false);
          setActiveIndex(-1);
        }
        return;
      }

      const q = query.trim().toLowerCase();
      const route = currentRoute;

      let results = [];

      if (route === "dashboard") {
        const workerMatches = filterWorkers(q).map((w) => ({
          type: "workers",
          label: "Workers",
          title: w.fullName,
          subtitle: `ID: ${w._id} | ${w.mobileNumber} | ${w.site || "Unassigned"}`,
          route: `/workers/${w._id}`,
          data: w,
        }));

        const siteMatches = filterSites(q).map((s) => ({
          type: "sites",
          label: "Sites",
          title: s.siteName,
          subtitle: `${s.clientName || "No Client"} | ${s.location || "No Location"}`,
          route: `/sites`,
          data: s,
        }));

        const attendanceMatches = filterAttendance(q).map((r) => {
          const worker = r.worker || {};
          const site = r.site || {};
          return {
            type: "attendance",
            label: "Attendance",
            title: `${worker.fullName || "Unknown"} - ${r.status}`,
            subtitle: `${site.siteName || "No Site"} | ${r.date || r.attendanceDate || "-"}`,
            route: `/attendance`,
            data: r,
          };
        });

        const payrollMatches = filterPayroll(q).map((p) => {
          const worker = p.worker || {};
          const site = p.site || {};
          return {
            type: "payroll",
            label: "Payroll",
            title: `${worker.fullName || "Unknown"}`,
            subtitle: `${site.siteName || "No Site"} | ${p.wageType} | ₹${p.netSalary || 0}`,
            route: `/salary`,
            data: p,
          };
        });

        results = [
          ...workerMatches.map((r) => ({ ...r, section: "Workers" })),
          ...siteMatches.map((r) => ({ ...r, section: "Sites" })),
          ...attendanceMatches.map((r) => ({ ...r, section: "Attendance" })),
          ...payrollMatches.map((r) => ({ ...r, section: "Payroll" })),
        ];
      } else if (route === "workers") {
        results = filterWorkers(q).map((w) => ({
          type: "workers",
          label: "Workers",
          title: w.fullName,
          subtitle: `ID: ${w._id} | ${w.mobileNumber} | ${w.site || "Unassigned"} | ${w.trade}`,
          route: `/workers/${w._id}`,
          data: w,
          section: "Workers",
        }));
      } else if (route === "attendance") {
        results = filterAttendance(q).map((r) => {
          const worker = r.worker || {};
          const site = r.site || {};
          return {
            type: "attendance",
            label: "Attendance",
            title: `${worker.fullName || "Unknown"} - ${r.status}`,
            subtitle: `${site.siteName || "No Site"} | ${r.date || r.attendanceDate || "-"} | ${worker._id || ""}`,
            route: `/attendance`,
            data: r,
            section: "Attendance",
          };
        });
      } else if (route === "sites") {
        results = filterSites(q).map((s) => ({
          type: "sites",
          label: "Sites",
          title: s.siteName,
          subtitle: `${s.clientName || "No Client"} | ${s.projectName || "No Project"} | ${s.location || "No Location"} | Supervisor: ${s.supervisor || "-"}`,
          route: `/sites`,
          data: s,
          section: "Sites",
        }));
      } else if (route === "salary" || route === "payroll") {
        results = filterPayroll(q).map((p) => {
          const worker = p.worker || {};
          const site = p.site || {};
          return {
            type: "payroll",
            label: "Payroll",
            title: `${worker.fullName || "Unknown"}`,
            subtitle: `${site.siteName || "No Site"} | ${p.wageType} | ₹${p.netSalary || 0}`,
            route: `/salary`,
            data: p,
            section: "Payroll",
          };
        });
      }

      if (isMountedRef.current) {
        setSearchResults(results);
        setActiveIndex(-1);
      }
    },
    [
      currentRoute,
      filterWorkers,
      filterAttendance,
      filterSites,
      filterPayroll,
      setSearchResults,
      setIsLoading,
      setActiveIndex,
    ]
  );

  const debouncedSearch = useCallback(
    (query) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!query || query.trim() === "") {
        if (isMountedRef.current) {
          setSearchResults([]);
          setIsLoading(false);
          setActiveIndex(-1);
        }
        return;
      }

      if (isMountedRef.current) {
        setIsLoading(true);
      }

      debounceTimerRef.current = setTimeout(() => {
        performSearch(query);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }, DEBOUNCE_MS);
    },
    [performSearch, setIsLoading]
  );

  const handleSearchChange = useCallback(
    (query) => {
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [setSearchQuery, debouncedSearch]
  );

  const handleResultClick = useCallback(
    (result) => {
      if (result && result.route) {
        navigate(result.route);
        setIsOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setActiveIndex(-1);
      }
    },
    [navigate, setIsOpen, setSearchQuery, setSearchResults, setActiveIndex]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen || searchResults.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < searchResults.length) {
            handleResultClick(searchResults[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
          break;
        default:
          break;
      }
    },
    [isOpen, searchResults, activeIndex, handleResultClick, setIsOpen, setActiveIndex]
  );

  const highlightMatch = useCallback((text, query) => {
    if (!text || !query || query.trim() === "") return String(text);
    const q = query.trim().toLowerCase();
    const str = String(text);
    const lowerStr = str.toLowerCase();
    const index = lowerStr.indexOf(q);
    if (index === -1) return str;
    return (
      str.slice(0, index) +
      "<mark>" +
      str.slice(index, index + query.trim().length) +
      "</mark>" +
      str.slice(index + query.trim().length)
    );
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    searchResults,
    isLoading,
    activeIndex,
    setActiveIndex,
    isOpen,
    setIsOpen,
    currentRoute,
    handleResultClick,
    handleKeyDown,
    highlightMatch,
    clearSearch,
  };
};

export default useGlobalSearch;