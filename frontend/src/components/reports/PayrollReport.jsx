import React, { useState, useEffect } from "react";
import useReport from "../../hooks/useReport";
import { exportToExcel, exportToPDF } from "../../utils/export.utils";
import { FiDownload, FiFileText } from "react-icons/fi";
import { TableCard, Table, ReportContainer, FilterControls } from "./ReportTable.style";
import FilterBar from "../ui/FilterBar";
import Select from "../ui/Select";
import Button from "../ui/Button";
import StatusBadge from "../ui/StatusBadge";
import SkeletonRows from "../ui/SkeletonRows";
import EmptyState from "../ui/EmptyState";
import Pagination from "../ui/Pagination";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const PayrollReport = ({ sites = [] }) => {
    const { payrollReport, pagination, loading, fetchPayrollReport } = useReport();
    const [filters, setFilters] = useState({ status: "", site: "", attendanceMonth: "", attendanceYear: "" });
    const [page, setPage] = useState(1);

    useEffect(() => {
        const params = { page, limit: 10 };
        if (filters.status) params.status = filters.status;
        if (filters.site) params.site = filters.site;
        if (filters.attendanceMonth) params.attendanceMonth = filters.attendanceMonth;
        if (filters.attendanceYear) params.attendanceYear = filters.attendanceYear;
        fetchPayrollReport(params);
    }, [page, filters]);

    const data = Array.isArray(payrollReport) ? payrollReport : [];
    const set = (k, v) => { setFilters((p) => ({ ...p, [k]: v })); setPage(1); };

    const handleExcel = () =>
        exportToExcel(
            data.map((p) => ({
                Worker: p.worker?.fullName || "",
                Site: p.site?.siteName || "",
                Month: MONTHS[p.attendanceMonth] || "",
                Year: p.attendanceYear || "",
                "Daily Wage": p.dailyWage || 0,
                "Net Payable": p.netPayable || 0,
                Status: p.status || "",
            })),
            "Payroll_Report"
        );

    const handlePDF = () =>
        exportToPDF(
            "Payroll Report",
            ["Worker", "Month/Year", "Daily Wage", "Net Payable", "Status"],
            data.map((p) => [
                p.worker?.fullName,
                `${MONTHS[p.attendanceMonth]} ${p.attendanceYear}`,
                `₹${p.dailyWage}`,
                `₹${p.netPayable}`,
                p.status,
            ]),
            "Payroll_Report"
        );

    return (
        <ReportContainer>
            <FilterBar>
                <Select value={filters.status} onChange={(e) => set("status", e.target.value)}>
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="GENERATED">Generated</option>
                    <option value="PAID">Paid</option>
                    <option value="CANCELLED">Cancelled</option>
                </Select>
                <Select value={filters.attendanceMonth} onChange={(e) => set("attendanceMonth", e.target.value)}>
                    <option value="">All Months</option>
                    {MONTHS.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </Select>
                <Select value={filters.attendanceYear} onChange={(e) => set("attendanceYear", e.target.value)}>
                    <option value="">All Years</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </Select>
                <Select value={filters.site} onChange={(e) => set("site", e.target.value)}>
                    <option value="">All Sites</option>
                    {sites.map((s) => <option key={s._id} value={s._id}>{s.siteName}</option>)}
                </Select>
                <Button variant="secondary" onClick={() => { setFilters({ status: "", site: "", attendanceMonth: "", attendanceYear: "" }); setPage(1); }}>
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
                            <th>#</th><th>Worker</th><th>Site</th><th>Month/Year</th>
                            <th>Daily Wage</th><th>Net Payable</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody aria-live="polite">
                        {loading ? (
                            <SkeletonRows cols={7} count={6} />
                        ) : data.length === 0 ? (
                            <tr><td colSpan="7"><EmptyState message="No payroll records found." /></td></tr>
                        ) : data.map((p, i) => (
                            <tr key={p._id || i}>
                                <td>{(page - 1) * 10 + i + 1}</td>
                                <td>{p.worker?.fullName || "—"}</td>
                                <td>{p.site?.siteName || "—"}</td>
                                <td>{MONTHS[p.attendanceMonth]} {p.attendanceYear}</td>
                                <td>₹{(p.dailyWage || 0).toLocaleString("en-IN")}</td>
                                <td><strong style={{ fontWeight: 600 }}>₹{(p.netPayable || 0).toLocaleString("en-IN")}</strong></td>
                                <td><StatusBadge status={p.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableCard>

            <Pagination page={page} totalPages={pagination?.totalPages} total={pagination?.total} onPageChange={setPage} />
        </ReportContainer>
    );
};

export default PayrollReport;
