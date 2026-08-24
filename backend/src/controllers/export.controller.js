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
      res,
      req.user.tenantId
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
      res,
      req.user.tenantId
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
      res,
      req.user.tenantId
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
       res,
       req.query,
       req.user.tenantId
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
      res,
      req.user.tenantId
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
      res,
      req.user.tenantId
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
