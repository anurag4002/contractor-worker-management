import React, { useState, useEffect } from "react";
import useReport from "../../hooks/useReport";
import { exportToExcel, exportToPDF } from "../../utils/export.utils";
import { FiDownload, FiFileText } from "react-icons/fi";
import { TableCard, Table, ReportContainer, FilterControls } from "./ReportTable.style";
import FilterBar from "../ui/FilterBar";
import SearchBar from "../ui/SearchBar";
import Select from "../ui/Select";
import Button from "../ui/Button";
import StatusBadge from "../ui/StatusBadge";
import SkeletonRows from "../ui/SkeletonRows";
import EmptyState from "../ui/EmptyState";
import Pagination from "../ui/Pagination";

const WorkerReport = ({ sites = [] }) => {
    const { workerReport, pagination, loading, fetchWorkerReport } = useReport();
    const [filters, setFilters] = useState({ search: "", status: "", site: "", trade: "" });
    const [page, setPage] = useState(1);

    useEffect(() => {
        const params = { page, limit: 10 };
        if (filters.search) params.search = filters.search;
        if (filters.status) params.status = filters.status;
        if (filters.site) params.site = filters.site;
        if (filters.trade) params.trade = filters.trade;
        fetchWorkerReport(params);
    }, [page, filters]);

    const data = Array.isArray(workerReport) ? workerReport : [];
    const set = (k, v) => { setFilters((p) => ({ ...p, [k]: v })); setPage(1); };

    const handleExcel = () =>
        exportToExcel(
            data.map((w) => ({
                Name: w.fullName || "", Code: w.employeeCode || "",
                Trade: w.trade || "", Site: w.site?.siteName || "",
                Status: w.status || "", Mobile: w.mobileNumber || "",
            })),
            "Worker_Report"
        );

    const handlePDF = () =>
        exportToPDF(
            "Worker Report",
            ["Name", "Code", "Trade", "Site", "Status"],
            data.map((w) => [w.fullName, w.employeeCode, w.trade, w.site?.siteName, w.status]),
            "Worker_Report"
        );

    return (
        <ReportContainer>
            <FilterBar>
                <SearchBar
                    value={filters.search}
                    onChange={(e) => set("search", e.target.value)}
                    placeholder="Search name / code / mobile…"
                />
                <Select value={filters.status} onChange={(e) => set("status", e.target.value)}>
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </Select>
                <Select value={filters.site} onChange={(e) => set("site", e.target.value)}>
                    <option value="">All Sites</option>
                    {sites.map((s) => <option key={s._id} value={s._id}>{s.siteName}</option>)}
                </Select>
                <Button variant="secondary" onClick={() => { setFilters({ search: "", status: "", site: "", trade: "" }); setPage(1); }}>
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
                            <th>#</th><th>Name</th><th>Code</th><th>Trade</th>
                            <th>Site</th><th>Mobile</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <SkeletonRows cols={7} count={6} />
                        ) : data.length === 0 ? (
                            <tr><td colSpan="7"><EmptyState message="No worker records found." /></td></tr>
                        ) : data.map((w, i) => (
                            <tr key={w._id || i}>
                                <td>{(page - 1) * 10 + i + 1}</td>
                                <td>{w.fullName || "—"}</td>
                                <td>{w.employeeCode || "—"}</td>
                                <td>{w.trade || "—"}</td>
                                <td>{w.site?.siteName || "—"}</td>
                                <td>{w.mobileNumber || "—"}</td>
                                <td><StatusBadge status={w.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableCard>

            <Pagination page={page} totalPages={pagination?.totalPages} total={pagination?.total} onPageChange={setPage} />
        </ReportContainer>
    );
};

export default WorkerReport;
