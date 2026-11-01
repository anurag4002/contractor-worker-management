import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';

import ATTENDANCE_MESSAGES from '../../src/common/constants/attendance.messages.js';
import {
  getCalendarDateKey,
  getTodayDateKey,
} from '../../src/common/utils/attendanceDate.util.js';

import attendanceRepository from '../../src/repositories/attendance.repository.js';
import workerRepository from '../../src/repositories/worker.repository.js';
import siteRepository from '../../src/repositories/site.repository.js';
import payrollService from '../../src/services/payroll.service.js';
import mongoose from 'mongoose';

let attendanceService;

beforeAll(async () => {
  const serviceModule = await import(
    '../../src/services/attendance.service.js'
  );
  attendanceService = serviceModule.default;
});

const tenantId = '507f1f77bcf86cd799439001';
const workerId = '507f1f77bcf86cd799439002';
const siteId = '507f1f77bcf86cd799439005';
const createdBy = '507f1f77bcf86cd799439004';
const attendanceId = '507f1f77bcf86cd799439006';

const createMockSession = () => ({
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
});

const buildAttendance = (dateKey) => ({
  _id: attendanceId,
  worker: { _id: workerId },
  site: { _id: siteId },
  attendanceDate: dateKey
    ? new Date(`${dateKey}T00:00:00+05:30`)
    : null,
  status: 'PRESENT',
  checkIn: null,
  checkOut: null,
  isDeleted: false,
});

beforeEach(() => {
  jest.clearAllMocks();

  mongoose.startSession = jest.fn().mockResolvedValue(createMockSession());

  attendanceRepository.findById = jest.fn();
  attendanceRepository.findByWorkerAndDate = jest.fn();
  attendanceRepository.create = jest.fn();
  attendanceRepository.update = jest.fn();
  attendanceRepository.softDelete = jest.fn();

  workerRepository.findById = jest.fn();
  workerRepository.count = jest.fn();

  siteRepository.findActiveById = jest.fn();

  payrollService.recalculatePayroll = jest
    .fn()
    .mockResolvedValue({ payroll: null, action: 'NO_RECORD' });
});

describe('Attendance Service - future date protection', () => {
  it('AT-001: accepts and persists attendance for today', async () => {
    const todayKey = getTodayDateKey();

    workerRepository.findById.mockResolvedValue({
      _id: workerId,
      tenant: tenantId,
      fullName: 'Test Worker',
    });

    siteRepository.findActiveById.mockResolvedValue({
      _id: siteId,
      tenant: tenantId,
      siteName: 'Test Site',
    });

    attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);

    attendanceRepository.create.mockResolvedValue(
      buildAttendance(todayKey)
    );

    attendanceRepository.findById.mockResolvedValue(
      buildAttendance(todayKey)
    );

    const result = await attendanceService.createAttendance(
      {
        worker: workerId,
        site: siteId,
        attendanceDate: new Date(`${todayKey}T00:00:00+05:30`),
        status: 'PRESENT',
      },
      createdBy,
      tenantId
    );

    expect(result).toBeDefined();
    expect(attendanceRepository.create).toHaveBeenCalled();
    expect(
      attendanceRepository.findByWorkerAndDate
    ).toHaveBeenCalledWith(
      workerId,
      expect.anything(),
      tenantId
    );
  });

  it('AT-002: accepts and persists attendance for a past date', async () => {
    const pastDateKey = '2026-10-29';

    workerRepository.findById.mockResolvedValue({
      _id: workerId,
      tenant: tenantId,
      fullName: 'Test Worker',
    });

    siteRepository.findActiveById.mockResolvedValue({
      _id: siteId,
      tenant: tenantId,
      siteName: 'Test Site',
    });

    attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);

    attendanceRepository.create.mockResolvedValue(
      buildAttendance(pastDateKey)
    );

    attendanceRepository.findById.mockResolvedValue(
      buildAttendance(pastDateKey)
    );

    const result = await attendanceService.createAttendance(
      {
        worker: workerId,
        site: siteId,
        attendanceDate: new Date(`${pastDateKey}T00:00:00+05:30`),
        status: 'PRESENT',
      },
      createdBy,
      tenantId
    );

    expect(result).toBeDefined();
    expect(attendanceRepository.create).toHaveBeenCalled();
  });

  it('AT-003: rejects creation of attendance for tomorrow', async () => {
    const tomorrowKey = getCalendarDateKey(
      new Date(Date.now() + (24 * 60 * 60 * 1000))
    );

    await expect(
      attendanceService.createAttendance(
        {
          worker: workerId,
          site: siteId,
          attendanceDate: new Date(`${tomorrowKey}T00:00:00+05:30`),
          status: 'PRESENT',
        },
        createdBy,
        tenantId
      )
    ).rejects.toMatchObject({
      statusCode: StatusCodes.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.FUTURE_DATE_NOT_ALLOWED,
    });

    expect(attendanceRepository.create).not.toHaveBeenCalled();
  });

  it('AT-004: rejects creation of attendance several days in the future', async () => {
    const futureKey = getCalendarDateKey(
      new Date(Date.now() + (5 * 24 * 60 * 60 * 1000))
    );

    await expect(
      attendanceService.createAttendance(
        {
          worker: workerId,
          site: siteId,
          attendanceDate: new Date(`${futureKey}T00:00:00+05:30`),
          status: 'PRESENT',
        },
        createdBy,
        tenantId
      )
    ).rejects.toMatchObject({
      statusCode: StatusCodes.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.FUTURE_DATE_NOT_ALLOWED,
    });

    expect(attendanceRepository.create).not.toHaveBeenCalled();
  });

  it('AT-005: rejects updating attendance to a future date', async () => {
    const tomorrowKey = getCalendarDateKey(
      new Date(Date.now() + (24 * 60 * 60 * 1000))
    );

    attendanceRepository.findById.mockResolvedValue(
      buildAttendance('2026-10-29')
    );

    await expect(
      attendanceService.updateAttendance(
        attendanceId,
        { attendanceDate: new Date(`${tomorrowKey}T00:00:00+05:30`) },
        createdBy,
        tenantId
      )
    ).rejects.toMatchObject({
      statusCode: StatusCodes.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.FUTURE_DATE_NOT_ALLOWED,
    });

    expect(attendanceRepository.update).not.toHaveBeenCalled();
  });

  it('AT-006: allows updating attendance to a past date', async () => {
    const pastDateKey = '2026-10-29';

    attendanceRepository.findById.mockResolvedValue(
      buildAttendance(pastDateKey)
    );

    attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);

    attendanceRepository.update.mockResolvedValue(
      buildAttendance(pastDateKey)
    );

    const result = await attendanceService.updateAttendance(
      attendanceId,
      { attendanceDate: new Date(`${pastDateKey}T00:00:00+05:30`) },
      createdBy,
      tenantId
    );

    expect(result).toBeDefined();
    expect(attendanceRepository.update).toHaveBeenCalled();
  });

  it('AT-007: rejects duplicate attendance on the same calendar date', async () => {
    const todayKey = getTodayDateKey();

    workerRepository.findById.mockResolvedValue({
      _id: workerId,
      tenant: tenantId,
      fullName: 'Test Worker',
    });

    siteRepository.findActiveById.mockResolvedValue({
      _id: siteId,
      tenant: tenantId,
      siteName: 'Test Site',
    });

    attendanceRepository.findByWorkerAndDate.mockResolvedValue({
      _id: 'another-attendance-id',
      status: 'PRESENT',
    });

    await expect(
      attendanceService.createAttendance(
        {
          worker: workerId,
          site: siteId,
          attendanceDate: new Date(`${todayKey}T00:00:00+05:30`),
          status: 'PRESENT',
        },
        createdBy,
        tenantId
      )
    ).rejects.toMatchObject({
      statusCode: StatusCodes.CONFLICT,
      message: ATTENDANCE_MESSAGES.ALREADY_MARKED,
    });
  });

  it('AT-008: keeps today valid and rejects tomorrow at the timezone boundary', async () => {
    const tomorrowKey = getCalendarDateKey(
      new Date(Date.now() + (24 * 60 * 60 * 1000))
    );

    await expect(
      attendanceService.createAttendance(
        {
          worker: workerId,
          site: siteId,
          attendanceDate: new Date(`${tomorrowKey}T00:00:00+05:30`),
          status: 'PRESENT',
        },
        createdBy,
        tenantId
      )
    ).rejects.toMatchObject({
      statusCode: StatusCodes.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.FUTURE_DATE_NOT_ALLOWED,
    });

    // Today must remain a valid attendance date.
    workerRepository.findById.mockResolvedValue({
      _id: workerId,
      tenant: tenantId,
      fullName: 'Test Worker',
    });

    siteRepository.findActiveById.mockResolvedValue({
      _id: siteId,
      tenant: tenantId,
      siteName: 'Test Site',
    });

    attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);

    attendanceRepository.create.mockResolvedValue(
      buildAttendance(getTodayDateKey())
    );

    attendanceRepository.findById.mockResolvedValue(
      buildAttendance(getTodayDateKey())
    );

    await expect(
      attendanceService.createAttendance(
        {
          worker: workerId,
          site: siteId,
          attendanceDate: new Date(
            `${getTodayDateKey()}T00:00:00+05:30`
          ),
          status: 'PRESENT',
        },
        createdBy,
        tenantId
      )
    ).resolves.toBeDefined();
  });

  it('AT-009: rejects create and update when the attendance date is absent or invalid', async () => {
    await expect(
      attendanceService.createAttendance(
        {
          worker: workerId,
          site: siteId,
          status: 'PRESENT',
        },
        createdBy,
        tenantId
      )
    ).rejects.toMatchObject({
      statusCode: StatusCodes.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.INVALID_ATTENDANCE_DATE,
    });

    attendanceRepository.findById.mockResolvedValue(
      buildAttendance(null)
    );

    await expect(
      attendanceService.updateAttendance(
        attendanceId,
        {},
        createdBy,
        tenantId
      )
    ).rejects.toMatchObject({
      statusCode: StatusCodes.BAD_REQUEST,
      message: ATTENDANCE_MESSAGES.INVALID_ATTENDANCE_DATE,
    });
  });

  it('AT-010: keeps attendance validations tenant scoped', async () => {
    const todayKey = getTodayDateKey();

    workerRepository.findById.mockResolvedValue({
      _id: workerId,
      tenant: tenantId,
      fullName: 'Test Worker',
    });

    siteRepository.findActiveById.mockResolvedValue({
      _id: siteId,
      tenant: tenantId,
      siteName: 'Test Site',
    });

    attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);

    attendanceRepository.create.mockResolvedValue(
      buildAttendance(todayKey)
    );

    attendanceRepository.findById.mockResolvedValue(
      buildAttendance(todayKey)
    );

    await attendanceService.createAttendance(
      {
        worker: workerId,
        site: siteId,
        attendanceDate: new Date(`${todayKey}T00:00:00+05:30`),
        status: 'PRESENT',
      },
      createdBy,
      tenantId
    );

    expect(attendanceRepository.findByWorkerAndDate).toHaveBeenCalledWith(
      workerId,
      expect.anything(),
      tenantId
    );
  });
});
