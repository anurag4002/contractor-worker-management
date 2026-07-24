import React, { useEffect } from "react";
import useReport from "../../hooks/useReport";
import { FiUsers, FiCheckCircle, FiDollarSign, FiMapPin, FiAlertCircle, FiClock } from "react-icons/fi";
import Loader from "../ui/Loader";
import EmptyState from "../ui/EmptyState";
import {
    DashboardContainer, SummaryGrid, StatCard, IconWrapper,
    StatLabel, StatValue, ActivitiesCard, ActivitiesTitle, ActivitiesPre
} from "./DashboardReport.style";

const CARDS = (d) => [
    { label: "Total Workers", value: d.totalWorkers, icon: <FiUsers />, color: "#2563eb" },
    { label: "Active Workers", value: d.activeWorkers, icon: <FiCheckCircle />, color: "#16a34a" },
    { label: "Total Sites", value: d.totalSites, icon: <FiMapPin />, color: "#7c3aed" },
    { label: "Active Sites", value: d.activeSites, icon: <FiCheckCircle />, color: "#0891b2" },
    { label: "Attendance Today", value: d.todayAttendance, icon: <FiClock />, color: "#ca8a04" },
    { label: "Total Payroll (Month)", value: d.totalPayroll ?? d.currentMonthPayroll, icon: <FiDollarSign />, color: "#dc2626" },
    { label: "Paid Payrolls", value: d.paidPayrolls, icon: <FiCheckCircle />, color: "#16a34a" },
    { label: "Pending Payrolls", value: d.pendingPayrolls, icon: <FiAlertCircle />, color: "#f59e0b" },
];
// Styled components used instead of inline styles

const DashboardReport = () => {
    const { dashboardReport: d, loading, fetchDashboardReport } = useReport();

    useEffect(() => { fetchDashboardReport(); }, []);

    if (loading && !d) return <Loader text="Loading dashboard report…" />;
    if (!d) return <EmptyState message="No dashboard data available." />;

    return (
        <DashboardContainer>
            {/* Summary Grid */}
            <SummaryGrid>
                {CARDS(d).map(({ label, value, icon, color }) => (
                    <StatCard key={label}>
                        <IconWrapper $color={color}>{icon}</IconWrapper>
                        <div>
                            <StatLabel>{label}</StatLabel>
                            <StatValue>
                                {value == null ? "—" : typeof value === "number" ? value.toLocaleString("en-IN") : value}
                            </StatValue>
                        </div>
                    </StatCard>
                ))}
            </SummaryGrid>

            {/* Recent Activities */}
            {d.recentActivities && (
                <ActivitiesCard>
                    <ActivitiesTitle>Recent Activities</ActivitiesTitle>
                    <ActivitiesPre>
                        {JSON.stringify(d.recentActivities, null, 2)}
                    </ActivitiesPre>
                </ActivitiesCard>
            )}
        </DashboardContainer>
    );
};

export default DashboardReport;
