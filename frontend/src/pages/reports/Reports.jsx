import React, {
  useMemo,
  useState,
} from "react";

import {
  FiDownload,
  FiFileText,
} from "react-icons/fi";

import useWorkers from "../../hooks/useWorkers";

import {
  exportToExcel,
  exportToPDF,
} from "../../utils/export.utils";

import ReportSummary from "../../components/reports/ReportSummary";
import ReportFilter from "../../components/reports/ReportFilter";
import ReportTable from "../../components/reports/ReportTable";
import ReportPreviewModal from "../../components/reports/ReportPreviewModal";

import {
  ReportsContainer,
  Header,
  TitleSection,
  ActionSection,
  Button,
} from "./Reports.style";

const Reports = () => {

  const {

    workerReport,

    sites,

  } = useWorkers();

  const [search, setSearch] =
    useState("");

  const [site, setSite] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  const [month, setMonth] =
    useState("All");

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const sitesList = [

    "All",

    ...new Set(

      sites.map(

        (item) => item.name

      )

    ),

  ];

  const months = [

    "All",

    "January",

    "February",

    "March",

    "April",

    "May",

    "June",

    "July",

    "August",

    "September",

    "October",

    "November",

    "December",

  ];

  const filteredReports = useMemo(() => {

    return workerReport.filter((report) => {

      const keyword =
        search.toLowerCase();

      const searchMatch =

        report.name
          .toLowerCase()
          .includes(keyword)

        ||

        report.id
          .toLowerCase()
          .includes(keyword);

      const siteMatch =

        site === "All"

          ? true

          : report.site === site;

      const statusMatch =

        status === "All"

          ? true

          : (

              report.balance <= 0

                ? "Paid"

                : report.balance <
                  report.grossSalary

                ? "Partial"

                : "Pending"

            ) === status;

      return (

        searchMatch &&

        siteMatch &&

        statusMatch

      );

    });

  }, [

    workerReport,

    search,

    site,

    status,

  ]);

  const handleExcelExport = () => {

    exportToExcel(

      filteredReports,

      "Worker_Report"

    );

  };

  const handlePDFExport = () => {

    exportToPDF(

      "Worker Report",

      [

        "ID",

        "Name",

        "Site",

        "Attendance",

        "Gross",

        "Net",

        "Balance",

      ],

      filteredReports.map(

        (item) => [

          item.id,

          item.name,

          item.site,

          `${item.attendance}%`,

          item.grossSalary,

          item.netSalary,

          item.balance,

        ]

      ),

      "Worker_Report"

    );

  };

  return (

    <ReportsContainer>

      <Header>

        <TitleSection>

          <h2>

            Reports

          </h2>

          <p>

            Worker Attendance, Salary & Site Reports

          </p>

        </TitleSection>

        <ActionSection>

          <Button

            onClick={handleExcelExport}

          >

            <FiDownload />

            Export Excel

          </Button>

          <Button

            onClick={handlePDFExport}

          >

            <FiFileText />

            Export PDF

          </Button>

        </ActionSection>

      </Header>

      <ReportSummary

        reports={filteredReports}

      />

      <ReportFilter

        search={search}

        setSearch={setSearch}

        site={site}

        setSite={setSite}

        month={month}

        setMonth={setMonth}

        status={status}

        setStatus={setStatus}

        sites={sitesList}

        months={months}

      />

      <ReportTable

        reports={filteredReports}

        onView={(report) => {

          setSelectedReport(report);

          setPreviewOpen(true);

        }}

      />

      <ReportPreviewModal

        open={previewOpen}

        report={selectedReport}

        onClose={() =>

          setPreviewOpen(false)

        }

      />

    </ReportsContainer>

  );

};

export default Reports;