import Worker from '../models/Worker.js';
import Site from '../models/Site.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';

class ExportRepository {
    /**
 * ==========================================
 * Get Dashboard Data
 * ==========================================
 */
async getDashboardData() {
  const [
    totalWorkers,
    activeWorkers,
    totalSites,
    activeSites,
    totalAttendance,
    presentToday,
    absentToday,
    leaveToday,
    halfDayToday,
    totalPayroll,
    totalNetSalary,
  ] = await Promise.all([
    Worker.countDocuments({
      isDeleted: false,
    }),

    Worker.countDocuments({
      isDeleted: false,
      status: 'ACTIVE',
    }),

    Site.countDocuments({
      isDeleted: false,
    }),

    Site.countDocuments({
      isDeleted: false,
      status: 'ACTIVE',
    }),

    Attendance.countDocuments({
      isDeleted: false,
    }),

    Attendance.countDocuments({
      isDeleted: false,
      status: 'PRESENT',
    }),

    Attendance.countDocuments({
      isDeleted: false,
      status: 'ABSENT',
    }),

    Attendance.countDocuments({
      isDeleted: false,
      status: 'LEAVE',
    }),

    Attendance.countDocuments({
      isDeleted: false,
      status: 'HALF_DAY',
    }),

    Payroll.countDocuments({
      isDeleted: false,
    }),

    Payroll.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalNetSalary: {
            $sum: '$netSalary',
          },
        },
      },
    ]),
  ]);

  return {
    workers: {
      total: totalWorkers,
      active: activeWorkers,
    },

    sites: {
      total: totalSites,
      active: activeSites,
    },

    attendance: {
      total: totalAttendance,
      present: presentToday,
      absent: absentToday,
      leave: leaveToday,
      halfDay: halfDayToday,
    },

    payroll: {
      total: totalPayroll,
      totalNetSalary:
        totalNetSalary.length > 0
          ? totalNetSalary[0]
              .totalNetSalary
          : 0,
    },
  };
}
/**
 * ==========================================
 * Get Workers
 * ==========================================
 */
async getWorkers(filter = {}) {
  return await Worker.find({
    isDeleted: false,
    ...filter,
  })
    .populate(
      'site',
      'siteCode siteName'
    )
    .populate(
      'contractor',
      'contractorCode companyName'
    )
    .sort({
      createdAt: -1,
    });
}
/**
 * ==========================================
 * Get Attendance
 * ==========================================
 */
async getAttendance(filter = {}) {
  return await Attendance.find({
    isDeleted: false,
    ...filter,
  })
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
    .sort({
      attendanceDate: -1,
    });
}
/**
 * ==========================================
 * Get Payroll
 * ==========================================
 */
async getPayroll(filter = {}) {
  return await Payroll.find({
    isDeleted: false,
    ...filter,
  })
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
    .sort({
      createdAt: -1,
    });
}
/**
 * ==========================================
 * Get Sites
 * ==========================================
 */
async getSites(filter = {}) {
  return await Site.find({
    isDeleted: false,
    ...filter,
  })
    .populate(
      'createdBy',
      'fullName email'
    )
    .populate(
      'updatedBy',
      'fullName email'
    )
    .sort({
      createdAt: -1,
    });
}
}

export default new ExportRepository();