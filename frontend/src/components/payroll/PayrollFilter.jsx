import React from "react";
import { FilterBar, SearchInput, FilterSelect, ResetButton } from "./Payroll.style";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const PayrollFilter = ({ filters, onChange, onReset, sites = [], workers = [] }) => (
    <FilterBar>
        <SearchInput
            placeholder="Search by worker name..."
            value={filters.search || ""}
            onChange={(e) => onChange("search", e.target.value)}
        />

        <FilterSelect value={filters.status || ""} onChange={(e) => onChange("status", e.target.value)}>
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="GENERATED">Generated</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
        </FilterSelect>

        <FilterSelect value={filters.attendanceMonth || ""} onChange={(e) => onChange("attendanceMonth", e.target.value)}>
            <option value="">All Months</option>
            {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
        </FilterSelect>

        <FilterSelect value={filters.attendanceYear || ""} onChange={(e) => onChange("attendanceYear", e.target.value)}>
            <option value="">All Years</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </FilterSelect>

        <FilterSelect value={filters.site || ""} onChange={(e) => onChange("site", e.target.value)}>
            <option value="">All Sites</option>
            {sites.map((s) => <option key={s._id} value={s._id}>{s.siteName}</option>)}
        </FilterSelect>

        <ResetButton type="button" onClick={onReset}>Clear</ResetButton>
    </FilterBar>
);

export default PayrollFilter;
