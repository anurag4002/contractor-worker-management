import axios from "../api/axios";

const dashboardService = {
  /*
  |--------------------------------------------------------------------------
  | Dashboard Summary
  |--------------------------------------------------------------------------
  */

  getDashboard: async () => {
    const { data } = await axios.get(
      "/dashboard"
    );

    return data;
  },

  /*
  |--------------------------------------------------------------------------
  | Recent Workers
  |--------------------------------------------------------------------------
  */

  getRecentWorkers: async () => {
    const { data } = await axios.get(
      "/dashboard/recent-workers"
    );

    return data;
  },

  /*
  |--------------------------------------------------------------------------
  | Recent Attendance
  |--------------------------------------------------------------------------
  */

  getRecentAttendance: async () => {
    const { data } = await axios.get(
      "/dashboard/recent-attendance"
    );

    return data;
  },

  /*
  |--------------------------------------------------------------------------
  | Recent Payroll
  |--------------------------------------------------------------------------
  */

  getRecentPayroll: async () => {
    const { data } = await axios.get(
      "/dashboard/recent-payroll"
    );

    return data;
  },

  /*
  |--------------------------------------------------------------------------
  | Dashboard Charts
  |--------------------------------------------------------------------------
  */

  getCharts: async () => {
    const { data } = await axios.get(
      "/dashboard/charts"
    );

    return data;
  },
};

export default dashboardService;