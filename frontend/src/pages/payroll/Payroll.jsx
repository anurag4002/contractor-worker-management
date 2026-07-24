import React, { useState, useEffect } from "react";
import { FiPlus, FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import usePayroll from "../../hooks/usePayroll";
import useSites from "../../hooks/useSites";

import PayrollSummary from "../../components/payroll/PayrollSummary";
import PayrollFilter from "../../components/payroll/PayrollFilter";
import PayrollTable from "../../components/payroll/PayrollTable";
import CreatePayrollModal from "../../components/payroll/CreatePayrollModal";
import EditPayrollModal from "../../components/payroll/EditPayrollModal";
import DeletePayrollModal from "../../components/payroll/DeletePayrollModal";
import ChangeStatusModal from "../../components/payroll/ChangeStatusModal";
import WorkerPayrollHistoryModal from "../../components/payroll/WorkerPayrollHistoryModal";

import { PayrollContainer, Header, TitleSection, ActionSection, Button } from "./Payroll.style";

const DEFAULT_FILTERS = { search: "", status: "", attendanceMonth: "", attendanceYear: "", site: "" };

const Payroll = () => {
    const { payrolls, summary, pagination, loading, fetchPayrolls, fetchSummary } = usePayroll();
    const { sites, fetchSites } = useSites();

    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);
    const limit = 10;

    const [selected, setSelected] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);

    useEffect(() => {
        fetchSummary();
        if (!sites || sites.length === 0) fetchSites({ limit: 100 });
    }, []);

    useEffect(() => {
        const params = { page, limit };
        if (filters.search) params.search = filters.search;
        if (filters.status) params.status = filters.status;
        if (filters.attendanceMonth) params.attendanceMonth = filters.attendanceMonth;
        if (filters.attendanceYear) params.attendanceYear = filters.attendanceYear;
        if (filters.site) params.site = filters.site;
        fetchPayrolls(params);
    }, [page, filters]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleFilterReset = () => {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    };

    const payrollData = Array.isArray(payrolls) ? payrolls : [];
    const sitesData = Array.isArray(sites) ? sites : [];

    return (
        <PayrollContainer>
            <Header>
                <TitleSection>
                    <h2>Payroll Management</h2>
                    <p>Manage and process worker salaries</p>
                </TitleSection>
                <ActionSection>
                    <Button>
                        <FiDownload /> Export
                    </Button>
                    <Button onClick={() => setCreateOpen(true)}>
                        <FiPlus /> Create Payroll
                    </Button>
                </ActionSection>
            </Header>

            <PayrollSummary summary={summary || {}} />

            <PayrollFilter
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
                sites={sitesData}
            />

            {loading && !payrollData.length ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                    Loading payrolls...
                </div>
            ) : (
                <PayrollTable
                    payrolls={payrollData}
                    onEdit={(p) => { setSelected(p); setEditOpen(true); }}
                    onDelete={(p) => { setSelected(p); setDeleteOpen(true); }}
                    onChangeStatus={(p) => { setSelected(p); setStatusOpen(true); }}
                    onViewHistory={(p) => { setSelected(p); setHistoryOpen(true); }}
                />
            )}

            {pagination && pagination.totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "0.5rem" }}>
                    <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                        <FiChevronLeft /> Prev
                    </Button>
                    <span style={{ display: "flex", alignItems: "center" }}>
                        Page {page} of {pagination.totalPages}
                    </span>
                    <Button disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                        Next <FiChevronRight />
                    </Button>
                </div>
            )}

            <CreatePayrollModal open={createOpen} onClose={() => setCreateOpen(false)} />
            <EditPayrollModal open={editOpen} onClose={() => setEditOpen(false)} payroll={selected} />
            <DeletePayrollModal open={deleteOpen} onClose={() => setDeleteOpen(false)} payroll={selected} />
            <ChangeStatusModal open={statusOpen} onClose={() => setStatusOpen(false)} payroll={selected} />
            <WorkerPayrollHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} payroll={selected} />
        </PayrollContainer>
    );
};

export default Payroll;
