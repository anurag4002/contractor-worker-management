import { StatusCodes } from 'http-status-codes';

import payrollRepository from '../repositories/payroll.repository.js';
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
        createdBy
    ) {
        // Validate Worker
        const worker =
            await workerRepository.findById(
                payrollData.worker
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
                payrollData.site
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
                payrollData.attendanceYear
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
                payrollData.attendanceYear
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
        const payroll =
            await payrollRepository.create({
                ...payrollData,

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
            payroll._id
        );
    }
    /**
     * ==========================================
     * Get Payrolls
     * ==========================================
     */
    async getPayrolls(query) {
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
                options
            );

        const total =
            await payrollRepository.count(
                filter
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
    async getPayrollById(payrollId) {
        const payroll =
            await payrollRepository.findById(
                payrollId
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
        updatedBy
    ) {
        // Check Payroll Exists
        const payroll =
            await payrollRepository.findById(
                payrollId
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
                }
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
        status
    ) {
        // Check Payroll Exists
        const payroll =
            await payrollRepository.findById(
                payrollId
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
            status
        );
    }
    /**
     * ==========================================
     * Delete Payroll
     * ==========================================
     */
    async deletePayroll(payrollId) {
        // Check Payroll Exists
        const payroll =
            await payrollRepository.findById(
                payrollId
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
            payrollId
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
        query
    ) {
        // Validate Worker
        const worker =
            await workerRepository.findById(
                workerId
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
                }
            );

        const total =
            await payrollRepository.count({
                worker: workerId,
                isDeleted: false,
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
    async getSummary(query) {
        const filter = {
            isDeleted: false,
        };

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
                filter
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
}

export default new PayrollService();