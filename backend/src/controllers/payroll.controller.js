import payrollService from '../services/payroll.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

import PAYROLL_MESSAGES from '../common/constants/payroll.messages.js';

/**
 * ==========================================
 * Create Payroll
 * ==========================================
 */
const createPayroll = asyncHandler(
  async (req, res) => {
    const payroll =
      await payrollService.createPayroll(
        req.body,
        req.user.userId,
        req.user.tenantId
      );

    return ApiResponse.created(
      res,
      payroll,
      'Payroll generated successfully.'
    );
  }
);

/**
 * ==========================================
 * Get All Payrolls
 * ==========================================
 */
const getPayrolls = asyncHandler(
  async (req, res) => {
    const result =
      await payrollService.getPayrolls(
        req.query,
        req.user.tenantId
      );

    return ApiResponse.paginated(
      res,
      result.payrolls,
      result.pagination,
      'Payrolls fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Get Payroll By Id
 * ==========================================
 */
const getPayrollById = asyncHandler(
  async (req, res) => {
    const payroll =
      await payrollService.getPayrollById(
        req.params.id,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      payroll,
      'Payroll fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Update Payroll
 * ==========================================
 */
const updatePayroll = asyncHandler(
  async (req, res) => {
    const payroll =
      await payrollService.updatePayroll(
        req.params.id,
        req.body,
        req.user.userId,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      payroll,
      'Payroll updated successfully.'
    );
  }
);

/**
 * ==========================================
 * Change Payroll Status
 * ==========================================
 */
const changePayrollStatus =
  asyncHandler(async (req, res) => {
    const payroll =
      await payrollService.changeStatus(
        req.params.id,
        req.body.status,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      payroll,
      'Payroll status updated successfully.'
    );
  });

/**
 * ==========================================
 * Delete Payroll
 * ==========================================
 */
const deletePayroll = asyncHandler(
  async (req, res) => {
    const result =
      await payrollService.deletePayroll(
        req.params.id,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      result,
      'Payroll deleted successfully.'
    );
  }
);

/**
 * ==========================================
 * Payroll Summary
 * ==========================================
 */
const getSummary = asyncHandler(
  async (req, res) => {
    const summary =
      await payrollService.getSummary(
        req.query,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      summary,
      'Payroll summary fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Worker Payroll History
 * ==========================================
 */
const getWorkerPayrollHistory =
  asyncHandler(async (req, res) => {
    const result =
      await payrollService.getWorkerPayrollHistory(
        req.params.workerId,
        req.query,
        req.user.tenantId
      );

    return ApiResponse.paginated(
      res,
      result.payrolls,
      result.pagination,
      'Worker payroll history fetched successfully.'
    );
  });

/**
 * ==========================================
 * Generate Salary from Attendance
 * ==========================================
 */
const generateSalaryFromAttendance =
  asyncHandler(async (req, res) => {
    const { attendanceMonth, attendanceYear } =
      req.body;

    const result =
      await payrollService.generateSalaryFromAttendance(
        Number(attendanceMonth),
        Number(attendanceYear),
        req.user.userId,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      result,
      PAYROLL_MESSAGES.SALARY_GENERATED_SUCCESS
    );
  });

/**
 * ==========================================
 * Process Advance Payment
 * ==========================================
 */
const processAdvancePayment =
  asyncHandler(async (req, res) => {
     const { payrollId } = req.params;
     const { amount, paymentMethod, transactionId, remark } =
       req.body;

     const result =
       await payrollService.processAdvancePayment(
         payrollId,
         Number(amount),
         paymentMethod,
         transactionId,
         remark,
         req.user.userId,
         req.user.tenantId
       );

     return ApiResponse.success(
       res,
       result,
       PAYROLL_MESSAGES.ADVANCE_PROCESSED_SUCCESS
     );
   });

export default {
   createPayroll,
   getPayrolls,
   getPayrollById,
   updatePayroll,
   changePayrollStatus,
   deletePayroll,
   getSummary,
   getWorkerPayrollHistory,
   generateSalaryFromAttendance,
   processAdvancePayment,
 };