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

  async findById(paymentId) {
    return await Payment.findOne({
      _id: paymentId,
      isDeleted: false,
    })
      .populate('payroll', 'grossSalary netSalary advanceDeduction status')
      .populate('worker', 'employeeCode fullName mobileNumber trade')
      .populate('site', 'siteCode siteName')
      .populate('createdBy', 'fullName email');
  }

  async findByPayroll(payrollId, options = {}) {
    const { skip = 0, limit = 10, sort = { paymentDate: -1 } } = options;

    return await Payment.find({
      payroll: payrollId,
      isDeleted: false,
    })
      .populate('worker', 'employeeCode fullName mobileNumber trade')
      .populate('site', 'siteCode siteName')
      .populate('createdBy', 'fullName email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findByWorker(workerId, options = {}) {
    const { skip = 0, limit = 10, sort = { paymentDate: -1 } } = options;

    return await Payment.find({
      worker: workerId,
      isDeleted: false,
    })
      .populate('payroll', 'grossSalary netSalary advanceDeduction status attendanceMonth attendanceYear')
      .populate('site', 'siteCode siteName')
      .populate('createdBy', 'fullName email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async countByPayroll(payrollId) {
    return await Payment.countDocuments({
      payroll: payrollId,
      isDeleted: false,
    });
  }

  async getTotalPaidByPayroll(payrollId) {
    const result = await Payment.aggregate([
      {
        $match: {
          payroll: new mongoose.Types.ObjectId(payrollId),
          status: 'COMPLETED',
          isDeleted: false,
        },
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

  async softDelete(paymentId) {
    return await Payment.findOneAndUpdate(
      { _id: paymentId, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { returnDocument: 'after' }
    );
  }
}

export default new PaymentRepository();
