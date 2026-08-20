import React, { useState, useEffect, useMemo } from "react";
import { FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useAttendance from "../../hooks/useAttendance";
import useSites from "../../hooks/useSites";
import useExport from "../../hooks/useExport";
import { useSearch } from "../../context/SearchContext";

import AttendanceSummary from "../../components/attendance/AttendanceSummary";
import AttendanceFilter from "../../components/attendance/AttendanceFilter";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceHistoryModal from "../../components/attendance/AttendanceHistoryModal";
import MarkAttendanceModal from "../../components/attendance/MarkAttendanceModal";

import { AttendanceContainer, Header, TitleSection, ActionSection, Button } from "./Attendance.style";

const Attendance = () => {
  const {
    attendanceRecords, summary, pagination, loading,
    fetchAttendance, fetchSummary, changeStatus, removeAttendance
  } = useAttendance();
  const { sites, fetchSites } = useSites();
  const { exportAttendancePdf, downloading } = useExport();
  const { searchQuery } = useSearch();

  const [search, setSearch] = useState("");
  const [siteId, setSiteId] = useState("");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (!sites || sites.length === 0) {
      fetchSites({ limit: 100 });
    }
    fetchSummary();
  }, []);

  useEffect(() => {
    const params = { page, limit };
    if (siteId && siteId !== "All") params.site = siteId;
    if (status && status !== "All") params.status = status;
    if (date) params.attendanceDate = date;

    fetchAttendance(params);
  }, [page, siteId, status, date]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [markOpen, setMarkOpen] = useState(false);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const attendanceData = Array.isArray(attendanceRecords) ? attendanceRecords : [];
  const sitesData = Array.isArray(sites) ? sites : [];

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const globalKeyword = searchQuery.trim().toLowerCase();
    const effectiveKeyword = globalKeyword || keyword;

    if (!effectiveKeyword) {
      return attendanceData;
    }

    return attendanceData.filter((record) => {
      const worker = record.worker || {};
      const site = record.site || {};
      return (
        String(worker.fullName || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(worker._id || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(worker.employeeCode || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(site.siteName || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(record.status || "")
          .toLowerCase()
          .includes(effectiveKeyword) ||
        String(record.date || record.attendanceDate || "")
          .toLowerCase()
          .includes(effectiveKeyword)
      );
    });
  }, [attendanceData, search, searchQuery]);

  return (
    <AttendanceContainer>
      <Header>
        <TitleSection>
          <h2>Attendance Management</h2>
          <p>Daily attendance tracking for all workers</p>
        </TitleSection>
        <ActionSection>
          <Button onClick={() => setMarkOpen(true)}>
            Mark New Attendance
          </Button>
          <Button
            onClick={() => exportAttendancePdf()}
            disabled={downloading.attendancePdf}
          >
            <FiDownload />
            {downloading.attendancePdf ? "Exporting…" : "Export Report"}
          </Button>
        </ActionSection>
      </Header>

      {loading && !attendanceData.length ? (
        <div style={{ padding: "var(--content-padding)", textAlign: "center", color: "var(--text-secondary)" }}>
          Loading attendance records...
        </div>
      ) : (
        <>
          <AttendanceSummary summary={summary || {}} />

          {/* Reusing existing filter mapping, note props change internally if needed */}
          <AttendanceFilter
            search={search}
            setSearch={setSearch}
            site={siteId}
            setSite={(val) => { setSiteId(val); setPage(1); }}
            status={status}
            setStatus={(val) => { setStatus(val); setPage(1); }}
            month={date}
            setMonth={(val) => { setDate(val); setPage(1); }}
            sites={[{ _id: "All", siteName: "All" }, ...sitesData]}
          />

          <AttendanceTable
            records={filteredRecords}
            onHistory={(record) => {
              setSelectedRecord(record);
              setHistoryOpen(true);
            }}
            onMark={(record) => {
              setSelectedRecord(record);
              setMarkOpen(true);
            }}
            onChangeStatus={(id, newStatus) => {
              changeStatus(id, newStatus);
            }}
            onDelete={(id) => {
              removeAttendance(id);
            }}
          />

          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
                <FiChevronLeft /> Prev
              </Button>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Page {page} of {pagination.totalPages}
              </span>
              <Button disabled={page === pagination.totalPages} onClick={() => handlePageChange(page + 1)}>
                Next <FiChevronRight />
              </Button>
            </div>
          )}

          <AttendanceHistoryModal
            open={historyOpen}
            workerId={selectedRecord?.worker?._id || selectedRecord?.worker}
            onClose={() => setHistoryOpen(false)}
          />

          <MarkAttendanceModal
            open={markOpen}
            record={selectedRecord}
            onClose={() => setMarkOpen(false)}
          />
        </>
      )}
    </AttendanceContainer>
  );
};

export default Attendance;