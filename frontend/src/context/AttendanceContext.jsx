import { createContext, useContext, useState } from "react";
import attendanceService from "../services/attendance.service";
import { showSuccess, showError } from "../components/common/toast";

const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [summary, setSummary] = useState(null);
    const [workerHistory, setWorkerHistory] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchAttendance = async (params = {}) => {
        try {
            setLoading(true);
            const data = await attendanceService.getAttendance(params);
            setAttendanceRecords(data?.data || data?.records || data || []);
            if (data?.pagination) {
                setPagination(data.pagination);
            }
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch attendance.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const data = await attendanceService.getSummary();
            setSummary(data?.data || data);
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch summary.");
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkerHistory = async (workerId) => {
        try {
            setLoading(true);
            const data = await attendanceService.getWorkerHistory(workerId);
            setWorkerHistory(data?.data || data || []);
        } catch (error) {
            showError(error.response?.data?.message || "Failed to fetch history.");
        } finally {
            setLoading(false);
        }
    };

    const addAttendance = async (payload) => {
        try {
            setLoading(true);
            await attendanceService.markAttendance(payload);
            showSuccess("Attendance marked successfully");
            await fetchAttendance();
            await fetchSummary();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to mark attendance.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateAttendance = async (id, payload) => {
        try {
            setLoading(true);
            await attendanceService.updateAttendance(id, payload);
            showSuccess("Attendance updated successfully");
            await fetchAttendance();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to update attendance.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const changeStatus = async (id, status) => {
        try {
            setLoading(true);
            await attendanceService.changeAttendanceStatus(id, status);
            showSuccess("Attendance status updated");
            await fetchAttendance();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to update status.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeAttendance = async (id) => {
        try {
            setLoading(true);
            await attendanceService.deleteAttendance(id);
            showSuccess("Attendance deleted successfully");
            await fetchAttendance();
        } catch (error) {
            showError(error.response?.data?.message || "Failed to delete attendance.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AttendanceContext.Provider
            value={{
                attendanceRecords,
                summary,
                workerHistory,
                pagination,
                loading,
                selectedRecord,
                setSelectedRecord,
                fetchAttendance,
                fetchSummary,
                fetchWorkerHistory,
                addAttendance,
                updateAttendance,
                changeStatus,
                removeAttendance,
            }}
        >
            {children}
        </AttendanceContext.Provider>
    );
};

export default AttendanceContext;
