import React, { useMemo, useState } from "react";

import attendanceData from "./Attendance.data.json";

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

  const [workers, setWorkers] = useState(
    attendanceData.attendance
  );

  const [search, setSearch] = useState("");

  const [site, setSite] = useState("All");

  const [status, setStatus] = useState("All");

  const [date, setDate] = useState("");

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [markOpen, setMarkOpen] =
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
          .includes(search.toLowerCase()) ||

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

      const dateMatch =
        date === ""
          ? true
          : worker.date === date;

      return (
        searchMatch &&
        siteMatch &&
        statusMatch &&
        dateMatch
      );

    });

  }, [
    workers,
    search,
    site,
    status,
    date,
  ]);

  const updateStatus = (id, newStatus) => {

    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === id
          ? {
              ...worker,
              status: newStatus,
            }
          : worker
      )
    );

  };

  const saveAttendance = (id, data) => {

    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === id
          ? {
              ...worker,
              ...data,
            }
          : worker
      )
    );

  };
    return (

    <AttendanceContainer>

      <Header>

        <TitleSection>

          <h2>
            {attendanceData.title}
          </h2>

          <p>
            {attendanceData.description}
          </p>

        </TitleSection>

        <ActionSection>

          <Button>

            Export Report

          </Button>

        </ActionSection>

      </Header>

      {/* ================= Summary ================= */}

      <AttendanceSummary
        workers={workers}
      />

      {/* ================= Filter ================= */}

      <AttendanceFilter

        search={search}

        setSearch={setSearch}

        site={site}

        setSite={setSite}

        status={status}

        setStatus={setStatus}

        date={date}

        setDate={setDate}

        sites={sites}

      />

      {/* ================= Table ================= */}

      <AttendanceTable

        workers={filteredWorkers}

        onStatusChange={updateStatus}

        onHistory={(worker)=>{

          setSelectedWorker(worker);

          setHistoryOpen(true);

        }}

        onMark={(worker)=>{

          setSelectedWorker(worker);

          setMarkOpen(true);

        }}

      />

      {/* ================= History ================= */}

      <AttendanceHistoryModal

        open={historyOpen}

        worker={selectedWorker}

        history={
          selectedWorker
            ? workers.filter(
                item =>
                  item.id === selectedWorker.id
              )
            : []
        }

        onClose={()=>
          setHistoryOpen(false)
        }

      />

      {/* ================= Mark Attendance ================= */}

      <MarkAttendanceModal

        open={markOpen}

        worker={selectedWorker}

        onClose={()=>
          setMarkOpen(false)
        }

        onSave={saveAttendance}

      />

    </AttendanceContainer>

  );

};

export default Attendance;