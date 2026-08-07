import Worker from '../models/Worker.js';
import Site from '../models/Site.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';

class ReportRepository {
    /**
 * ==========================================
 * Get Worker Report
 * ==========================================
 */
async getWorkerReport(filter, options) {
  return await Worker.find(filter)
    .populate(
      'site',
      'siteCode siteName'
    )
    .populate(
      'contractor',
      'contractorCode companyName'
    )
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit);
}
/**
 * ==========================================
 * Count Workers
 * ==========================================
 */
async countWorkers(filter) {
  return await Worker.countDocuments(filter);
}
/**
 * ==========================================
 * Get Attendance Report
 * ==========================================
 */
async getAttendanceReport(
  filter,
  options
) {
  return await Attendance.find(filter)
    .populate(
      'worker',
      'employeeCode fullName'
    )
    .populate(
      'site',
      'siteCode siteName'
    )
    .populate(
      'createdBy',
      'fullName email'
    )
    .populate(
      'updatedBy',
      'fullName email'
    )
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit);
}
/**
 * ==========================================
 * Count Attendance
 * ==========================================
 */
async countAttendance(filter) {
  return await Attendance.countDocuments(
    filter
  );
}
/**
 * ==========================================
 * Get Payroll Report
 * ==========================================
 */
async getPayrollReport(
  filter,
  options
) {
  return await Payroll.find(filter)
    .populate(
      'worker',
      'employeeCode fullName'
    )
    .populate(
      'site',
      'siteCode siteName'
    )
    .populate(
      'createdBy',
      'fullName email'
    )
    .populate(
      'updatedBy',
      'fullName email'
    )
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit);
}
/**
 * ==========================================
 * Count Payroll
 * ==========================================
 */
async countPayroll(filter) {
  return await Payroll.countDocuments(
    filter
  );
}
/**
 * ==========================================
 * Get Site Report
 * ==========================================
 */
async getSiteReport(
  filter,
  options
) {
  return await Site.find(filter)
    .populate(
      'createdBy',
      'fullName email'
    )
    .populate(
      'updatedBy',
      'fullName email'
    )
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit);
}
/**
 * ==========================================
 * Count Sites
 * ==========================================
 */
async countSites(filter) {
  return await Site.countDocuments(
    filter
  );
}
/**
 * ==========================================
 * Get Dashboard Report
 * ==========================================
 */
async getDashboardReport() {
  const [
    totalWorkers,
    activeWorkers,
    totalSites,
    activeSites,
    todayAttendance,
    totalPayroll,
    currentMonthPayroll,
    paidPayrolls,
    pendingPayrolls,
  ] = await Promise.all([
    Worker.countDocuments({
      isDeleted: false,
    }),

    Worker.countDocuments({
      status: 'ACTIVE',
      isDeleted: false,
    }),

    Site.countDocuments({
      isDeleted: false,
    }),

    Site.countDocuments({
      status: 'ACTIVE',
      isDeleted: false,
    }),

    Attendance.countDocuments({
      isDeleted: false,
      attendanceDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    }),

    Payroll.countDocuments({
      isDeleted: false,
    }),

    Payroll.aggregate([
      {
        $match: {
          isDeleted: false,
          attendanceMonth: new Date().getMonth() + 1,
          attendanceYear: new Date().getFullYear(),
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$netSalary',
          },
        },
      },
    ]),

    Payroll.countDocuments({
      status: 'PAID',
      isDeleted: false,
    }),

    Payroll.countDocuments({
      status: 'PENDING',
      isDeleted: false,
    }),
  ]);

  return {
    totalWorkers,
    activeWorkers,
    totalSites,
    activeSites,
    todayAttendance,
    totalPayroll,
    currentMonthPayroll:
      currentMonthPayroll.length > 0
        ? currentMonthPayroll[0].total
        : 0,
    paidPayrolls,
    pendingPayrolls,
  };
}

}

export default new ReportRepository();