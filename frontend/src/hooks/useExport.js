import { useState, useCallback } from "react";
import exportService from "../services/export.service";
import { toast } from "react-toastify";

/**
 * useExport
 *
 * Returns per-export loading flags and individual trigger functions.
 *
 * Usage:
 *   const { downloading, exportWorkersPdf } = useExport();
 */
const useExport = () => {
    const [downloading, setDownloading] = useState({});

    const run = useCallback(async (key, fn, label) => {
        setDownloading((prev) => ({ ...prev, [key]: true }));
        try {
            await fn();
            toast.success(`${label} downloaded successfully!`);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                `Failed to export ${label}.`;
            toast.error(msg);
        } finally {
            setDownloading((prev) => ({ ...prev, [key]: false }));
        }
    }, []);

    return {
        downloading,
        exportDashboardExcel: () => run("dashboardExcel", exportService.exportDashboardExcel, "Dashboard Excel"),
        exportDashboardPdf: () => run("dashboardPdf", exportService.exportDashboardPdf, "Dashboard PDF"),
        exportWorkersPdf: () => run("workersPdf", exportService.exportWorkersPdf, "Workers PDF"),
        exportAttendancePdf: () => run("attendancePdf", exportService.exportAttendancePdf, "Attendance PDF"),
        exportPayrollPdf: () => run("payrollPdf", exportService.exportPayrollPdf, "Payroll PDF"),
        exportSitesPdf: () => run("sitesPdf", exportService.exportSitesPdf, "Sites PDF"),
    };
};

export default useExport;
