import axios from "../api/axios";

const BASE = "/export";

/**
 * Triggers a file download from a binary (blob) response.
 * @param {Blob} blob
 * @param {string} filename  e.g. "workers.pdf"
 */
const triggerDownload = (blob, filename) => {
    if (blob.type === "application/json") {
        throw new Error("Export failed: Received JSON data instead of a file.");
    }

    if (blob.size === 0) {
        throw new Error("Export failed: The generated file is empty.");
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Delay revocation to ensure the browser has time to start the download
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 500);
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
     * Supports filters: search, status, site, trade
     */
    exportWorkersPdf: async (params = {}) => {
        const res = await axios.get(`${BASE}/workers`, { responseType: "blob", params });
        triggerDownload(res.data, "workers.pdf");
    },

    /**
     * GET /export/attendance  → PDF
     * Supports filters: status, site, fromDate, toDate
     */
    exportAttendancePdf: async (params = {}) => {
        const res = await axios.get(`${BASE}/attendance`, { responseType: "blob", params });
        triggerDownload(res.data, "attendance.pdf");
    },

    /**
     * GET /export/payroll  → PDF
     * Supports filters: status, site, attendanceMonth, attendanceYear, search
     */
    exportPayrollPdf: async (params = {}) => {
        const res = await axios.get(`${BASE}/payroll`, {
            responseType: "blob",
            params,
        });
        triggerDownload(res.data, "payroll.pdf");
    },

    /**
     * GET /export/sites  → PDF
     * Supports filters: search, status, city, state
     */
    exportSitesPdf: async (params = {}) => {
        const res = await axios.get(`${BASE}/sites`, { responseType: "blob", params });
        triggerDownload(res.data, "sites.pdf");
    },
};

export default exportService;
