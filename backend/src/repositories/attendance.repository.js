import Attendance from '../models/Attendance.js';

class AttendanceRepository {
  /**
   * ==========================================
   * Create Attendance
   * ==========================================
   */
  async create(attendanceData) {
    return await Attendance.create(attendanceData);
  }

  /**
   * ==========================================
   * Find Attendance By Id
   * ==========================================
   */
  async findById(attendanceId, tenantId = null) {
    const query = {
      _id: attendanceId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Attendance.findOne(query)
      .populate(
        'worker',
        'employeeCode fullName mobileNumber trade'
      )
      .populate(
        'site',
        'siteCode siteName clientName'
      )
      .populate(
        'createdBy',
        'fullName email'
      )
      .populate(
        'updatedBy',
        'fullName email'
      );
  }

  /**
   * ==========================================
   * Find Attendance By Worker & Date
   * ==========================================
   */
  async findByWorkerAndDate(
    worker,
    attendanceDate,
    tenantId = null
  ) {
    const query = {
      worker,
      attendanceDate,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Attendance.findOne(query);
  }
  /**
   * ==========================================
   * Find Attendance By Worker & Month
   * ==========================================
   */
  async findByWorkerAndMonth(
    workerId,
    attendanceMonth,
    attendanceYear,
    tenantId = null
  ) {
    const startDate = new Date(
      attendanceYear,
      attendanceMonth - 1,
      1
    );

    const endDate = new Date(
      attendanceYear,
      attendanceMonth,
      0,
      23,
      59,
      59,
      999
    );

    const query = {
      worker: workerId,
      attendanceDate: {
        $gte: startDate,
        $lte: endDate,
      },
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Attendance.find(query);
  }

    /**
     * ==========================================
     * Find Attendance By Month & Year
     * ==========================================
     */
    async findByMonthAndYear(
      attendanceMonth,
      attendanceYear,
      tenantId = null
    ) {
      const startDate = new Date(
        attendanceYear,
        attendanceMonth - 1,
        1
      );

      const endDate = new Date(
        attendanceYear,
        attendanceMonth,
        0,
        23,
        59,
        59,
        999
      );

      const query = {
        attendanceDate: {
          $gte: startDate,
          $lte: endDate,
        },
        isDeleted: false,
      };

      if (tenantId) {
        query.tenant = tenantId;
      }

      return await Attendance.find(query);
    }

    /**
     * ==========================================
     * Get Attendance List
     * ==========================================
     */
    async findAll(filter, options, tenantId = null) {
      const query = tenantId ? { ...filter, tenant: tenantId } : filter;

      return await Attendance.find(query)
        .populate(
          'worker',
          'employeeCode fullName mobileNumber trade'
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
    async count(filter, tenantId = null) {
      const query = tenantId ? { ...filter, tenant: tenantId } : filter;

      return await Attendance.countDocuments(
        query
      );
    }

    /**
     * ==========================================
     * Update Attendance
     * ==========================================
     */
    async update(
      attendanceId,
      updateData,
      tenantId = null
    ) {
      const query = {
        _id: attendanceId,
        isDeleted: false,
      };

      if (tenantId) {
        query.tenant = tenantId;
      }

      return await Attendance.findOneAndUpdate(
        query,
        updateData,
        {
          returnDocument: 'after',
          runValidators: true,
        }
      )
        .populate(
          'worker',
          'employeeCode fullName mobileNumber trade'
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
        );
    }

    /**
     * ==========================================
     * Change Attendance Status
     * ==========================================
     */
    async changeStatus(
      attendanceId,
      status,
      tenantId = null
    ) {
      const query = {
        _id: attendanceId,
        isDeleted: false,
      };

      if (tenantId) {
        query.tenant = tenantId;
      }

      return await Attendance.findOneAndUpdate(
        query,
        {
          status,
        },
        {
          returnDocument: 'after',
        }
      );
    }

    /**
     * ==========================================
     * Soft Delete Attendance
     * ==========================================
     */
    async softDelete(attendanceId, tenantId = null) {
      const query = {
        _id: attendanceId,
        isDeleted: false,
      };

      if (tenantId) {
        query.tenant = tenantId;
      }

      return await Attendance.findOneAndUpdate(
        query,
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        {
          returnDocument: 'after',
        }
      );
    }

    /**
     * ==========================================
     * Attendance Summary
     * ==========================================
     */
    async getSummary(filter, tenantId = null) {
      const query = tenantId ? { ...filter, tenant: tenantId } : filter;

      return await Attendance.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: '$status',
            count: {
              $sum: 1,
            },
          },
        },
      ]);
    }

    /**
     * ==========================================
     * Worker Attendance History
     * ==========================================
     */
    async findWorkerHistory(
      workerId,
      options,
      tenantId = null
    ) {
      const query = {
        worker: workerId,
        isDeleted: false,
      };

      if (tenantId) {
        query.tenant = tenantId;
      }

      return await Attendance.find(query)
        .populate(
          'site',
          'siteCode siteName'
        )
        .sort({
          attendanceDate: -1,
        })
        .skip(options.skip)
        .limit(options.limit);
    }
  }

  export default new AttendanceRepository();
