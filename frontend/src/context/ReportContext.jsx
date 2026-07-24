import React, { createContext, useState, useCallback } from "react";
import reportService from "../services/report.service";
import { toast } from "react-toastify";

export const ReportContext = createContext(null);

export const ReportProvider = ({ children }) => {
    const [workerReport, setWorkerReport] = useState([]);
    const [attendanceReport, setAttendanceReport] = useState([]);
    const [payrollReport, setPayrollReport] = useState([]);
    const [siteReport, setSiteReport] = useState([]);
    const [dashboardReport, setDashboardReport] = useState(null);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWorkerReport = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const res = await reportService.getWorkerReport(params);
            setWorkerReport(res.data?.data || []);
            setPagination(res.data?.pagination || {});
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch worker report.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAttendanceReport = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const res = await reportService.getAttendanceReport(params);
            setAttendanceReport(res.data?.data || []);
            setPagination(res.data?.pagination || {});
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch attendance report.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPayrollReport = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const res = await reportService.getPayrollReport(params);
            setPayrollReport(res.data?.data || []);
            setPagination(res.data?.pagination || {});
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch payroll report.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSiteReport = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const res = await reportService.getSiteReport(params);
            setSiteReport(res.data?.data || []);
            setPagination(res.data?.pagination || {});
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch site report.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDashboardReport = useCallback(async () => {
        try {
            setLoading(true);
            const res = await reportService.getDashboardReport();
            setDashboardReport(res.data?.data || null);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch dashboard report.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <ReportContext.Provider
            value={{
                workerReport, attendanceReport, payrollReport,
                siteReport, dashboardReport,
                pagination, loading, error,
                fetchWorkerReport, fetchAttendanceReport,
                fetchPayrollReport, fetchSiteReport, fetchDashboardReport,
            }}
        >
            {children}
        </ReportContext.Provider>
    );
};

export default ReportProvider;
