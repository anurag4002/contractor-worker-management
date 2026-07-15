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
        workerStats.totalWorkers,

      active:
        workerStats.activeWorkers,
    },

    sites: {
      active:
        siteStats.activeSites,
    },

    attendance: {
      present:
        attendanceStats.present,

      absent:
        attendanceStats.absent,

      leave:
        attendanceStats.leave,

      halfDay:
        attendanceStats.halfDay,
    },

    payroll: {
      pendingSalary:
        payrollStats.pendingSalary,
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

  return {
    attendanceChart,
    payrollStatusChart,
    siteWorkerChart,
  };
}

}

export default new DashboardService();