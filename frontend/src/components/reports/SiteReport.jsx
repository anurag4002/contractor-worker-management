import React, { useState, useEffect } from "react";
import useReport from "../../hooks/useReport";
import { exportToExcel, exportToPDF } from "../../utils/export.utils";
import { FiDownload, FiFileText } from "react-icons/fi";
import styled from "styled-components";
import { TableCard, Table, ReportContainer, FilterControls } from "./ReportTable.style";
import FilterBar from "../ui/FilterBar";
import SearchBar from "../ui/SearchBar";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Button from "../ui/Button";
import StatusBadge from "../ui/StatusBadge";
import SkeletonRows from "../ui/SkeletonRows";
import EmptyState from "../ui/EmptyState";
import Pagination from "../ui/Pagination";

const SmallInput = styled(Input)`
    width: 120px;
`;

const SiteReport = () => {
    const { siteReport, pagination, loading, fetchSiteReport } = useReport();
    const [filters, setFilters] = useState({ search: "", status: "", city: "", state: "" });
    const [page, setPage] = useState(1);

    useEffect(() => {
        const params = { page, limit: 10 };
        if (filters.search) params.search = filters.search;
        if (filters.status) params.status = filters.status;
        if (filters.city) params.city = filters.city;
        if (filters.state) params.state = filters.state;
        fetchSiteReport(params);
    }, [page, filters]);

    const data = Array.isArray(siteReport) ? siteReport : [];
    const set = (k, v) => { setFilters((p) => ({ ...p, [k]: v })); setPage(1); };

    const handleExcel = () =>
        exportToExcel(
            data.map((s) => ({
                Name: s.siteName || "",
                Code: s.siteCode || "",
                Client: s.clientName || "",
                City: s.city || "",
                State: s.state || "",
                Status: s.status || "",
            })),
            "Site_Report"
        );

    const handlePDF = () =>
        exportToPDF(
            "Site Report",
            ["Name", "Code", "Client", "City", "Status"],
            data.map((s) => [s.siteName, s.siteCode, s.clientName, s.city, s.status]),
            "Site_Report"
        );

    return (
        <ReportContainer>
            <FilterBar>
                <SearchBar
                    value={filters.search}
                    onChange={(e) => set("search", e.target.value)}
                    placeholder="Search site name / code / project…"
                />
                <Select value={filters.status} onChange={(e) => set("status", e.target.value)}>
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="COMPLETED">Completed</option>
                </Select>
                <SmallInput
                    placeholder="City…"
                    value={filters.city}
                    onChange={(e) => set("city", e.target.value)}
                />
                <SmallInput
                    placeholder="State…"
                    value={filters.state}
                    onChange={(e) => set("state", e.target.value)}
                />
                <Button variant="secondary" onClick={() => { setFilters({ search: "", status: "", city: "", state: "" }); setPage(1); }}>
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
                            <th>#</th><th>Site Name</th><th>Code</th><th>Client</th>
                            <th>City</th><th>State</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody aria-live="polite">
                        {loading ? (
                            <SkeletonRows cols={7} count={6} />
                        ) : data.length === 0 ? (
                            <tr><td colSpan="7"><EmptyState message="No site records found." /></td></tr>
                        ) : data.map((s, i) => (
                            <tr key={s._id || i}>
                                <td>{(page - 1) * 10 + i + 1}</td>
                                <td>{s.siteName || "—"}</td>
                                <td>{s.siteCode || "—"}</td>
                                <td>{s.clientName || "—"}</td>
                                <td>{s.city || "—"}</td>
                                <td>{s.state || "—"}</td>
                                <td><StatusBadge status={s.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableCard>

            <Pagination page={page} totalPages={pagination?.totalPages} total={pagination?.total} onPageChange={setPage} />
        </ReportContainer>
    );
};

export default SiteReport;
