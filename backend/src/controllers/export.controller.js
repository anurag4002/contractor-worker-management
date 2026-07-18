import exportService from '../services/export.service.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

/**
 * ==========================================
 * Export Dashboard Excel
 * ==========================================
 */
const exportDashboardExcel =
  asyncHandler(async (req, res) => {
    await exportService.exportDashboardExcel(
      res
    );
  });

/**
 * ==========================================
 * Export Workers PDF
 * ==========================================
 */
const exportWorkersPdf =
  asyncHandler(async (req, res) => {
    await exportService.exportWorkersPdf(
      res
    );
  });

/**
 * ==========================================
 * Export Attendance PDF
 * ==========================================
 */
const exportAttendancePdf =
  asyncHandler(async (req, res) => {
    await exportService.exportAttendancePdf(
      res
    );
  });

/**
 * ==========================================
 * Export Payroll PDF
 * ==========================================
 */
const exportPayrollPdf =
  asyncHandler(async (req, res) => {
    await exportService.exportPayrollPdf(
      res
    );
  });

/**
 * ==========================================
 * Export Sites PDF
 * ==========================================
 */
const exportSitesPdf =
  asyncHandler(async (req, res) => {
    await exportService.exportSitesPdf(
      res
    );
  });

/**
 * ==========================================
 * Export Dashboard PDF
 * ==========================================
 */
const exportDashboardPdf =
  asyncHandler(async (req, res) => {
    await exportService.exportDashboardPdf(
      res
    );
  });

export default {
  exportDashboardExcel,
  exportWorkersPdf,
  exportAttendancePdf,
  exportPayrollPdf,
  exportSitesPdf,
  exportDashboardPdf,
};