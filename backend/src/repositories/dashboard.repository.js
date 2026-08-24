import Worker from '../models/Worker.js';
import Site from '../models/Site.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';

class DashboardRepository {
  /**
   * ==========================================
   * Worker Statistics
   * ==========================================
   */
  async getWorkerStats(tenantId = null) {
    const workerQuery = { isDeleted: false };
    const activeWorkerQuery = {
      status: 'ACTIVE',
      isDeleted: false,
    };

    if (tenantId) {
      workerQuery.tenant = tenantId;
      activeWorkerQuery.tenant = tenantId;
    }

    const totalWorkers =
      await Worker.countDocuments(workerQuery);

    const activeWorkers =
      await Worker.countDocuments(activeWorkerQuery);

    return {
      totalWorkers,
      activeWorkers,
    };
  }

  /**
   * ==========================================
   * Site Statistics
   * ==========================================
   */
  async getSiteStats(tenantId = null) {
    const query = {
      status: 'ACTIVE',
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    const activeSites =
      await Site.countDocuments(query);

    return {
      activeSites,
    };
  }

  /**
   * ==========================================
   * Today's Attendance
   * ==========================================
   */
  async getTodayAttendance(start, end, tenantId = null) {
    const baseMatch = {
      attendanceDate: {
        $gte: start,
        $lt: end,
      },
      isDeleted: false,
    };

    if (tenantId) {
      baseMatch.tenant = tenantId;
    }

    const present =
      await Attendance.countDocuments({
        ...baseMatch,
        status: 'PRESENT',
      });

    const absent =
      await Attendance.countDocuments({
        ...baseMatch,
        status: 'ABSENT',
      });

    const leave =
      await Attendance.countDocuments({
        ...baseMatch,
        status: 'LEAVE',
      });

    const halfDay =
      await Attendance.countDocuments({
        ...baseMatch,
        status: 'HALF_DAY',
      });

    const holiday =
      await Attendance.countDocuments({
        ...baseMatch,
        status: 'HOLIDAY',
      });

    return {
      present,
      absent,
      leave,
      halfDay,
      holiday,
    };
  }

  async getTodayPresentBySite(tenantId = null) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(24, 0, 0, 0);

    const match = {
      attendanceDate: {
        $gte: start,
        $lt: end,
      },
      status: 'PRESENT',
      isDeleted: false,
    };

    if (tenantId) {
      match.tenant = tenantId;
    }

    return await Attendance.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: '$site',
          present: {
            $sum: 1,
          },
        },
      },
    ]);
  }

  /**
   * ==========================================
   * Payroll Statistics
   * ==========================================
   */
  async getPayrollStats(tenantId = null) {
    const match = {
      status: 'GENERATED',
      isDeleted: false,
    };

    if (tenantId) {
      match.tenant = tenantId;
    }

    const pendingSalary =
      await Payroll.aggregate([
        {
          $match: match,
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$netSalary',
            },
          },
        },
      ]);

    return {
      pendingSalary:
        pendingSalary.length > 0
          ? pendingSalary[0].total
          : 0,
    };
  }

  /**
   * ==========================================
   * Recent Workers
   * ==========================================
   */
  async getRecentWorkers(limit = 5, tenantId = null) {
    const query = {
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.find(query)
      .sort({
        createdAt: -1,
      })
      .limit(limit);
  }

  /**
   * ==========================================
   * Recent Attendance
   * ==========================================
   */
  async getRecentAttendance(limit = 5, tenantId = null) {
    const query = {
      isDeleted: false,
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
      .sort({
        attendanceDate: -1,
      })
      .limit(limit);
  }

  /**
   * ==========================================
   * Recent Payroll
   * ==========================================
   */
  async getRecentPayroll(limit = 5, tenantId = null) {
    const query = {
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payroll.find(query)
      .populate(
        'worker',
        'employeeCode fullName'
      )
      .populate(
        'site',
        'siteCode siteName'
      )
      .sort({
        createdAt: -1,
      })
      .limit(limit);
  }

  /**
   * ==========================================
   * Payroll Status Chart
   * ==========================================
   */
  async getPayrollStatusChart(tenantId = null) {
    const match = {
      isDeleted: false,
    };

    if (tenantId) {
      match.tenant = tenantId;
    }

    return await Payroll.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: '$status',
          value: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1,
        },
      },
    ]);
  }

  /**
   * ==========================================
   * Attendance Status Chart
   * ==========================================
   */
  async getAttendanceChart(
    start,
    end,
    tenantId = null
  ) {
    const match = {
      attendanceDate: {
        $gte: start,
        $lt: end,
      },
      isDeleted: false,
    };

    if (tenantId) {
      match.tenant = tenantId;
    }

    return await Attendance.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: '$status',
          value: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1,
        },
      },
    ]);
  }

  /**
   * ==========================================
   * Site Worker Chart
   * ==========================================
   */
  async getSiteWorkerChart(tenantId = null) {
    const match = {
      isDeleted: false,
      site: {
        $ne: null,
      },
    };

    if (tenantId) {
      match.tenant = tenantId;
    }

    return await Worker.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: '$site',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'sites',
          localField: '_id',
          foreignField: '_id',
          as: 'site',
        },
      },
      {
        $unwind: '$site',
      },
      {
        $project: {
          _id: 0,
          site: '$site.siteName',
          count: 1,
        },
      },
    ]);
  }
}

export default new DashboardRepository();
