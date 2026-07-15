import { StatusCodes } from 'http-status-codes';

import attendanceRepository from '../repositories/attendance.repository.js';
import workerRepository from '../repositories/worker.repository.js';
import siteRepository from '../repositories/site.repository.js';

import ApiError from '../common/errors/ApiError.js';

import ATTENDANCE_MESSAGES from '../common/constants/attendance.messages.js';

class AttendanceService {
    /**
 * ==========================================
 * Create Attendance
 * ==========================================
 */
    async createAttendance(
        attendanceData,
        createdBy
    ) {
        // Check Worker Exists
        const worker =
            await workerRepository.findById(
                attendanceData.worker
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
                attendanceData.site
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
                attendanceData.attendanceDate
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
        const attendance =
            await attendanceRepository.create({
                ...attendanceData,
                createdBy,
            });

        return await attendanceRepository.findById(
            attendance._id
        );
    }
    /**
     * ==========================================
     * Get Attendance
     * ==========================================
     */
    async getAttendance(query) {
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
            const startDate = new Date(attendanceDate);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(attendanceDate);
            endDate.setHours(23, 59, 59, 999);

            filter.attendanceDate = {
                $gte: startDate,
                $lte: endDate,
            };
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
                options
            );

        const total =
            await attendanceRepository.count(
                filter
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
    async getAttendanceById(attendanceId) {
        const attendance =
            await attendanceRepository.findById(
                attendanceId
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
        updatedBy
    ) {
        // Check Attendance Exists
        const attendance =
            await attendanceRepository.findById(
                attendanceId
            );

        if (!attendance) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ATTENDANCE_MESSAGES.NOT_FOUND
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
                    updateData.worker
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
                    updateData.site
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
                attendanceDate
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

        // Update Attendance
        const updatedAttendance =
            await attendanceRepository.update(
                attendanceId,
                {
                    ...updateData,
                    updatedBy,
                }
            );

        return updatedAttendance;
    }
    /**
     * ==========================================
     * Change Attendance Status
     * ==========================================
     */
    async changeStatus(attendanceId, status) {
        // Check Attendance Exists
        const attendance =
            await attendanceRepository.findById(
                attendanceId
            );

        if (!attendance) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ATTENDANCE_MESSAGES.NOT_FOUND
            );
        }

        // Change Status
        return await attendanceRepository.changeStatus(
            attendanceId,
            status
        );
    }
    /**
     * ==========================================
     * Delete Attendance
     * ==========================================
     */
    async deleteAttendance(attendanceId) {
        // Check Attendance Exists
        const attendance =
            await attendanceRepository.findById(
                attendanceId
            );

        if (!attendance) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ATTENDANCE_MESSAGES.NOT_FOUND
            );
        }

        // Soft Delete
        await attendanceRepository.softDelete(
            attendanceId
        );

        return {
            message:
                ATTENDANCE_MESSAGES.DELETED_SUCCESS,
        };
    }
    /**
     * ==========================================
     * Attendance Summary
     * ==========================================
     */
    async getSummary(query) {
        const filter = {
            isDeleted: false,
        };

        if (query.attendanceDate) {
            const startDate = new Date(
                query.attendanceDate
            );
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(
                query.attendanceDate
            );
            endDate.setHours(23, 59, 59, 999);

            filter.attendanceDate = {
                $gte: startDate,
                $lte: endDate,
            };
        }

        if (query.site) {
            filter.site = query.site;
        }

        const summary =
            await attendanceRepository.getSummary(
                filter
            );

        const result = {
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
                }
            );

        return history;
    }

}

export default new AttendanceService();