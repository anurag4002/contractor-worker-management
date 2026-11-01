import { StatusCodes } from 'http-status-codes';

import mongoose from 'mongoose';

import attendanceRepository from '../repositories/attendance.repository.js';
import workerRepository from '../repositories/worker.repository.js';
import siteRepository from '../repositories/site.repository.js';
import payrollService from '../services/payroll.service.js';

import ApiError from '../common/errors/ApiError.js';

import ATTENDANCE_MESSAGES from '../common/constants/attendance.messages.js';

import {
    getCalendarDateKey,
    getTodayDateKey,
    isFutureDateKey,
    getAttendanceDayRange,
} from '../common/utils/attendanceDate.util.js';

class AttendanceService {
    /**
 * ==========================================
 * Create Attendance
 * ==========================================
 */
    async createAttendance(
        attendanceData,
        createdBy,
        tenantId
    ) {
        // Validate Attendance Date (calendar day in business timezone).
        // Attendance can only be marked for today or any past date.
        const attendanceDateKey =
            getCalendarDateKey(
                attendanceData?.attendanceDate
            );

        if (!attendanceDateKey) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                ATTENDANCE_MESSAGES.INVALID_ATTENDANCE_DATE
            );
        }

        if (
            isFutureDateKey(
                attendanceDateKey,
                getTodayDateKey()
            )
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                ATTENDANCE_MESSAGES.FUTURE_DATE_NOT_ALLOWED
            );
        }

        // Check Worker Exists
        const worker =
            await workerRepository.findById(
                attendanceData.worker,
                tenantId
            );

        if (!worker) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ATTENDANCE_MESSAGES.WORKER_NOT_FOUND
            );
        }

        // Check Site Exists
        const site =
            await siteRepository.findActiveById(
                attendanceData.site,
                tenantId
            );

        if (!site) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ATTENDANCE_MESSAGES.SITE_NOT_FOUND
            );
        }

        // Check Duplicate Attendance
        const existingAttendance =
            await attendanceRepository.findByWorkerAndDate(
                attendanceData.worker,
                attendanceData.attendanceDate,
                tenantId
            );

        if (existingAttendance) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                ATTENDANCE_MESSAGES.ALREADY_MARKED
            );
        }

        // Validate Check-In & Check-Out
        if (
            attendanceData.checkIn &&
            attendanceData.checkOut &&
            new Date(attendanceData.checkOut) <=
            new Date(attendanceData.checkIn)
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                ATTENDANCE_MESSAGES.INVALID_CHECKOUT_TIME
            );
        }

        // Create Attendance
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const tenant = worker.tenant || tenantId;
            const attendance =
                await attendanceRepository.create(
                    {
                        ...attendanceData,
                        tenant,
                        createdBy,
                    },
                    session
                );

            // Recalculate the affected worker's payroll if one exists
            await this.recalcPayrollForWorkerMonth(
                attendanceData.worker,
                attendance.attendanceDate,
                tenantId,
                session,
                createdBy
            );

            await session.commitTransaction();

            return await attendanceRepository.findById(
                attendance._id,
                tenantId
            );
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * ==========================================
     * Recalculate Payroll For Worker Month
     * ==========================================
     * Recalculates the existing payroll record for a worker and month/year
     * after an attendance mutation. Never auto-creates a payroll record.
     * Throws when a fully paid payroll would be affected so the caller can
     * handle the error explicitly instead of silently leaving payroll
     * inconsistent.
     * ==========================================
     */
    async recalcPayrollForWorkerMonth(
        workerId,
        attendanceDate,
        tenantId,
        session,
        updatedBy
    ) {
        const attendanceDateKey =
            getCalendarDateKey(attendanceDate);

        const attendanceMonth = attendanceDateKey
            ? Number(attendanceDateKey.split('-')[1])
            : new Date(attendanceDate).getMonth() + 1;

        const attendanceYear = attendanceDateKey
            ? Number(attendanceDateKey.split('-')[0])
            : new Date(attendanceDate).getFullYear();

        return await payrollService.recalculatePayroll(
            attendanceMonth,
            attendanceYear,
            workerId,
            tenantId,
            updatedBy,
            session
        );
    }
    /**
     * ==========================================
     * Get Attendance
     * ==========================================
     */
    async getAttendance(query, tenantId) {
        const {
            page = 1,
            limit = 10,
            search = '',
            worker,
            site,
            attendanceDate,
            status,
            sortBy = 'attendanceDate',
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

        // Attendance Date Filter
        if (attendanceDate) {
            const { startDate, endDate } = getAttendanceDayRange(
                attendanceDate
            );

            if (startDate && endDate) {
                filter.attendanceDate = {
                    $gte: startDate,
                    $lte: endDate,
                };
            }
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

        const attendance =
            await attendanceRepository.findAll(
                filter,
                options,
                tenantId
            );

        const total =
            await attendanceRepository.count(
                filter,
                tenantId
            );

        return {
            attendance,
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
     * Get Attendance By Id
     * ==========================================
     */
    async getAttendanceById(attendanceId, tenantId) {
        const attendance =
            await attendanceRepository.findById(
                attendanceId,
                tenantId
            );

        if (!attendance) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ATTENDANCE_MESSAGES.NOT_FOUND
            );
        }

        return attendance;
    }
    /**
     * ==========================================
     * Update Attendance
     * ==========================================
     */
    async updateAttendance(
        attendanceId,
        updateData,
        updatedBy,
        tenantId
    ) {
        // Check Attendance Exists
        const attendance =
            await attendanceRepository.findById(
                attendanceId,
                tenantId
            );

        if (!attendance) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ATTENDANCE_MESSAGES.NOT_FOUND
            );
        }

        // Retain old worker and date for recalculation when they change
        const oldWorkerId = attendance.worker._id.toString();
        const oldAttendanceDate = new Date(attendance.attendanceDate);
        const oldAttendanceDateKey = getCalendarDateKey(
            oldAttendanceDate
        );

        // Validate Attendance Date (calendar day in business timezone).
        // Attendance can only be marked for today or any past date.
        const effectiveAttendanceDate =
            updateData?.attendanceDate || attendance.attendanceDate;

        const effectiveAttendanceDateKey =
            getCalendarDateKey(
                effectiveAttendanceDate
            );

        if (!effectiveAttendanceDateKey) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                ATTENDANCE_MESSAGES.INVALID_ATTENDANCE_DATE
            );
        }

        if (
            isFutureDateKey(
                effectiveAttendanceDateKey,
                getTodayDateKey()
            )
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                ATTENDANCE_MESSAGES.FUTURE_DATE_NOT_ALLOWED
            );
        }

        // Validate Worker
        if (
            updateData.worker &&
            updateData.worker !==
            attendance.worker._id.toString()
        ) {
            const worker =
                await workerRepository.findById(
                    updateData.worker,
                    tenantId
                );

            if (!worker) {
                throw new ApiError(
                    StatusCodes.NOT_FOUND,
                    ATTENDANCE_MESSAGES.WORKER_NOT_FOUND
                );
            }
        }

        // Validate Site
        if (
            updateData.site &&
            updateData.site !==
            attendance.site._id.toString()
        ) {
            const site =
                await siteRepository.findActiveById(
                    updateData.site,
                    tenantId
                );

            if (!site) {
                throw new ApiError(
                    StatusCodes.NOT_FOUND,
                    ATTENDANCE_MESSAGES.SITE_NOT_FOUND
                );
            }
        }

        // Prevent Duplicate Attendance
        const workerId =
            updateData.worker ||
            attendance.worker._id.toString();

        const attendanceDate =
            updateData.attendanceDate ||
            attendance.attendanceDate;

        const existingAttendance =
            await attendanceRepository.findByWorkerAndDate(
                workerId,
                attendanceDate,
                tenantId
            );

        if (
            existingAttendance &&
            existingAttendance._id.toString() !==
            attendanceId
        ) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                ATTENDANCE_MESSAGES.ALREADY_MARKED
            );
        }

        // Validate Check-In & Check-Out
        const checkIn =
            updateData.checkIn ||
            attendance.checkIn;

        const checkOut =
            updateData.checkOut ||
            attendance.checkOut;

        if (
            checkIn &&
            checkOut &&
            new Date(checkOut) <=
            new Date(checkIn)
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                ATTENDANCE_MESSAGES.INVALID_CHECKOUT_TIME
            );
        }

        // Update Attendance inside a transaction so payroll recalculation is
        // atomic with the attendance change.
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const updatedAttendance =
                await attendanceRepository.update(
                    attendanceId,
                    {
                        ...updateData,
                        updatedBy,
                    },
                    tenantId,
                    session
                );

            const newWorkerId =
                updateData.worker || oldWorkerId;

            const newAttendanceDate = new Date(
                `${effectiveAttendanceDateKey}T00:00:00+05:30`
            );

            const newAttendanceYear = Number(
                effectiveAttendanceDateKey.split('-')[0]
            );

            const newAttendanceMonth = Number(
                effectiveAttendanceDateKey.split('-')[1]
            );

            // Recalculate the new worker/month payroll if it exists
            await this.recalcPayrollForWorkerMonth(
                newWorkerId,
                newAttendanceDate,
                tenantId,
                session,
                updatedBy
            );

            // Recalculate the previous worker/month payroll if worker or
            // month changed
            const monthChanged =
                newAttendanceYear !== Number(
                    oldAttendanceDateKey?.split('-')[0]
                ) ||
                newAttendanceMonth !== Number(
                    oldAttendanceDateKey?.split('-')[1]
                );

            if (
                newWorkerId !== oldWorkerId ||
                monthChanged
            ) {
                await this.recalcPayrollForWorkerMonth(
                    oldWorkerId,
                    oldAttendanceDate,
                    tenantId,
                    session,
                    updatedBy
                );
            }

            await session.commitTransaction();

            return updatedAttendance;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
    /**
     * ==========================================
     * Change Attendance Status
     * ==========================================
     */
    async changeStatus(attendanceId, status, tenantId) {
        // Check Attendance Exists
        const attendance =
            await attendanceRepository.findById(
                attendanceId,
                tenantId
            );

        if (!attendance) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ATTENDANCE_MESSAGES.NOT_FOUND
            );
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const updatedAttendance =
                await attendanceRepository.changeStatus(
                    attendanceId,
                    status,
                    tenantId,
                    session
                );

            // Recalculate the affected worker's payroll if one exists
            await this.recalcPayrollForWorkerMonth(
                attendance.worker._id.toString(),
                attendance.attendanceDate,
                tenantId,
                session,
                null
            );

            await session.commitTransaction();

            return updatedAttendance;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
    /**
     * ==========================================
     * Delete Attendance
     * ==========================================
     */
    async deleteAttendance(attendanceId, tenantId) {
        // Check Attendance Exists
        const attendance =
            await attendanceRepository.findById(
                attendanceId,
                tenantId
            );

        if (!attendance) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ATTENDANCE_MESSAGES.NOT_FOUND
            );
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            await attendanceRepository.softDelete(
                attendanceId,
                tenantId,
                session
            );

            // Recalculate the affected worker's payroll from the remaining
            // valid attendance records, if a payroll exists
            await this.recalcPayrollForWorkerMonth(
                attendance.worker._id.toString(),
                attendance.attendanceDate,
                tenantId,
                session,
                null
            );

            await session.commitTransaction();

            return {
                message:
                    ATTENDANCE_MESSAGES.DELETED_SUCCESS,
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
    /**
     * ==========================================
     * Attendance Summary
     * ==========================================
     */
    async getSummary(query, tenantId) {
        const filter = {
            isDeleted: false,
        };

        if (tenantId) {
            filter.tenant = tenantId;
        }

        if (query.attendanceDate) {
            const { startDate, endDate } = getAttendanceDayRange(
                query.attendanceDate
            );

            if (startDate && endDate) {
                filter.attendanceDate = {
                    $gte: startDate,
                    $lte: endDate,
                };
            }
        }

        if (query.site) {
            filter.site = query.site;
        }

        const summary =
            await attendanceRepository.getSummary(
                filter,
                tenantId
            );

        const totalWorkers =
            await workerRepository.count(
                {
                    isDeleted: false,
                },
                tenantId
            );

        const result = {
            totalWorkers,
            total: 0,
            present: 0,
            absent: 0,
            halfDay: 0,
            leave: 0,
            holiday: 0,
        };

        summary.forEach((item) => {
            result.total += item.count;

            switch (item._id) {
                case 'PRESENT':
                    result.present = item.count;
                    break;

                case 'ABSENT':
                    result.absent = item.count;
                    break;

                case 'HALF_DAY':
                    result.halfDay = item.count;
                    break;

                case 'LEAVE':
                    result.leave = item.count;
                    break;

                case 'HOLIDAY':
                    result.holiday = item.count;
                    break;
            }
        });

        return result;
    }
    /**
     * ==========================================
     * Get Worker Attendance History
     * ==========================================
     */
    async getWorkerHistory(
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
                ATTENDANCE_MESSAGES.WORKER_NOT_FOUND
            );
        }

        const page =
            Number(query.page) || 1;

        const limit =
            Number(query.limit) || 10;

        const skip = (page - 1) * limit;

        const history =
            await attendanceRepository.findWorkerHistory(
                workerId,
                {
                    skip,
                    limit,
                },
                tenantId
            );

        return history;
    }

}

export default new AttendanceService();