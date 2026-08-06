import { useState, useCallback } from "react";
import exportService from "../services/export.service";
import { showError, showSuccess } from "../components/common/toast";

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
            showSuccess(`${label} downloaded successfully!`);
        } catch (error) {
            showError(error);
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
