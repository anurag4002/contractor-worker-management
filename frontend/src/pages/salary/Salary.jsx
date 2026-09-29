import { useMemo, useState, useEffect, useCallback, useRef } from "react";

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
    loading,
    fetchPayrolls,
    fetchSummary,
    processAdvancePayment,
  } = usePayroll();

  const { sites, fetchSites } = useSites();

  const { searchQuery } = useSearch();

  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [site, setSite] = useState(DEFAULT_FILTERS.site);
  const [month, setMonth] = useState(DEFAULT_FILTERS.month);

  const [page, setPage] = useState(1);

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [slipOpen, setSlipOpen] = useState(false);

  const [advanceOpen, setAdvanceOpen] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);

  const sitesData = useMemo(() => Array.isArray(sites) ? sites : [], [sites]);

  const isLoading = loading ?? false;

  const salaryData = useMemo(() => Array.isArray(payrolls) ? payrolls : [], [payrolls]);

  const sitesDataRef = useRef(sitesData);

  useEffect(() => {
    sitesDataRef.current = sitesData;
  });

  useEffect(() => {
    fetchSummary();
    if (!sitesData || sitesData.length === 0) {
      fetchSites({ limit: 100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (site && site !== "All") {
      const siteObj = sitesDataRef.current.find(
        (s) => s.siteName === site
      );
      if (siteObj) params.site = siteObj._id;
    }
    if (month) {
      const [year, monthValue] = month.split("-");
      params.attendanceYear = Number(year);
      params.attendanceMonth = Number(monthValue);
    }
    fetchPayrolls(params);
  }, [page, site, month, fetchPayrolls]);

  const filteredWorkers = useMemo(() => {
    const keyword = search.toLowerCase();
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
  }, [salaryData, search, searchQuery]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleSiteChange = (value) => {
    setSite(value);
    setPage(1);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
    setPage(1);
  };

  const handleFilterReset = () => {
    setSearch(DEFAULT_FILTERS.search);
    setSite(DEFAULT_FILTERS.site);
    setMonth(DEFAULT_FILTERS.month);
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
      if (search) params.search = search;
      if (site && site !== "All") {
        const siteObj = sitesData.find(
          (s) => s.siteName === site
        );
        if (siteObj) params.site = siteObj._id;
      }
      if (month) {
        const [year, monthValue] = month.split("-");
        params.attendanceYear = Number(year);
        params.attendanceMonth = Number(monthValue);
      }
      await exportService.exportPayrollPdf(params);
    } catch (error) {
      showError(error);
    }
  }, [search, site, month, sitesData]);

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

      <SalarySummary
        workers={filteredWorkers}
      />

      <SalaryFilter
        search={search}
        setSearch={handleSearchChange}
        site={site}
        setSite={handleSiteChange}
        wageType="All"
        setWageType={() => {}}
        month={month}
        setMonth={handleMonthChange}
        sites={[
          "All",
          ...sitesData.map((item) => item.siteName),
        ]}
        onReset={handleFilterReset}
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
    </SalaryContainer>
  );
};

export default Salary;