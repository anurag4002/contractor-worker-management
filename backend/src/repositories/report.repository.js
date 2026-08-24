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
 async getWorkerReport(filter, options, tenantId = null) {
  const query = tenantId ? { ...filter, tenant: tenantId } : filter;

  return await Worker.find(query)
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
 async countWorkers(filter, tenantId = null) {
  const query = tenantId ? { ...filter, tenant: tenantId } : filter;

  return await Worker.countDocuments(query);
}
 /**
  * ==========================================
  * Get Attendance Report
  * ==========================================
  */
 async getAttendanceReport(
  filter,
  options,
  tenantId = null
) {
  const query = tenantId ? { ...filter, tenant: tenantId } : filter;

  return await Attendance.find(query)
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
 async countAttendance(filter, tenantId = null) {
  const query = tenantId ? { ...filter, tenant: tenantId } : filter;

  return await Attendance.countDocuments(
    query
  );
}
 /**
  * ==========================================
  * Get Payroll Report
  * ==========================================
  */
 async getPayrollReport(
  filter,
  options,
  tenantId = null
) {
  const query = tenantId ? { ...filter, tenant: tenantId } : filter;

  return await Payroll.find(query)
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
 async countPayroll(filter, tenantId = null) {
  const query = tenantId ? { ...filter, tenant: tenantId } : filter;

  return await Payroll.countDocuments(
    query
  );
}
 /**
  * ==========================================
  * Get Site Report
  * ==========================================
  */
 async getSiteReport(
  filter,
  options,
  tenantId = null
) {
  const query = tenantId ? { ...filter, tenant: tenantId } : filter;

  return await Site.find(query)
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
 async countSites(filter, tenantId = null) {
  const query = tenantId ? { ...filter, tenant: tenantId } : filter;

  return await Site.countDocuments(
    query
  );
}
 /**
  * ==========================================
  * Get Dashboard Report
  * ==========================================
  */
 async getDashboardReport(tenantId = null) {
  const workerQuery = { isDeleted: false };
  const activeWorkerQuery = {
    status: 'ACTIVE',
    isDeleted: false,
  };
  const siteQuery = { isDeleted: false };
  const activeSiteQuery = {
    status: 'ACTIVE',
    isDeleted: false,
  };
  const attendanceQuery = {
    isDeleted: false,
    attendanceDate: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  };
  const payrollQuery = { isDeleted: false };
  const currentMonthQuery = {
    isDeleted: false,
    attendanceMonth: new Date().getMonth() + 1,
    attendanceYear: new Date().getFullYear(),
  };
  const paidQuery = {
    status: 'PAID',
    isDeleted: false,
  };
  const pendingQuery = {
    status: 'PENDING',
    isDeleted: false,
  };

  if (tenantId) {
    workerQuery.tenant = tenantId;
    activeWorkerQuery.tenant = tenantId;
    siteQuery.tenant = tenantId;
    activeSiteQuery.tenant = tenantId;
    attendanceQuery.tenant = tenantId;
    payrollQuery.tenant = tenantId;
    currentMonthQuery.tenant = tenantId;
    paidQuery.tenant = tenantId;
    pendingQuery.tenant = tenantId;
  }

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
    Worker.countDocuments(workerQuery),

    Worker.countDocuments(activeWorkerQuery),

    Site.countDocuments(siteQuery),

    Site.countDocuments(activeSiteQuery),

    Attendance.countDocuments(attendanceQuery),

    Payroll.countDocuments(payrollQuery),

    Payroll.aggregate([
      {
        $match: currentMonthQuery,
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

    Payroll.countDocuments(paidQuery),

    Payroll.countDocuments(pendingQuery),
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
