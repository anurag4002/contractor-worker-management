import { createContext, useContext, useState, useCallback } from "react";
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

    const fetchAttendance = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const data = await attendanceService.getAttendance(params);
            setAttendanceRecords(data?.data || data?.records || data || []);
            if (data?.pagination) {
                setPagination(data.pagination);
            }
        } catch (error) {
            showError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true);
            const data = await attendanceService.getSummary();
            setSummary(data?.data || data);
        } catch (error) {
            showError(error);
        }
    }, []);

    const fetchWorkerHistory = useCallback(async (workerId) => {
        try {
            setLoading(true);
            const data = await attendanceService.getWorkerHistory(workerId);
            setWorkerHistory(data?.data || data || []);
        } catch (error) {
            showError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const addAttendance = useCallback(async (payload) => {
        try {
            setLoading(true);
            await attendanceService.markAttendance(payload);
            showSuccess("Attendance marked successfully.");
            await fetchAttendance();
            await fetchSummary();
        } catch (error) {
            showError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchAttendance, fetchSummary]);

    const updateAttendance = useCallback(async (id, payload) => {
        try {
            setLoading(true);
            await attendanceService.updateAttendance(id, payload);
            showSuccess("Attendance updated successfully.");
            await fetchAttendance();
        } catch (error) {
            showError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchAttendance]);

    const changeStatus = useCallback(async (id, status) => {
        try {
            setLoading(true);
            await attendanceService.changeAttendanceStatus(id, status);
            showSuccess("Attendance status updated");
            await fetchAttendance();
        } catch (error) {
            showError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchAttendance]);

    const removeAttendance = useCallback(async (id) => {
        try {
            setLoading(true);
            await attendanceService.deleteAttendance(id);
            showSuccess("Attendance deleted successfully.");
            await fetchAttendance();
        } catch (error) {
            showError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchAttendance]);

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
