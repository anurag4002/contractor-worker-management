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
  async findById(attendanceId) {
    return await Attendance.findOne({
      _id: attendanceId,
      isDeleted: false,
    })
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
    attendanceDate
  ) {
    return await Attendance.findOne({
      worker,
      attendanceDate,
      isDeleted: false,
    });
  }
  /**
 * ==========================================
 * Find Attendance By Worker & Month
 * ==========================================
 */
async findByWorkerAndMonth(
  workerId,
  attendanceMonth,
  attendanceYear
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

  return await Attendance.find({
    worker: workerId,
    attendanceDate: {
      $gte: startDate,
      $lte: endDate,
    },
    isDeleted: false,
  });
}

  /**
   * ==========================================
   * Get Attendance List
   * ==========================================
   */
  async findAll(filter, options) {
    return await Attendance.find(filter)
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
  async count(filter) {
    return await Attendance.countDocuments(
      filter
    );
  }

  /**
   * ==========================================
   * Update Attendance
   * ==========================================
   */
  async update(
    attendanceId,
    updateData
  ) {
    return await Attendance.findOneAndUpdate(
      {
        _id: attendanceId,
        isDeleted: false,
      },
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
    status
  ) {
    return await Attendance.findOneAndUpdate(
      {
        _id: attendanceId,
        isDeleted: false,
      },
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
  async softDelete(attendanceId) {
    return await Attendance.findOneAndUpdate(
      {
        _id: attendanceId,
        isDeleted: false,
      },
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
  async getSummary(filter) {
    return await Attendance.aggregate([
      {
        $match: filter,
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
    options
  ) {
    return await Attendance.find({
      worker: workerId,
      isDeleted: false,
    })
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