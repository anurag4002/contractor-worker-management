import dashboardRepository from '../repositories/dashboard.repository.js';

class DashboardService {
    /**
 * ==========================================
 * Get Dashboard
 * ==========================================
 */
async getDashboard() {
  // Today's Date Range
  const start = new Date();

  start.setHours(0, 0, 0, 0);

  const end = new Date();

  end.setHours(24, 0, 0, 0);

  // Fetch Dashboard Data
  const [
    workerStats,
    siteStats,
    attendanceStats,
    payrollStats,
  ] = await Promise.all([
    dashboardRepository.getWorkerStats(),

    dashboardRepository.getSiteStats(),

    dashboardRepository.getTodayAttendance(
      start,
      end
    ),

    dashboardRepository.getPayrollStats(),
  ]);

  return {
    workers: {
      total:
        workerStats.totalWorkers || 0,

      active:
        workerStats.activeWorkers || 0,
    },

    sites: {
      active:
        siteStats.activeSites || 0,
    },

    attendance: {
      present:
        attendanceStats.present || 0,

      absent:
        attendanceStats.absent || 0,

      leave:
        attendanceStats.leave || 0,

      halfDay:
        attendanceStats.halfDay || 0,

      holiday:
        attendanceStats.holiday || 0,
    },

    payroll: {
      pendingSalary:
        payrollStats.pendingSalary || 0,
    },
  };
}
/**
 * ==========================================
 * Get Recent Workers
 * ==========================================
 */
async getRecentWorkers() {
  const workers =
    await dashboardRepository.getRecentWorkers();

  return workers;
}
/**
 * ==========================================
 * Get Recent Attendance
 * ==========================================
 */
async getRecentAttendance() {
  const attendance =
    await dashboardRepository.getRecentAttendance();

  return attendance;
}
/**
 * ==========================================
 * Get Recent Payroll
 * ==========================================
 */
async getRecentPayroll() {
  const payroll =
    await dashboardRepository.getRecentPayroll();

  return payroll;
}
/**
 * ==========================================
 * Get Dashboard Charts
 * ==========================================
 */
async getCharts() {
    // Today's Date Range
    const start = new Date();

    start.setHours(0, 0, 0, 0);

    const end = new Date();

    end.setHours(24, 0, 0, 0);

    const [
      attendanceChart,
      payrollStatusChart,
      siteWorkerChart,
    ] = await Promise.all([
      dashboardRepository.getAttendanceChart(
        start,
        end
      ),

      dashboardRepository.getPayrollStatusChart(),

      dashboardRepository.getSiteWorkerChart(),
    ]);

    const formatName = (name) => {
      if (!name) return name;
      return name
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    const expectedStatuses = [
      'PRESENT',
      'ABSENT',
      'LEAVE',
      'HALF_DAY',
      'HOLIDAY',
    ];

    const attendanceMap = new Map(
      attendanceChart.map((item) => [
        item.name,
        item.value,
      ])
    );

    return {
      attendanceChart: expectedStatuses.map((status) => ({
        name: formatName(status),
        value: attendanceMap.get(status) || 0,
      })),

      payrollStatusChart: payrollStatusChart.map(
        (item) => ({
          name: formatName(item.name),
          value: item.value,
        })
      ),

      siteWorkerChart: siteWorkerChart.map(
        (item) => ({
          site: item.site,
          count: item.count,
        })
      ),
    };
  }

}

export default new DashboardService();