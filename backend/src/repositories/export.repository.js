import Worker from '../models/Worker.js';
import Site from '../models/Site.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';

class ExportRepository {
  async getDashboardData(tenantId = null) {
    const workerQuery = { isDeleted: false };
    const activeWorkerQuery = {
      isDeleted: false,
      status: 'ACTIVE',
    };
    const siteQuery = { isDeleted: false };
    const activeSiteQuery = {
      isDeleted: false,
      status: 'ACTIVE',
    };
    const attendanceQuery = { isDeleted: false };
    const presentQuery = {
      isDeleted: false,
      status: 'PRESENT',
    };
    const absentQuery = {
      isDeleted: false,
      status: 'ABSENT',
    };
    const leaveQuery = {
      isDeleted: false,
      status: 'LEAVE',
    };
    const halfDayQuery = {
      isDeleted: false,
      status: 'HALF_DAY',
    };
    const payrollQuery = { isDeleted: false };

    if (tenantId) {
      workerQuery.tenant = tenantId;
      activeWorkerQuery.tenant = tenantId;
      siteQuery.tenant = tenantId;
      activeSiteQuery.tenant = tenantId;
      attendanceQuery.tenant = tenantId;
      presentQuery.tenant = tenantId;
      absentQuery.tenant = tenantId;
      leaveQuery.tenant = tenantId;
      halfDayQuery.tenant = tenantId;
      payrollQuery.tenant = tenantId;
    }

    const [
      totalWorkers,
      activeWorkers,
      totalSites,
      activeSites,
      totalAttendance,
      presentAttendance,
      absentAttendance,
      leaveAttendance,
      halfDayAttendance,
      totalPayroll,
      totalNetSalary,
    ] = await Promise.all([
      Worker.countDocuments(workerQuery),

      Worker.countDocuments(activeWorkerQuery),

      Site.countDocuments(siteQuery),

      Site.countDocuments(activeSiteQuery),

      Attendance.countDocuments(attendanceQuery),

      Attendance.countDocuments(presentQuery),

      Attendance.countDocuments(absentQuery),

      Attendance.countDocuments(leaveQuery),

      Attendance.countDocuments(halfDayQuery),

      Payroll.countDocuments(payrollQuery),

      Payroll.aggregate([
        {
          $match: payrollQuery,
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
        present: presentAttendance,
        absent: absentAttendance,
        leave: leaveAttendance,
        halfDay: halfDayAttendance,
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
  async getWorkers(filter = {}, tenantId = null) {
    const query = {
      isDeleted: false,
      ...filter,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.find(query)
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
  async getAttendance(filter = {}, tenantId = null) {
    const query = {
      isDeleted: false,
      ...filter,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

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
      .sort({
        attendanceDate: -1,
      });
  }
  /**
   * ==========================================
   * Get Payroll
   * ==========================================
   */
  async getPayroll(query = {}, tenantId = null) {
    const filter = { isDeleted: false };

    if (query.search) {
        const WorkerModel = await import('../models/Worker.js');
        const workers = await WorkerModel.default.find({
            isDeleted: false,
            ...(tenantId ? { tenant: tenantId } : {}),
            $or: [
                { fullName: { $regex: query.search, $options: 'i' } },
                { employeeCode: { $regex: query.search, $options: 'i' } },
            ],
        });
        const workerIds = workers.map((w) => w._id);
        filter.worker = { $in: workerIds };
    }

    if (query.site) {
        filter.site = query.site;
    }

    if (query.attendanceMonth) {
        filter.attendanceMonth = Number(query.attendanceMonth);
    }

    if (query.attendanceYear) {
        filter.attendanceYear = Number(query.attendanceYear);
    }

    if (query.status) {
        filter.status = query.status;
    }

    if (tenantId) {
      filter.tenant = tenantId;
    }

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
        .sort({
            createdAt: -1,
        });
  }
  /**
   * ==========================================
   * Get Sites
   * ==========================================
   */
  async getSites(filter = {}, tenantId = null) {
    const query = {
      isDeleted: false,
      ...filter,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.find(query)
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
