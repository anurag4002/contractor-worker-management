import axios from "../api/axios";

const BASE = "/export";

/**
 * Triggers a file download from a binary (blob) response.
 * @param {Blob} blob
 * @param {string} filename  e.g. "workers.pdf"
 */
const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

const exportService = {
    /**
     * GET /export/dashboard  → Excel (.xlsx)
     */
    exportDashboardExcel: async () => {
        const res = await axios.get(`${BASE}/dashboard`, { responseType: "blob" });
        triggerDownload(res.data, "dashboard.xlsx");
    },

    /**
     * GET /export/dashboard/pdf  → PDF
     */
    exportDashboardPdf: async () => {
        const res = await axios.get(`${BASE}/dashboard/pdf`, { responseType: "blob" });
        triggerDownload(res.data, "dashboard.pdf");
    },

    /**
     * GET /export/workers  → PDF
     */
    exportWorkersPdf: async () => {
        const res = await axios.get(`${BASE}/workers`, { responseType: "blob" });
        triggerDownload(res.data, "workers.pdf");
    },

    /**
     * GET /export/attendance  → PDF
     */
    exportAttendancePdf: async () => {
        const res = await axios.get(`${BASE}/attendance`, { responseType: "blob" });
        triggerDownload(res.data, "attendance.pdf");
    },

    /**
     * GET /export/payroll  → PDF
     */
    exportPayrollPdf: async () => {
        const res = await axios.get(`${BASE}/payroll`, { responseType: "blob" });
        triggerDownload(res.data, "payroll.pdf");
    },

    /**
     * GET /export/sites  → PDF
     */
    exportSitesPdf: async () => {
        const res = await axios.get(`${BASE}/sites`, { responseType: "blob" });
        triggerDownload(res.data, "sites.pdf");
    },
};

export default exportService;
