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
  async getWorkerStats() {
    const totalWorkers =
      await Worker.countDocuments({
        isDeleted: false,
      });

    const activeWorkers =
      await Worker.countDocuments({
        status: 'ACTIVE',
        isDeleted: false,
      });

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
  async getSiteStats() {
    const activeSites =
      await Site.countDocuments({
        status: 'ACTIVE',
        isDeleted: false,
      });

    return {
      activeSites,
    };
  }

  /**
   * ==========================================
   * Today's Attendance
   * ==========================================
   */
  async getTodayAttendance(start, end) {
    const present =
      await Attendance.countDocuments({
        attendanceDate: {
          $gte: start,
          $lt: end,
        },
        status: 'PRESENT',
        isDeleted: false,
      });

    const absent =
      await Attendance.countDocuments({
        attendanceDate: {
          $gte: start,
          $lt: end,
        },
        status: 'ABSENT',
        isDeleted: false,
      });

    const leave =
      await Attendance.countDocuments({
        attendanceDate: {
          $gte: start,
          $lt: end,
        },
        status: 'LEAVE',
        isDeleted: false,
      });

    const halfDay =
      await Attendance.countDocuments({
        attendanceDate: {
          $gte: start,
          $lt: end,
        },
        status: 'HALF_DAY',
        isDeleted: false,
      });

    return {
      present,
      absent,
      leave,
      halfDay,
    };
  }

  /**
   * ==========================================
   * Payroll Statistics
   * ==========================================
   */
  async getPayrollStats() {
    const pendingSalary =
      await Payroll.aggregate([
        {
          $match: {
            status: 'GENERATED',
            isDeleted: false,
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
  async getRecentWorkers(limit = 5) {
    return await Worker.find({
      isDeleted: false,
    })
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
  async getRecentAttendance(limit = 5) {
    return await Attendance.find({
      isDeleted: false,
    })
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
  async getRecentPayroll(limit = 5) {
    return await Payroll.find({
      isDeleted: false,
    })
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
  async getPayrollStatusChart() {
    return await Payroll.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$status',
          value: {
            $sum: 1,
          },
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
    end
  ) {
    return await Attendance.aggregate([
      {
        $match: {
          attendanceDate: {
            $gte: start,
            $lt: end,
          },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$status',
          value: {
            $sum: 1,
          },
        },
      },
    ]);
  }

  /**
   * ==========================================
   * Site Worker Chart
   * ==========================================
   */
  async getSiteWorkerChart() {
    return await Worker.aggregate([
      {
        $match: {
          isDeleted: false,
          site: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: '$site',
          totalWorkers: {
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
          siteName: '$site.siteName',
          totalWorkers: 1,
        },
      },
    ]);
  }
}

export default new DashboardRepository();