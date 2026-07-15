import attendanceService from '../services/attendance.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

/**
 * ==========================================
 * Create Attendance
 * ==========================================
 */
const createAttendance = asyncHandler(
  async (req, res) => {
    const attendance =
      await attendanceService.createAttendance(
        req.body,
        req.user.userId
      );

    return ApiResponse.created(
      res,
      attendance,
      'Attendance marked successfully.'
    );
  }
);

/**
 * ==========================================
 * Get All Attendance
 * ==========================================
 */
const getAttendance = asyncHandler(
  async (req, res) => {
    const result =
      await attendanceService.getAttendance(
        req.query
      );

    return ApiResponse.paginated(
      res,
      result.attendance,
      result.pagination,
      'Attendance fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Get Attendance By Id
 * ==========================================
 */
const getAttendanceById = asyncHandler(
  async (req, res) => {
    const attendance =
      await attendanceService.getAttendanceById(
        req.params.id
      );

    return ApiResponse.success(
      res,
      attendance,
      'Attendance fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Update Attendance
 * ==========================================
 */
const updateAttendance = asyncHandler(
  async (req, res) => {
    const attendance =
      await attendanceService.updateAttendance(
        req.params.id,
        req.body,
        req.user.userId
      );

    return ApiResponse.success(
      res,
      attendance,
      'Attendance updated successfully.'
    );
  }
);

/**
 * ==========================================
 * Change Attendance Status
 * ==========================================
 */
const changeAttendanceStatus =
  asyncHandler(async (req, res) => {
    const attendance =
      await attendanceService.changeStatus(
        req.params.id,
        req.body.status
      );

    return ApiResponse.success(
      res,
      attendance,
      'Attendance status updated successfully.'
    );
  });

/**
 * ==========================================
 * Delete Attendance
 * ==========================================
 */
const deleteAttendance = asyncHandler(
  async (req, res) => {
    const result =
      await attendanceService.deleteAttendance(
        req.params.id
      );

    return ApiResponse.success(
      res,
      result,
      'Attendance deleted successfully.'
    );
  }
);

/**
 * ==========================================
 * Attendance Summary
 * ==========================================
 */
const getSummary = asyncHandler(
  async (req, res) => {
    const summary =
      await attendanceService.getSummary(
        req.query
      );

    return ApiResponse.success(
      res,
      summary,
      'Attendance summary fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Worker Attendance History
 * ==========================================
 */
const getWorkerHistory =
  asyncHandler(async (req, res) => {
    const history =
      await attendanceService.getWorkerHistory(
        req.params.workerId,
        req.query
      );

    return ApiResponse.success(
      res,
      history,
      'Attendance history fetched successfully.'
    );
  });

export default {
  createAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  changeAttendanceStatus,
  deleteAttendance,
  getSummary,
  getWorkerHistory,
};