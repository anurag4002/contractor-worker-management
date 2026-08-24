import mongoose from 'mongoose';
import Payment from '../models/Payment.js';

class PaymentRepository {
  async create(paymentData, session = null) {
    if (session) {
      const payment = new Payment(paymentData);
      await payment.save({ session });
      return payment;
    }
    return await Payment.create(paymentData);
  }

  async findById(paymentId, tenantId = null) {
    const query = {
      _id: paymentId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payment.findOne(query)
      .populate('payroll', 'grossSalary netSalary advanceDeduction status')
      .populate('worker', 'employeeCode fullName mobileNumber trade')
      .populate('site', 'siteCode siteName')
      .populate('createdBy', 'fullName email');
  }

  async findByPayroll(payrollId, tenantId = null, options = {}) {
    const { skip = 0, limit = 10, sort = { paymentDate: -1 } } = options;

    const query = {
      payroll: payrollId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payment.find(query)
      .populate('worker', 'employeeCode fullName mobileNumber trade')
      .populate('site', 'siteCode siteName')
      .populate('createdBy', 'fullName email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findByWorker(workerId, tenantId = null, options = {}) {
    const { skip = 0, limit = 10, sort = { paymentDate: -1 } } = options;

    const query = {
      worker: workerId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payment.find(query)
      .populate('payroll', 'grossSalary netSalary advanceDeduction status attendanceMonth attendanceYear')
      .populate('site', 'siteCode siteName')
      .populate('createdBy', 'fullName email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async countByPayroll(payrollId, tenantId = null) {
    const query = {
      payroll: payrollId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payment.countDocuments(query);
  }

  async getTotalPaidByPayroll(payrollId, tenantId = null) {
    const query = {
      payroll: new mongoose.Types.ObjectId(payrollId),
      status: 'COMPLETED',
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    const result = await Payment.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: null,
          totalPaid: {
            $sum: '$amount',
          },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalPaid : 0;
  }

  async softDelete(paymentId, tenantId = null) {
    const query = {
      _id: paymentId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Payment.findOneAndUpdate(
      query,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { returnDocument: 'after' }
    );
  }
}

export default new PaymentRepository();
