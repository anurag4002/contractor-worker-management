const PAYROLL_MESSAGES = {
  NOT_FOUND: 'Payroll record not found.',

  CREATED_SUCCESS:
    'Payroll generated successfully.',

  UPDATED_SUCCESS:
    'Payroll updated successfully.',

  DELETED_SUCCESS:
    'Payroll deleted successfully.',

  STATUS_UPDATED:
    'Payroll status updated successfully.',

  ALREADY_GENERATED:
    'Payroll has already been generated for this worker for the selected month and year.',

  WORKER_NOT_FOUND:
    'Worker not found.',

  SITE_NOT_FOUND:
    'Site not found.',

  INVALID_MONTH:
    'Attendance month is invalid.',

  INVALID_YEAR:
    'Attendance year is invalid.',

  ATTENDANCE_NOT_FOUND:
    'Attendance records not found for the selected month.',

  INVALID_DAILY_WAGE:
    'Daily wage must be greater than zero.',

  INVALID_OVERTIME_RATE:
    'Overtime rate cannot be negative.',

  INVALID_BONUS:
    'Bonus cannot be negative.',

  INVALID_DEDUCTION:
    'Deduction cannot be negative.',

  INVALID_ADVANCE_DEDUCTION:
    'Advance deduction cannot be negative.',

  PAYROLL_ALREADY_PAID:
    'Payroll has already been paid and cannot be modified.',

  PAYROLL_ALREADY_CANCELLED:
    'Payroll has already been cancelled.',
};

export default PAYROLL_MESSAGES;