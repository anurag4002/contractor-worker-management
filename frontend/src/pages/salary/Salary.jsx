import React, { useMemo, useState } from "react";

import salaryData from "./Salary.data.json";

import SalarySummary from "../../components/salary/SalarySummary";
import SalaryFilter from "../../components/salary/SalaryFilter";
import SalaryTable from "../../components/salary/SalaryTable";
import AdvancePaymentModal from "../../components/salary/AdvancePaymentModal";
import PaymentHistoryModal from "../../components/salary/PaymentHistoryModal";
import SalarySlipModal from "../../components/salary/SalarySlipModal";

import {
  SalaryContainer,
  Header,
  TitleSection,
  ActionSection,
  Button,
} from "./Salary.style";

const Salary = () => {

  const [workers, setWorkers] = useState(
    salaryData.salary
  );

  const [search, setSearch] = useState("");

  const [site, setSite] = useState("All");

  const [status, setStatus] = useState("All");

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [advanceOpen, setAdvanceOpen] =
    useState(false);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [slipOpen, setSlipOpen] =
    useState(false);

  const sites = [
    "All",
    ...new Set(
      workers.map((item) => item.site)
    ),
  ];

  const filteredWorkers = useMemo(() => {

    return workers.filter((worker) => {

      const searchMatch =

        worker.name
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        worker.id
          .toLowerCase()
          .includes(search.toLowerCase());

      const siteMatch =
        site === "All"
          ? true
          : worker.site === site;

      const statusMatch =
        status === "All"
          ? true
          : worker.status === status;

      return (
        searchMatch &&
        siteMatch &&
        statusMatch
      );

    });

  }, [
    workers,
    search,
    site,
    status,
  ]);

  const paySalary = (worker) => {

    setWorkers((prev)=>

      prev.map((item)=>{

        if(item.id===worker.id){

          const totalSalary =
            item.dailyWage *
            item.daysWorked;

          return{

            ...item,

            paid: totalSalary,

            status:"Paid",

          };

        }

        return item;

      })

    );

  };

  const updateAdvance = (
    id,
    amount
  ) => {

    setWorkers((prev)=>

      prev.map((item)=>

        item.id===id

          ?{

              ...item,

              advance:amount,

            }

          :item

      )

    );

  };

  const openAdvance = (worker)=>{

    setSelectedWorker(worker);

    setAdvanceOpen(true);

  };

  const openHistory = (worker)=>{

    setSelectedWorker(worker);

    setHistoryOpen(true);

  };

  const openSlip = (worker)=>{

    setSelectedWorker(worker);

    setSlipOpen(true);

  };

  const editSalary = (worker)=>{

    alert(
      `Edit Salary of ${worker.name}`
    );

  };
    return (

    <SalaryContainer>

      {/* ================= Header ================= */}

      <Header>

        <TitleSection>

          <h2>

            {salaryData.title}

          </h2>

          <p>

            {salaryData.description}

          </p>

        </TitleSection>

        <ActionSection>

          <Button>

            Export Report

          </Button>

        </ActionSection>

      </Header>

      {/* ================= Summary ================= */}

      <SalarySummary
        workers={workers}
      />

      {/* ================= Filters ================= */}

      <SalaryFilter

        search={search}

        setSearch={setSearch}

        site={site}

        setSite={setSite}

        status={status}

        setStatus={setStatus}

        sites={sites}

      />

      {/* ================= Salary Table ================= */}

      <SalaryTable

        workers={filteredWorkers}

        onPaySalary={paySalary}

        onAdvance={openAdvance}

        onHistory={openHistory}

        onEdit={openSlip}

      />

      {/* ================= Advance Modal ================= */}

      <AdvancePaymentModal

        open={advanceOpen}

        worker={selectedWorker}

        onClose={() =>
          setAdvanceOpen(false)
        }

        onSave={updateAdvance}

      />

      {/* ================= Payment History ================= */}

      <PaymentHistoryModal

        open={historyOpen}

        worker={selectedWorker}

        onClose={() =>
          setHistoryOpen(false)
        }

      />

      {/* ================= Salary Slip ================= */}

      <SalarySlipModal

        open={slipOpen}

        worker={selectedWorker}

        onClose={() =>
          setSlipOpen(false)
        }

      />

    </SalaryContainer>

  );

};

export default Salary;