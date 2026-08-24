import dashboardRepository from '../repositories/dashboard.repository.js';

class DashboardService {
    /**
 * ==========================================
 * Get Dashboard
 * ==========================================
 */
async getDashboard(tenantId) {
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
    dashboardRepository.getWorkerStats(tenantId),

    dashboardRepository.getSiteStats(tenantId),

    dashboardRepository.getTodayAttendance(
      start,
      end,
      tenantId
    ),

    dashboardRepository.getPayrollStats(tenantId),
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
async getRecentWorkers(tenantId) {
  const workers =
    await dashboardRepository.getRecentWorkers(5, tenantId);

  return workers;
}
/**
 * ==========================================
 * Get Recent Attendance
 * ==========================================
 */
async getRecentAttendance(tenantId) {
  const attendance =
    await dashboardRepository.getRecentAttendance(5, tenantId);

  return attendance;
}
/**
 * ==========================================
 * Get Recent Payroll
 * ==========================================
 */
async getRecentPayroll(tenantId) {
  const payroll =
    await dashboardRepository.getRecentPayroll(5, tenantId);

  return payroll;
}
/**
 * ==========================================
 * Get Dashboard Charts
 * ==========================================
 */
async getCharts(tenantId) {
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
        end,
        tenantId
      ),

      dashboardRepository.getPayrollStatusChart(tenantId),

      dashboardRepository.getSiteWorkerChart(tenantId),
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