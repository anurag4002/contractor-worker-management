import React, {
  useMemo,
  useState,
} from "react";

import { FiDownload } from "react-icons/fi";

import useWorkers from "../../hooks/useWorkers";

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

const Salary = () => {

  const {

    salarySummary,

    loading,

    addAdvancePayment,

    sites,

  } = useWorkers();

  const salaryData =
    Array.isArray(salarySummary) ? salarySummary : [];

  const sitesData =
    Array.isArray(sites) ? sites : [];

  const isLoading = loading ?? false;

  const [search, setSearch] =
    useState("");

  const [site, setSite] =
    useState("All");

  const [wageType, setWageType] =
    useState("All");

  const [month, setMonth] =
    useState("");

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [slipOpen, setSlipOpen] =
    useState(false);

  const [advanceOpen, setAdvanceOpen] =
    useState(false);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const filteredWorkers = useMemo(() => {

    return salaryData.filter((worker) => {

      const keyword =
        search.toLowerCase();

      const searchMatch =

        worker.name
          ?.toLowerCase()
          .includes(keyword)

        ||

        worker.id
          ?.toLowerCase()
          .includes(keyword);

      const siteMatch =

        site === "All"

          ? true

          : worker.site === site;

      const wageMatch =

        wageType === "All"

          ? true

          : worker.wageType === wageType;

      const monthMatch =

        month === ""

          ? true

          : true;

      return (

        searchMatch &&

        siteMatch &&

        wageMatch &&

        monthMatch

      );

    });

  }, [

    salaryData,

    search,

    site,

    wageType,

    month,

  ]);

  const handleAdvancePayment = (

    id,

    amount,

    method,

    remark

  ) => {

    addAdvancePayment(id, {

      amount: Number(amount),

      method,

      remark,

      date: new Date()

        .toISOString()

        .split("T")[0],

    });

  };

  return (

    <SalaryContainer>

      <Header>

        <TitleSection>

          <h2>

            Salary Management

          </h2>

          <p>

            Daily wages, advances and salary records

          </p>

        </TitleSection>

        <ActionSection>

          <Button>

            <FiDownload />

            Export Report

          </Button>

        </ActionSection>

      </Header>

      {isLoading ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#64748b",
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

        search={search}

        setSearch={setSearch}

        site={site}

        setSite={setSite}

        wageType={wageType}

        setWageType={setWageType}

        month={month}

        setMonth={setMonth}

        sites={[

          "All",

          ...sitesData.map(

            (item) => item.name

          ),

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

        onClose={() =>

          setSlipOpen(false)

        }

      />

      <AdvancePaymentModal

        open={advanceOpen}

        worker={selectedWorker}

        onClose={() =>

          setAdvanceOpen(false)

        }

        onSave={handleAdvancePayment}

      />

          <PaymentHistoryModal

            open={historyOpen}

            worker={selectedWorker}

            onClose={() =>

              setHistoryOpen(false)

            }

          />
        </>
      )}

    </SalaryContainer>

  );

};

export default Salary;