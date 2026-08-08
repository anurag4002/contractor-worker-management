import Payroll from '../models/Payroll.js';

class PayrollRepository {
  /**
   * ==========================================
   * Create Payroll
   * ==========================================
   */
  async create(payrollData) {
    return await Payroll.create(payrollData);
  }

  /**
   * ==========================================
   * Find Payroll By Id
   * ==========================================
   */
  async findById(payrollId, session = null) {
    return await Payroll.findOne({
      _id: payrollId,
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
      )
      .populate({
        path: 'payments',
        match: { isDeleted: false },
        options: {
          sort: { paymentDate: -1 },
          ...(session ? { session } : {}),
        },
      });
  }

  /**
   * ==========================================
   * Find Payroll By Worker & Month
   * ==========================================
   */
  async findByWorkerAndMonth(
    worker,
    attendanceMonth,
    attendanceYear
  ) {
    return await Payroll.findOne({
      worker,
      attendanceMonth,
      attendanceYear,
      isDeleted: false,
    });
  }

  /**
   * ==========================================
   * Get Payroll List
   * ==========================================
   */
  async findAll(filter, options) {
    return await Payroll.find(filter)
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
      .populate({
        path: 'payments',
        match: { isDeleted: false, status: 'COMPLETED' },
        options: { sort: { paymentDate: -1 }, limit: 50 },
      })
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * ==========================================
   * Count Payroll
   * ==========================================
   */
  async count(filter) {
    return await Payroll.countDocuments(filter);
  }

  /**
   * ==========================================
   * Update Payroll
   * ==========================================
   */
  async update(
    payrollId,
    updateData,
    session = null
  ) {
    return await Payroll.findOneAndUpdate(
      {
        _id: payrollId,
        isDeleted: false,
      },
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
        ...(session ? { session } : {}),
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
      )
      .populate({
        path: 'payments',
        match: { isDeleted: false },
        options: { sort: { paymentDate: -1 } },
      });
  }

  /**
   * ==========================================
   * Get Payroll Payments
   * ==========================================
   */
  async findPaymentsByPayroll(payrollId, options = {}) {
    const { skip = 0, limit = 10, sort = { paymentDate: -1 } } = options;

    return await Payroll.findOne({
      _id: payrollId,
      isDeleted: false,
    })
      .populate({
        path: 'payments',
        match: { isDeleted: false },
        options: { sort, skip, limit },
      })
      .populate('worker', 'employeeCode fullName mobileNumber trade')
      .populate('site', 'siteCode siteName');
  }

  /**
   * ==========================================
   * Change Payroll Status
   * ==========================================
   */
  async changeStatus(
    payrollId,
    status
  ) {
    return await Payroll.findOneAndUpdate(
      {
        _id: payrollId,
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
   * Soft Delete Payroll
   * ==========================================
   */
  async softDelete(payrollId) {
    return await Payroll.findOneAndUpdate(
      {
        _id: payrollId,
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
   * Worker Payroll History
   * ==========================================
   */
  async findWorkerPayrolls(
    workerId,
    options
  ) {
    return await Payroll.find({
      worker: workerId,
      isDeleted: false,
    })
      .populate(
        'site',
        'siteCode siteName'
      )
      .sort({
        attendanceYear: -1,
        attendanceMonth: -1,
      })
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * ==========================================
   * Payroll Summary
   * ==========================================
   */
  async getSummary(filter) {
    return await Payroll.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
          totalNetSalary: {
            $sum: '$netSalary',
          },
        },
      },
    ]);
  }
}

export default new PayrollRepository();