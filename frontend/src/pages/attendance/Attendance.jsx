import React, { useState, useEffect } from "react";
import { FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useAttendance from "../../hooks/useAttendance";
import useSites from "../../hooks/useSites";

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

  const [search, setSearch] = useState(""); // Not directly mapped in backend attendance validator maybe, we'll try workerId if they type manually or just keep it
  const [siteId, setSiteId] = useState("");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    // Only fetch sites once if not loaded
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
          <Button>
            <FiDownload /> Export Report
          </Button>
        </ActionSection>
      </Header>

      {loading && !attendanceData.length ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
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
            records={attendanceData}
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
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