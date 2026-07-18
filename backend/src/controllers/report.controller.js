import reportService from '../services/report.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

/**
 * ==========================================
 * Get Worker Report
 * ==========================================
 */
const getWorkerReport = asyncHandler(
  async (req, res) => {
    const result =
      await reportService.getWorkerReport(
        req.query
      );

    return ApiResponse.paginated(
      res,
      result.workers,
      result.pagination,
      'Worker report fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Get Attendance Report
 * ==========================================
 */
const getAttendanceReport =
  asyncHandler(async (req, res) => {
    const result =
      await reportService.getAttendanceReport(
        req.query
      );

    return ApiResponse.paginated(
      res,
      result.attendance,
      result.pagination,
      'Attendance report fetched successfully.'
    );
  });

/**
 * ==========================================
 * Get Payroll Report
 * ==========================================
 */
const getPayrollReport =
  asyncHandler(async (req, res) => {
    const result =
      await reportService.getPayrollReport(
        req.query
      );

    return ApiResponse.paginated(
      res,
      result.payroll,
      result.pagination,
      'Payroll report fetched successfully.'
    );
  });

/**
 * ==========================================
 * Get Site Report
 * ==========================================
 */
const getSiteReport = asyncHandler(
  async (req, res) => {
    const result =
      await reportService.getSiteReport(
        req.query
      );

    return ApiResponse.paginated(
      res,
      result.sites,
      result.pagination,
      'Site report fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Get Dashboard Report
 * ==========================================
 */
const getDashboardReport =
  asyncHandler(async (req, res) => {
    const report =
      await reportService.getDashboardReport();

    return ApiResponse.success(
      res,
      report,
      'Dashboard report fetched successfully.'
    );
  });

export default {
  getWorkerReport,
  getAttendanceReport,
  getPayrollReport,
  getSiteReport,
  getDashboardReport,
};