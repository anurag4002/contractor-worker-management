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
  async findById(payrollId, tenantId = null) {
    const query = {
      _id: payrollId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payroll.findOne(query)
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
    attendanceYear,
    tenantId = null
  ) {
    const query = {
      worker,
      attendanceMonth,
      attendanceYear,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payroll.findOne(query);
  }

  /**
   * ==========================================
   * Get Payroll List
   * ==========================================
   */
  async findAll(filter, options, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await Payroll.find(query)
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
  async count(filter, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await Payroll.countDocuments(query);
  }

  /**
   * ==========================================
   * Update Payroll
   * ==========================================
   */
  async update(
    payrollId,
    updateData,
    tenantId = null,
    session = null
  ) {
    const query = {
      _id: payrollId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payroll.findOneAndUpdate(
      query,
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
  async findPaymentsByPayroll(payrollId, tenantId = null, options = {}) {
    const { skip = 0, limit = 10, sort = { paymentDate: -1 } } = options;

    const query = {
      _id: payrollId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payroll.findOne(query)
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
    status,
    tenantId = null
  ) {
    const query = {
      _id: payrollId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payroll.findOneAndUpdate(
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
   * Soft Delete Payroll
   * ==========================================
   */
  async softDelete(payrollId, tenantId = null) {
    const query = {
      _id: payrollId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payroll.findOneAndUpdate(
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
   * Worker Payroll History
   * ==========================================
   */
  async findWorkerPayrolls(
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

    return await Payroll.find(query)
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
  async getSummary(filter, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await Payroll.aggregate([
      {
        $match: query,
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
