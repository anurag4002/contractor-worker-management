import axios from "../api/axios";

const payrollService = {
    getPayrolls: async (params = {}) => {
        const { data } = await axios.get("/payroll", { params });
        return data;
    },

    getPayrollById: async (id) => {
        const { data } = await axios.get(`/payroll/${id}`);
        return data;
    },

    getSummary: async () => {
        const { data } = await axios.get("/payroll/summary");
        return data;
    },

    getWorkerPayrollHistory: async (workerId) => {
        const { data } = await axios.get(`/payroll/worker/${workerId}`);
        return data;
    },

    createPayroll: async (payload) => {
        const { data } = await axios.post("/payroll", payload);
        return data;
    },

    updatePayroll: async (id, payload) => {
        const { data } = await axios.put(`/payroll/${id}`, payload);
        return data;
    },

    changePayrollStatus: async (id, status) => {
        const { data } = await axios.patch(`/payroll/${id}/status`, { status });
        return data;
    },

    deletePayroll: async (id) => {
        const { data } = await axios.delete(`/payroll/${id}`);
        return data;
    },
};

export default payrollService;
