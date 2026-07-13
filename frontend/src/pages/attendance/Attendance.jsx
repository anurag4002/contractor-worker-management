import React, {
  useMemo,
  useState,
} from "react";

import { FiDownload } from "react-icons/fi";

import useWorkers from "../../hooks/useWorkers";

import AttendanceSummary from "../../components/attendance/AttendanceSummary";
import AttendanceFilter from "../../components/attendance/AttendanceFilter";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceHistoryModal from "../../components/attendance/AttendanceHistoryModal";
import MarkAttendanceModal from "../../components/attendance/MarkAttendanceModal";

import {
  AttendanceContainer,
  Header,
  TitleSection,
  ActionSection,
  Button,
} from "./Attendance.style";

const Attendance = () => {

  const {

    attendance,

    markAttendance,

    attendanceSummary,

    sites,

  } = useWorkers();

  const [search, setSearch] =
    useState("");

  const [site, setSite] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  const [month, setMonth] =
    useState("");

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [markOpen, setMarkOpen] =
    useState(false);

  const filteredWorkers = useMemo(() => {

    return attendance.filter((worker) => {

      const keyword =
        search.toLowerCase();

      const searchMatch =

        String(worker.name || "")
          .toLowerCase()
          .includes(keyword)

        ||

        String(worker.id || "")
          .toLowerCase()
          .includes(keyword);

      const siteMatch =

        site === "All"

          ? true

          : worker.site === site;

      const statusMatch =

        status === "All"

          ? true

          : worker.status === status;

      const monthMatch =

        month === ""

          ? true

          : worker.date?.startsWith(month);

      return (

        searchMatch &&

        siteMatch &&

        statusMatch &&

        monthMatch

      );

    });

  }, [

    attendance,

    search,

    site,

    status,

    month,

  ]);

  const handleAttendance = (
    id,
    values
  ) => {

    markAttendance({

      workerId: id,

      status: values.status,

      remark: values.remark,

      date: new Date()
        .toISOString()
        .split("T")[0],

      site:
        selectedWorker?.site || "",

      name:
        selectedWorker?.name || "",

      id,

    });

    setMarkOpen(false);

  };

  return (

    <AttendanceContainer>

      <Header>

        <TitleSection>

          <h2>

            Attendance Management

          </h2>

          <p>

            Daily attendance tracking for all workers

          </p>

        </TitleSection>

        <ActionSection>

          <Button>

            <FiDownload />

            Export Report

          </Button>

        </ActionSection>

      </Header>

      <AttendanceSummary

        workers={attendanceSummary}

      />

      <AttendanceFilter

        search={search}

        setSearch={setSearch}

        site={site}

        setSite={setSite}

        status={status}

        setStatus={setStatus}

        month={month}

        setMonth={setMonth}

        sites={[

          "All",

          ...sites.map(

            (item) => item.name

          ),

        ]}

      />

      <AttendanceTable

        workers={filteredWorkers}

        onHistory={(worker) => {

          setSelectedWorker(worker);

          setHistoryOpen(true);

        }}

        onMark={(worker) => {

          setSelectedWorker(worker);

          setMarkOpen(true);

        }}

      />

      <AttendanceHistoryModal

        open={historyOpen}

        worker={selectedWorker}

        onClose={() =>

          setHistoryOpen(false)

        }

      />

      <MarkAttendanceModal

        open={markOpen}

        worker={selectedWorker}

        onClose={() =>

          setMarkOpen(false)

        }

        onSave={handleAttendance}

      />

    </AttendanceContainer>

  );

};

export default Attendance;