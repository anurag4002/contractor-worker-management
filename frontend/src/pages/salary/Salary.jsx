import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

import { FiDownload } from "react-icons/fi";

import usePayroll from "../../hooks/usePayroll";
import useSites from "../../hooks/useSites";
import { useSearch } from "../../context/SearchContext";

import { showError } from "../../components/common/toast";

import exportService from "../../services/export.service";

import SalarySummary from "../../components/salary/SalarySummary";
import SalaryFilter from "../../components/salary/SalaryFilter";
import SalaryTable from "../../components/salary/SalaryTable";
import SalarySlipModal from "../../components/salary/SalarySlipModal";
import AdvancePaymentModal from "../../components/salary/AdvancePaymentModal";
import PaymentHistoryModal from "../../components/salary/PaymentHistoryModal";

import {
  SalaryContainer,
  Header,
  TitleSection,
  ActionSection,
  Button,
} from "./Salary.style";

const DEFAULT_FILTERS = {
  search: "",
  site: "All",
  month: "",
};

const Salary = () => {
  const {
    payrolls,
    summary,
    loading,
    fetchPayrolls,
    fetchSummary,
    processAdvancePayment,
  } = usePayroll();

  const { sites, fetchSites } = useSites();

  const { searchQuery } = useSearch();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [page, setPage] = useState(1);

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [slipOpen, setSlipOpen] = useState(false);

  const [advanceOpen, setAdvanceOpen] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);

  const sitesData = Array.isArray(sites) ? sites : [];

  const isLoading = loading ?? false;

  const salaryData = Array.isArray(payrolls) ? payrolls : [];

  useEffect(() => {
    fetchSummary();
    if (!sitesData || sitesData.length === 0) {
      fetchSites({ limit: 100 });
    }
    const params = { page, limit: 10 };
    if (filters.search) params.search = filters.search;
    if (filters.site && filters.site !== "All") {
      const siteObj = sitesData.find(
        (s) => s.siteName === filters.site
      );
      if (siteObj) params.site = siteObj._id;
    }
    if (filters.month) {
      const [year, month] = filters.month.split("-");
      params.attendanceYear = Number(year);
      params.attendanceMonth = Number(month);
    }
    fetchPayrolls(params);
  }, []);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (filters.search) params.search = filters.search;
    if (filters.site && filters.site !== "All") {
      const siteObj = sitesData.find(
        (s) => s.siteName === filters.site
      );
      if (siteObj) params.site = siteObj._id;
    }
    if (filters.month) {
      const [year, month] = filters.month.split("-");
      params.attendanceYear = Number(year);
      params.attendanceMonth = Number(month);
    }
    fetchPayrolls(params);
  }, [page, filters, sitesData]);

  const filteredWorkers = useMemo(() => {
    const keyword = filters.search.toLowerCase();
    const globalKeyword = searchQuery.trim().toLowerCase();
    const effectiveKeyword = globalKeyword || keyword;

    let result = salaryData;

    if (effectiveKeyword) {
      result = result.filter(
        (worker) =>
          worker.worker?.fullName
            ?.toLowerCase()
            .includes(effectiveKeyword) ||
          worker._id
            ?.toLowerCase()
            .includes(effectiveKeyword) ||
          worker.site?.siteName
            ?.toLowerCase()
            .includes(effectiveKeyword) ||
          String(worker.dailyWage || 0)
            .toLowerCase()
            .includes(effectiveKeyword)
      );
    }

    return result;
  }, [salaryData, filters.search, searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleFilterReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleAdvancePayment = useCallback(
    async (payrollId, payload) => {
      try {
        await processAdvancePayment(payrollId, {
          amount: Number(payload.amount),
          paymentMethod: payload.paymentMethod,
          transactionId: payload.transactionId,
          remark: payload.remark,
        });
      } catch (error) {
        showError(error);
        throw error;
      }
    },
    [processAdvancePayment]
  );

  const handleExport = useCallback(async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.site && filters.site !== "All") {
        const siteObj = sitesData.find(
          (s) => s.siteName === filters.site
        );
        if (siteObj) params.site = siteObj._id;
      }
      if (filters.month) {
        const [year, month] = filters.month.split("-");
        params.attendanceYear = Number(year);
        params.attendanceMonth = Number(month);
      }
      await exportService.exportPayrollPdf(params);
    } catch (error) {
      showError(error);
    }
  }, [filters, sitesData]);

  return (
    <SalaryContainer>
      <Header>
        <TitleSection>
          <h2>Salary Management</h2>
          <p>
            Daily wages, advances and salary records
          </p>
        </TitleSection>

        <ActionSection>
          <Button onClick={handleExport}>
            <FiDownload />
            Export Report
          </Button>
        </ActionSection>
      </Header>

      {isLoading && !salaryData.length ? (
        <div
          style={{
            padding: "var(--content-padding)",
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          Loading salary records...
        </div>
      ) : (
        <>
          <SalarySummary
            workers={filteredWorkers}
          />

          <SalaryFilter
            search={filters.search}
            setSearch={(value) =>
              handleFilterChange("search", value)
            }
            site={filters.site}
            setSite={(value) =>
              handleFilterChange("site", value)
            }
            wageType="All"
            setWageType={() => {}}
            month={filters.month}
            setMonth={(value) =>
              handleFilterChange("month", value)
            }
            sites={[
              "All",
              ...sitesData.map((item) => item.siteName),
            ]}
          />

          <SalaryTable
            workers={filteredWorkers}
            onView={(worker) => {
              setSelectedWorker(worker);
              setSlipOpen(true);
            }}
            onAdvance={(worker) => {
              setSelectedWorker(worker);
              setAdvanceOpen(true);
            }}
            onHistory={(worker) => {
              setSelectedWorker(worker);
              setHistoryOpen(true);
            }}
          />

          <SalarySlipModal
            open={slipOpen}
            worker={selectedWorker}
            onClose={() => setSlipOpen(false)}
          />

          <AdvancePaymentModal
            open={advanceOpen}
            worker={selectedWorker}
            onClose={() => setAdvanceOpen(false)}
            onSave={handleAdvancePayment}
          />

          <PaymentHistoryModal
            open={historyOpen}
            worker={selectedWorker}
            onClose={() => setHistoryOpen(false)}
          />
        </>
      )}
    </SalaryContainer>
  );
};

export default Salary;