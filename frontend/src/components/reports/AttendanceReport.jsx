import React, { useState, useEffect } from "react";
import useReport from "../../hooks/useReport";
import { exportToExcel, exportToPDF } from "../../utils/export.utils";
import { FiDownload, FiFileText } from "react-icons/fi";
import { TableCard, Table, ReportContainer, FilterControls, FilterLabel } from "./ReportTable.style";
import FilterBar from "../ui/FilterBar";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Button from "../ui/Button";
import StatusBadge from "../ui/StatusBadge";
import SkeletonRows from "../ui/SkeletonRows";
import EmptyState from "../ui/EmptyState";
import Pagination from "../ui/Pagination";

const STATUSES = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "HOLIDAY"];

const AttendanceReport = ({ sites = [] }) => {
    const { attendanceReport, pagination, loading, fetchAttendanceReport } = useReport();
    const [filters, setFilters] = useState({ status: "", site: "", fromDate: "", toDate: "" });
    const [page, setPage] = useState(1);

    useEffect(() => {
        const params = { page, limit: 10 };
        if (filters.status) params.status = filters.status;
        if (filters.site) params.site = filters.site;
        if (filters.fromDate) params.fromDate = filters.fromDate;
        if (filters.toDate) params.toDate = filters.toDate;
        fetchAttendanceReport(params);
    }, [page, filters]);

    const data = Array.isArray(attendanceReport) ? attendanceReport : [];
    const set = (k, v) => { setFilters((p) => ({ ...p, [k]: v })); setPage(1); };

    const handleExcel = () =>
        exportToExcel(
            data.map((r) => ({
                Worker: r.worker?.fullName || "",
                Site: r.site?.siteName || "",
                Date: r.attendanceDate?.slice(0, 10) || "",
                Status: r.status || "",
                "Regular Hrs": r.regularHours ?? 0,
                "Overtime Hrs": r.overtimeHours ?? 0,
                Remarks: r.remarks || "",
            })),
            "Attendance_Report"
        );

    const handlePDF = () =>
        exportToPDF(
            "Attendance Report",
            ["Worker", "Site", "Date", "Status", "Reg Hrs", "OT Hrs"],
            data.map((r) => [
                r.worker?.fullName, r.site?.siteName,
                r.attendanceDate?.slice(0, 10), r.status,
                r.regularHours, r.overtimeHours,
            ]),
            "Attendance_Report"
        );

    return (
        <ReportContainer>
            <FilterBar>
                <Select value={filters.status} onChange={(e) => set("status", e.target.value)}>
                    <option value="">All Status</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Select value={filters.site} onChange={(e) => set("site", e.target.value)}>
                    <option value="">All Sites</option>
                    {sites.map((s) => <option key={s._id} value={s._id}>{s.siteName}</option>)}
                </Select>
                <FilterLabel>From</FilterLabel>
                <Input type="date" value={filters.fromDate} onChange={(e) => set("fromDate", e.target.value)} />
                <FilterLabel>To</FilterLabel>
                <Input type="date" value={filters.toDate} onChange={(e) => set("toDate", e.target.value)} />
                <Button variant="secondary" onClick={() => { setFilters({ status: "", site: "", fromDate: "", toDate: "" }); setPage(1); }}>
                    Clear
                </Button>
                <FilterControls>
                    <Button variant="primary" onClick={handleExcel}><FiDownload /> Excel</Button>
                    <Button variant="ghost" onClick={handlePDF}><FiFileText /> PDF</Button>
                </FilterControls>
            </FilterBar>

            <TableCard>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th><th>Worker</th><th>Site</th><th>Date</th>
                            <th>Status</th><th>Reg Hrs</th><th>OT Hrs</th><th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody aria-live="polite">
                        {loading ? (
                            <SkeletonRows cols={8} count={6} />
                        ) : data.length === 0 ? (
                            <tr><td colSpan="8"><EmptyState message="No attendance records found." /></td></tr>
                        ) : data.map((r, i) => (
                            <tr key={r._id || i}>
                                <td>{(page - 1) * 10 + i + 1}</td>
                                <td>{r.worker?.fullName || "—"}</td>
                                <td>{r.site?.siteName || "—"}</td>
                                <td>{r.attendanceDate?.slice(0, 10) || "—"}</td>
                                <td><StatusBadge status={r.status} /></td>
                                <td>{r.regularHours ?? "—"}</td>
                                <td>{r.overtimeHours ?? 0}</td>
                                <td>{r.remarks || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableCard>

            <Pagination page={page} totalPages={pagination?.totalPages} total={pagination?.total} onPageChange={setPage} />
        </ReportContainer>
    );
};

export default AttendanceReport;
