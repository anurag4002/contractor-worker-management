import axios from "../api/axios";

const BASE = "/reports";

const reportService = {
    getWorkerReport: (params = {}) =>
        axios.get(`${BASE}/workers`, { params }),

    getAttendanceReport: (params = {}) =>
        axios.get(`${BASE}/attendance`, { params }),

    getPayrollReport: (params = {}) =>
        axios.get(`${BASE}/payroll`, { params }),

    getSiteReport: (params = {}) =>
        axios.get(`${BASE}/sites`, { params }),

    getDashboardReport: () =>
        axios.get(`${BASE}/dashboard`),
};

export default reportService;
