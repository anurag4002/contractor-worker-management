import axios from "../api/axios";

const attendanceService = {
    getAttendance: async (params = {}) => {
        const { data } = await axios.get("/attendance", { params });
        return data;
    },

    getAttendanceById: async (id) => {
        const { data } = await axios.get(`/attendance/${id}`);
        return data;
    },

    getSummary: async () => {
        const { data } = await axios.get("/attendance/summary");
        return data;
    },

    getWorkerHistory: async (workerId) => {
        const { data } = await axios.get(`/attendance/history/${workerId}`);
        return data;
    },

    markAttendance: async (payload) => {
        const { data } = await axios.post("/attendance", payload);
        return data;
    },

    updateAttendance: async (id, payload) => {
        const { data } = await axios.put(`/attendance/${id}`, payload);
        return data;
    },

    changeAttendanceStatus: async (id, status) => {
        const { data } = await axios.patch(`/attendance/${id}/status`, { status });
        return data;
    },

    deleteAttendance: async (id) => {
        const { data } = await axios.delete(`/attendance/${id}`);
        return data;
    },
};

export default attendanceService;
