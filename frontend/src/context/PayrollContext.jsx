import { createContext, useContext, useState, useCallback } from "react";
import payrollService from "../services/payroll.service";
import { showSuccess, showError } from "../components/common/toast";

const PayrollContext = createContext(null);

export const PayrollProvider = ({ children }) => {
    const [payrolls, setPayrolls] = useState([]);
    const [summary, setSummary] = useState(null);
    const [workerHistory, setWorkerHistory] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(false);

    const fetchPayrolls = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const data = await payrollService.getPayrolls(params);
            setPayrolls(data?.data || data?.payrolls || data || []);
            if (data?.pagination) setPagination(data.pagination);
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch payrolls.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSummary = useCallback(async () => {
        try {
            const data = await payrollService.getSummary();
            setSummary(data?.data || data);
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch payroll summary.");
        }
    }, []);

    const fetchWorkerHistory = useCallback(async (workerId) => {
        try {
            setLoading(true);
            const data = await payrollService.getWorkerPayrollHistory(workerId);
            setWorkerHistory(data?.data || data || []);
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch worker payroll history.");
        } finally {
            setLoading(false);
        }
    }, []);

    const createPayroll = useCallback(async (payload) => {
        try {
            setLoading(true);
            await payrollService.createPayroll(payload);
            showSuccess("Payroll created successfully");
            await fetchPayrolls();
            await fetchSummary();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to create payroll.");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchPayrolls, fetchSummary]);

    const updatePayroll = useCallback(async (id, payload) => {
        try {
            setLoading(true);
            await payrollService.updatePayroll(id, payload);
            showSuccess("Payroll updated successfully");
            await fetchPayrolls();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to update payroll.");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchPayrolls]);

    const changeStatus = useCallback(async (id, status) => {
        try {
            setLoading(true);
            await payrollService.changePayrollStatus(id, status);
            showSuccess("Payroll status updated");
            await fetchPayrolls();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to update payroll status.");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchPayrolls]);

    const deletePayroll = useCallback(async (id) => {
        try {
            setLoading(true);
            await payrollService.deletePayroll(id);
            showSuccess("Payroll deleted successfully");
            await fetchPayrolls();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to delete payroll.");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchPayrolls]);

    return (
        <PayrollContext.Provider
            value={{
                payrolls, summary, workerHistory, pagination, loading,
                fetchPayrolls, fetchSummary, fetchWorkerHistory,
                createPayroll, updatePayroll, changeStatus, deletePayroll,
            }}
        >
            {children}
        </PayrollContext.Provider>
    );
};

export default PayrollContext;
