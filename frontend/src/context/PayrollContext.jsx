import { createContext, useContext, useState } from "react";
import payrollService from "../services/payroll.service";
import { showSuccess, showError } from "../components/common/toast";

const PayrollContext = createContext(null);

export const PayrollProvider = ({ children }) => {
    const [payrolls, setPayrolls] = useState([]);
    const [summary, setSummary] = useState(null);
    const [workerHistory, setWorkerHistory] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(false);

    const fetchPayrolls = async (params = {}) => {
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
    };

    const fetchSummary = async () => {
        try {
            const data = await payrollService.getSummary();
            setSummary(data?.data || data);
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch payroll summary.");
        }
    };

    const fetchWorkerHistory = async (workerId) => {
        try {
            setLoading(true);
            const data = await payrollService.getWorkerPayrollHistory(workerId);
            setWorkerHistory(data?.data || data || []);
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch worker payroll history.");
        } finally {
            setLoading(false);
        }
    };

    const createPayroll = async (payload) => {
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
    };

    const updatePayroll = async (id, payload) => {
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
    };

    const changeStatus = async (id, status) => {
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
    };

    const deletePayroll = async (id) => {
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
    };

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
