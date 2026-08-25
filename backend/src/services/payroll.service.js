import { StatusCodes } from 'http-status-codes';

import mongoose from 'mongoose';

import payrollRepository from '../repositories/payroll.repository.js';
import paymentRepository from '../repositories/payment.repository.js';
import attendanceRepository from '../repositories/attendance.repository.js';
import workerRepository from '../repositories/worker.repository.js';
import siteRepository from '../repositories/site.repository.js';

import ApiError from '../common/errors/ApiError.js';

import PAYROLL_MESSAGES from '../common/constants/payroll.messages.js';

class PayrollService {
    /**
 * ==========================================
 * Create Payroll
 * ==========================================
 */
    async createPayroll(
        payrollData,
        createdBy,
        tenantId
    ) {
        // Validate Worker
        const worker =
            await workerRepository.findById(
                payrollData.worker,
                tenantId
            );

        if (!worker) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.WORKER_NOT_FOUND
            );
        }

        // Validate Site
        const site =
            await siteRepository.findActiveById(
                payrollData.site,
                tenantId
            );

        if (!site) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.SITE_NOT_FOUND
            );
        }

        // Prevent Duplicate Payroll
        const existingPayroll =
            await payrollRepository.findByWorkerAndMonth(
                payrollData.worker,
                payrollData.attendanceMonth,
                payrollData.attendanceYear,
                tenantId
            );

        if (existingPayroll) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                PAYROLL_MESSAGES.ALREADY_GENERATED
            );
        }

        // Fetch Attendance
        const attendanceRecords =
            await attendanceRepository.findByWorkerAndMonth(
                payrollData.worker,
                payrollData.attendanceMonth,
                payrollData.attendanceYear,
                tenantId
            );

        if (
            attendanceRecords.length === 0
        ) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.ATTENDANCE_NOT_FOUND
            );
        }

        let workingDays = 0;
        let presentDays = 0;
        let absentDays = 0;
        let halfDays = 0;
        let leaveDays = 0;

        let regularHours = 0;
        let overtimeHours = 0;

        attendanceRecords.forEach(
            (attendance) => {
                workingDays++;

                switch (attendance.status) {
                    case 'PRESENT':
                        presentDays++;
                        break;

                    case 'ABSENT':
                        absentDays++;
                        break;

                    case 'HALF_DAY':
                        halfDays++;
                        break;

                    case 'LEAVE':
                        leaveDays++;
                        break;
                }

                regularHours +=
                    attendance.regularHours || 0;

                overtimeHours +=
                    attendance.overtimeHours || 0;
            }
        );

        // Salary Calculation
        const basicSalary =
            presentDays *
            payrollData.dailyWage;

        const overtimeAmount =
            overtimeHours *
            payrollData.overtimeRate;

        const grossSalary =
            basicSalary +
            overtimeAmount +
            payrollData.bonus;

        const netSalary =
            grossSalary -
            payrollData.deduction -
            payrollData.advanceDeduction;

        // Create Payroll
        const tenant = worker.tenant || tenantId;
        const payroll =
            await payrollRepository.create({
                ...payrollData,
                tenant,

                workingDays,
                presentDays,
                absentDays,
                halfDays,
                leaveDays,

                regularHours,
                overtimeHours,

                basicSalary,
                overtimeAmount,
                grossSalary,
                netSalary,

                status: 'GENERATED',

                createdBy,
            });

        return await payrollRepository.findById(
            payroll._id,
            tenantId
        );
    }
    /**
     * ==========================================
     * Get Payrolls
     * ==========================================
     */
    async getPayrolls(query, tenantId) {
        const {
            page = 1,
            limit = 10,
            search = '',
            worker,
            site,
            attendanceMonth,
            attendanceYear,
            status,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        const filter = {
            isDeleted: false,
        };

        if (tenantId) {
            filter.tenant = tenantId;
        }

        // Search
        if (search) {
            filter.$or = [
                {
                    remarks: {
                        $regex: search,
                        $options: 'i',
                    },
                },
            ];
        }

        // Worker Filter
        if (worker) {
            filter.worker = worker;
        }

        // Site Filter
        if (site) {
            filter.site = site;
        }

        // Month Filter
        if (attendanceMonth) {
            filter.attendanceMonth =
                Number(attendanceMonth);
        }

        // Year Filter
        if (attendanceYear) {
            filter.attendanceYear =
                Number(attendanceYear);
        }

        // Status Filter
        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const options = {
            skip,
            limit: Number(limit),
            sort: {
                [sortBy]:
                    sortOrder === 'asc' ? 1 : -1,
            },
        };

        const payrolls =
            await payrollRepository.findAll(
                filter,
                options,
                tenantId
            );

        const total =
            await payrollRepository.count(
                filter,
                tenantId
            );

        return {
            payrolls,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(
                    total / limit
                ),
            },
        };
    }
    /**
     * ==========================================
     * Get Payroll By Id
     * ==========================================
     */
    async getPayrollById(payrollId, tenantId) {
        const payroll =
            await payrollRepository.findById(
                payrollId,
                tenantId
            );

        if (!payroll) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.NOT_FOUND
            );
        }

        return payroll;
    }
    /**
     * ==========================================
     * Update Payroll
     * ==========================================
     */
    async updatePayroll(
        payrollId,
        updateData,
        updatedBy,
        tenantId
    ) {
        // Check Payroll Exists
        const payroll =
            await payrollRepository.findById(
                payrollId,
                tenantId
            );

        if (!payroll) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.NOT_FOUND
            );
        }

        // Prevent Update if Paid
        if (payroll.status === 'PAID') {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                PAYROLL_MESSAGES.PAYROLL_ALREADY_PAID
            );
        }

        // Prevent Update if Cancelled
        if (
            payroll.status === 'CANCELLED'
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                PAYROLL_MESSAGES.PAYROLL_ALREADY_CANCELLED
            );
        }

        // Prepare Updated Values
        const dailyWage =
            updateData.dailyWage ??
            payroll.dailyWage;

        const overtimeRate =
            updateData.overtimeRate ??
            payroll.overtimeRate;

        const bonus =
            updateData.bonus ??
            payroll.bonus;

        const deduction =
            updateData.deduction ??
            payroll.deduction;

        const advanceDeduction =
            updateData.advanceDeduction ??
            payroll.advanceDeduction;

        // Recalculate Salary
        const basicSalary =
            payroll.presentDays *
            dailyWage;

        const overtimeAmount =
            payroll.overtimeHours *
            overtimeRate;

        const grossSalary =
            basicSalary +
            overtimeAmount +
            bonus;

        const netSalary =
            grossSalary -
            deduction -
            advanceDeduction;

        // Update Payroll
        const updatedPayroll =
            await payrollRepository.update(
                payrollId,
                {
                    ...updateData,

                    basicSalary,
                    overtimeAmount,
                    grossSalary,
                    netSalary,

                    updatedBy,
                },
                tenantId
            );

        return updatedPayroll;
    }
    /**
     * ==========================================
     * Change Payroll Status
     * ==========================================
     */
    async changeStatus(
        payrollId,
        status,
        tenantId
    ) {
        // Check Payroll Exists
        const payroll =
            await payrollRepository.findById(
                payrollId,
                tenantId
            );

        if (!payroll) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.NOT_FOUND
            );
        }

        // Prevent Status Change if Cancelled
        if (
            payroll.status === 'CANCELLED'
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                PAYROLL_MESSAGES.PAYROLL_ALREADY_CANCELLED
            );
        }

        // Update Status
        return await payrollRepository.changeStatus(
            payrollId,
            status,
            tenantId
        );
    }
    /**
     * ==========================================
     * Delete Payroll
     * ==========================================
     */
    async deletePayroll(payrollId, tenantId) {
        // Check Payroll Exists
        const payroll =
            await payrollRepository.findById(
                payrollId,
                tenantId
            );

        if (!payroll) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.NOT_FOUND
            );
        }

        // Prevent Delete if Paid
        if (payroll.status === 'PAID') {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                PAYROLL_MESSAGES.PAYROLL_ALREADY_PAID
            );
        }

        // Soft Delete
        await payrollRepository.softDelete(
            payrollId,
            tenantId
        );

        return {
            message:
                PAYROLL_MESSAGES.DELETED_SUCCESS,
        };
    }
    /**
     * ==========================================
     * Get Worker Payroll History
     * ==========================================
     */
    async getWorkerPayrollHistory(
        workerId,
        query,
        tenantId
    ) {
        // Validate Worker
        const worker =
            await workerRepository.findById(
                workerId,
                tenantId
            );

        if (!worker) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.WORKER_NOT_FOUND
            );
        }

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip = (page - 1) * limit;

        const payrolls =
            await payrollRepository.findWorkerPayrolls(
                workerId,
                {
                    skip,
                    limit,
                },
                tenantId
            );

        const total =
            await payrollRepository.count({
                worker: workerId,
                isDeleted: false,
                ...(tenantId ? { tenant: tenantId } : {}),
            });

        return {
            payrolls,
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
     * Payroll Summary
     * ==========================================
     */
    async getSummary(query, tenantId) {
        const filter = {
            isDeleted: false,
        };

        if (tenantId) {
            filter.tenant = tenantId;
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

        if (query.site) {
            filter.site = query.site;
        }

        const summary =
            await payrollRepository.getSummary(
                filter,
                tenantId
            );

        const result = {
            totalPayrolls: 0,

            pending: 0,
            generated: 0,
            paid: 0,
            cancelled: 0,

            totalNetSalary: 0,
        };

        summary.forEach((item) => {
            result.totalPayrolls += item.count;

            result.totalNetSalary +=
                item.totalNetSalary || 0;

            switch (item._id) {
                case 'PENDING':
                    result.pending = item.count;
                    break;

                case 'GENERATED':
                    result.generated = item.count;
                    break;

                case 'PAID':
                    result.paid = item.count;
                    break;

                case 'CANCELLED':
                    result.cancelled = item.count;
                    break;
            }
        });

        return result;
    }
    /**
     * ==========================================
     * Generate Salary from Attendance
     * ==========================================
     */
    async generateSalaryFromAttendance(attendanceMonth, attendanceYear, createdBy, tenantId) {
        const attendanceRecords =
            await attendanceRepository.findByMonthAndYear(
                attendanceMonth,
                attendanceYear,
                tenantId
            );

        if (attendanceRecords.length === 0) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.NO_ATTENDANCE_DATA
            );
        }

        const workerMap = new Map();
        for (const record of attendanceRecords) {
            const workerId = record.worker.toString();
            if (!workerMap.has(workerId)) {
                workerMap.set(workerId, []);
            }
            workerMap.get(workerId).push(record);
        }

        const generatedPayrolls = [];

        for (const [workerId, records] of workerMap) {
            const worker =
                await workerRepository.findById(workerId, tenantId);

            if (!worker) {
                continue;
            }

            const siteId = worker.site;
            if (!siteId) {
                continue;
            }

            const site =
                await siteRepository.findActiveById(siteId, tenantId);

            if (!site) {
                continue;
            }

            const existingPayroll =
                await payrollRepository.findByWorkerAndMonth(
                    workerId,
                    attendanceMonth,
                    attendanceYear,
                    tenantId
                );

            if (existingPayroll) {
                continue;
            }

            let workingDays = 0;
            let presentDays = 0;
            let absentDays = 0;
            let halfDays = 0;
            let leaveDays = 0;
            let regularHours = 0;
            let overtimeHours = 0;

            records.forEach((attendance) => {
                workingDays++;

                switch (attendance.status) {
                    case 'PRESENT':
                        presentDays++;
                        regularHours += attendance.regularHours || 8;
                        break;

                    case 'ABSENT':
                        absentDays++;
                        break;

                    case 'HALF_DAY':
                        halfDays++;
                        regularHours += attendance.regularHours || 4;
                        break;

                    case 'LEAVE':
                        leaveDays++;
                        break;
                }

                overtimeHours += attendance.overtimeHours || 0;
            });

            const dailyWage = worker.dailyWage || 800;
            const overtimeRate = dailyWage / 8;

            const basicSalary =
                worker.salaryType === 'MONTHLY'
                    ? worker.monthlySalary || 30000
                    : dailyWage * presentDays;

            const overtimeAmount = overtimeHours * overtimeRate;
            const grossSalary = basicSalary + overtimeAmount;
            const netSalary = grossSalary;

            const tenant = worker.tenant || tenantId;

            const payroll =
                await payrollRepository.create({
                    worker: workerId,
                    site: siteId,
                    attendanceMonth,
                    attendanceYear,
                    workingDays,
                    presentDays,
                    absentDays,
                    halfDays,
                    leaveDays,
                    regularHours,
                    overtimeHours,
                    dailyWage,
                    overtimeRate,
                    basicSalary,
                    overtimeAmount,
                    bonus: 0,
                    deduction: 0,
                    advanceDeduction: 0,
                    grossSalary,
                    netSalary,
                    status: 'GENERATED',
                    tenant,
                    createdBy,
                });

            const populatedPayroll =
                await payrollRepository.findById(payroll._id, tenantId);

            generatedPayrolls.push(populatedPayroll);
        }

        return {
            count: generatedPayrolls.length,
            payrolls: generatedPayrolls,
        };
    }
    /**
     * ==========================================
     * Process Advance Payment
     * ==========================================
     */
    async processAdvancePayment(payrollId, amount, paymentMethod, transactionId, remark, createdBy, tenantId) {
        if (
            !Number.isFinite(amount) ||
            Number.isNaN(amount) ||
            amount <= 0
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                PAYROLL_MESSAGES.ADVANCE_AMOUNT_INVALID
            );
        }

        const payroll =
            await payrollRepository.findById(payrollId, tenantId);

        if (!payroll) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                PAYROLL_MESSAGES.NOT_FOUND
            );
        }

        if (payroll.status === 'PAID') {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                PAYROLL_MESSAGES.PAYROLL_ALREADY_PAID
            );
        }

        const currentBalance =
            (payroll.grossSalary || 0) -
            (payroll.deduction || 0) -
            (payroll.advanceDeduction || 0) -
            (payroll.paid || 0);

        if (currentBalance <= 0) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                PAYROLL_MESSAGES.ADVANCE_ZERO_BALANCE
            );
        }

        if (amount > currentBalance) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                PAYROLL_MESSAGES.ADVANCE_EXCEEDS_BALANCE
            );
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const worker =
                await workerRepository.findById(payroll.worker?._id || payroll.worker, tenantId);

            const tenant = worker?.tenant || tenantId;

            const paymentData = {
                        payroll: payroll._id,
                        worker: payroll.worker?._id,
                        site: payroll.site?._id,
                        amount,
                        paymentType: 'ADVANCE',
                        paymentMethod: paymentMethod || 'CASH',
                        transactionId: transactionId ? String(transactionId).trim() : '',
                        remark: remark ? String(remark).trim() : '',
                        status: 'COMPLETED',
                        tenant,
                        createdBy,
                    };

            const payment =
                await paymentRepository.create(
                    paymentData,
                    session
                );

            const newAdvanceDeduction =
                (payroll.advanceDeduction || 0) + amount;

            const newNetSalary =
                (payroll.grossSalary || 0) -
                (payroll.deduction || 0) -
                newAdvanceDeduction -
                (payroll.paid || 0);

            const updatedPayroll =
                await payrollRepository.update(
                    payroll._id,
                    {
                        advanceDeduction: newAdvanceDeduction,
                        netSalary: Math.max(0, newNetSalary),
                    },
                    tenantId,
                    session
                );

            await session.commitTransaction();

            return {
                payment,
                payroll: updatedPayroll,
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

export default new PayrollService();