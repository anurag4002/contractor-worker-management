import dashboardService from '../services/dashboard.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

/**
 * ==========================================
 * Get Dashboard
 * ==========================================
 */
const getDashboard = asyncHandler(
  async (req, res) => {
    const dashboard =
      await dashboardService.getDashboard(req.user.tenantId);

    return ApiResponse.success(
      res,
      dashboard,
      'Dashboard data fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Get Recent Workers
 * ==========================================
 */
const getRecentWorkers =
  asyncHandler(async (req, res) => {
    const workers =
      await dashboardService.getRecentWorkers(req.user.tenantId);

    return ApiResponse.success(
      res,
      workers,
      'Recent workers fetched successfully.'
    );
  });

/**
 * ==========================================
 * Get Recent Attendance
 * ==========================================
 */
const getRecentAttendance =
  asyncHandler(async (req, res) => {
    const attendance =
      await dashboardService.getRecentAttendance(req.user.tenantId);

    return ApiResponse.success(
      res,
      attendance,
      'Recent attendance fetched successfully.'
    );
  });

/**
 * ==========================================
 * Get Recent Payroll
 * ==========================================
 */
const getRecentPayroll =
  asyncHandler(async (req, res) => {
    const payroll =
      await dashboardService.getRecentPayroll(req.user.tenantId);

    return ApiResponse.success(
      res,
      payroll,
      'Recent payroll fetched successfully.'
    );
  });

/**
 * ==========================================
 * Get Dashboard Charts
 * ==========================================
 */
const getCharts = asyncHandler(
  async (req, res) => {
    const charts =
      await dashboardService.getCharts(req.user.tenantId);

    return ApiResponse.success(
      res,
      charts,
      'Dashboard chart data fetched successfully.'
    );
  }
);

export default {
  getDashboard,
  getRecentWorkers,
  getRecentAttendance,
  getRecentPayroll,
  getCharts,
};