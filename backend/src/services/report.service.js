import reportRepository from '../repositories/report.repository.js';

class ReportService {
    /**
 * ==========================================
 * Get Worker Report
 * ==========================================
 */
async getWorkerReport(query) {
  const page =
    Number(query.page) || 1;

  const limit =
    Number(query.limit) || 10;

  const skip =
    (page - 1) * limit;

  const sort = {
    [query.sortBy || 'createdAt']:
      query.sortOrder === 'asc'
        ? 1
        : -1,
  };

  const filter = {
    isDeleted: false,
  };

  if (query.search) {
    filter.$or = [
      {
        fullName: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        employeeCode: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        mobileNumber: {
          $regex: query.search,
          $options: 'i',
        },
      },
    ];
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.site) {
    filter.site = query.site;
  }

  if (query.trade) {
    filter.trade = query.trade;
  }

  const workers =
    await reportRepository.getWorkerReport(
      filter,
      {
        skip,
        limit,
        sort,
      }
    );

  const total =
    await reportRepository.countWorkers(
      filter
    );

  return {
    workers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}
/**
 * ==========================================
 * Get Attendance Report
 * ==========================================
 */
async getAttendanceReport(query) {
  const page =
    Number(query.page) || 1;

  const limit =
    Number(query.limit) || 10;

  const skip =
    (page - 1) * limit;

  const sort = {
    [query.sortBy || 'attendanceDate']:
      query.sortOrder === 'asc'
        ? 1
        : -1,
  };

  const filter = {
    isDeleted: false,
  };

  if (query.worker) {
    filter.worker = query.worker;
  }

  if (query.site) {
    filter.site = query.site;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.fromDate || query.toDate) {
    filter.attendanceDate = {};

    if (query.fromDate) {
      filter.attendanceDate.$gte =
        new Date(query.fromDate);
    }

    if (query.toDate) {
      const endDate = new Date(
        query.toDate
      );

      endDate.setHours(
        23,
        59,
        59,
        999
      );

      filter.attendanceDate.$lte =
        endDate;
    }
  }

  const attendance =
    await reportRepository.getAttendanceReport(
      filter,
      {
        skip,
        limit,
        sort,
      }
    );

  const total =
    await reportRepository.countAttendance(
      filter
    );

  return {
    attendance,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}
/**
 * ==========================================
 * Get Payroll Report
 * ==========================================
 */
async getPayrollReport(query) {
  const page =
    Number(query.page) || 1;

  const limit =
    Number(query.limit) || 10;

  const skip =
    (page - 1) * limit;

  const sort = {
    [query.sortBy || 'createdAt']:
      query.sortOrder === 'asc'
        ? 1
        : -1,
  };

  const filter = {
    isDeleted: false,
  };

  if (query.worker) {
    filter.worker = query.worker;
  }

  if (query.site) {
    filter.site = query.site;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.attendanceMonth) {
    filter.attendanceMonth = Number(
      query.attendanceMonth
    );
  }

  if (query.attendanceYear) {
    filter.attendanceYear = Number(
      query.attendanceYear
    );
  }

  const payroll =
    await reportRepository.getPayrollReport(
      filter,
      {
        skip,
        limit,
        sort,
      }
    );

  const total =
    await reportRepository.countPayroll(
      filter
    );

  return {
    payroll,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}
/**
 * ==========================================
 * Get Site Report
 * ==========================================
 */
async getSiteReport(query) {
  const page =
    Number(query.page) || 1;

  const limit =
    Number(query.limit) || 10;

  const skip =
    (page - 1) * limit;

  const sort = {
    [query.sortBy || 'createdAt']:
      query.sortOrder === 'asc'
        ? 1
        : -1,
  };

  const filter = {
    isDeleted: false,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.city) {
    filter.city = query.city;
  }

  if (query.state) {
    filter.state = query.state;
  }

  if (query.clientName) {
    filter.clientName = {
      $regex: query.clientName,
      $options: 'i',
    };
  }

  if (query.search) {
    filter.$or = [
      {
        siteName: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        siteCode: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        projectName: {
          $regex: query.search,
          $options: 'i',
        },
      },
    ];
  }

  const sites =
    await reportRepository.getSiteReport(
      filter,
      {
        skip,
        limit,
        sort,
      }
    );

  const total =
    await reportRepository.countSites(
      filter
    );

  return {
    sites,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}
/**
 * ==========================================
 * Get Dashboard Report
 * ==========================================
 */
async getDashboardReport() {
  const dashboard =
    await reportRepository.getDashboardReport();

  return dashboard;
}

}

export default new ReportService();