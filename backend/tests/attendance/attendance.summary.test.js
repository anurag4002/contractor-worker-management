import { jest } from '@jest/globals';

import Attendance from '../../src/models/Attendance.js';
import {
  getAttendanceDayRange,
  getCalendarDateKey,
  getTodayDateKey,
} from '../../src/common/utils/attendanceDate.util.js';

import attendanceRepository from '../../src/repositories/attendance.repository.js';
import workerRepository from '../../src/repositories/worker.repository.js';

let attendanceService;

beforeAll(async () => {
  const serviceModule = await import(
    '../../src/services/attendance.service.js'
  );
  attendanceService = serviceModule.default;
});

const tenantId = '507f1f77bcf86cd799439001';
const siteId = '507f1f77bcf86cd799439005';

beforeEach(() => {
  jest.clearAllMocks();

  attendanceRepository.getSummary = jest.fn();
  workerRepository.count = jest.fn();
});

describe('Attendance Service - getSummary (today only)', () => {
  it('AS-001: counts a single PRESENT worker today', async () => {
    attendanceRepository.getSummary.mockResolvedValue([
      { _id: 'PRESENT', count: 1 },
    ]);
    workerRepository.count.mockResolvedValue(1);

    const result = await attendanceService.getSummary(
      { attendanceDate: getTodayDateKey() },
      tenantId
    );

    expect(attendanceRepository.getSummary).toHaveBeenCalled();
    expect(result).toEqual({
      totalWorkers: 1,
      total: 1,
      present: 1,
      absent: 0,
      halfDay: 0,
      leave: 0,
      holiday: 0,
    });
  });

  it('AS-002: counts only today attendance and not historical records', async () => {
    const todayKey = getTodayDateKey();

    attendanceRepository.getSummary.mockResolvedValue([
      { _id: 'PRESENT', count: 1 },
    ]);
    workerRepository.count.mockResolvedValue(1);

    const result = await attendanceService.getSummary(
      { attendanceDate: todayKey },
      tenantId
    );

    expect(attendanceRepository.getSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        attendanceDate: expect.objectContaining({
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        }),
      }),
      tenantId
    );

    expect(result.present).toBe(1);
  });

  it('AS-003: defaults the summary to today when no date is supplied', async () => {
    attendanceRepository.getSummary.mockResolvedValue([
      { _id: 'PRESENT', count: 0 },
    ]);
    workerRepository.count.mockResolvedValue(0);

    const result = await attendanceService.getSummary({}, tenantId);

    expect(attendanceRepository.getSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        isDeleted: false,
        tenant: tenantId,
        attendanceDate: expect.objectContaining({
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        }),
      }),
      tenantId
    );

    expect(result.total).toBe(0);
  });

  it('AS-004: aggregates present count for multiple workers today', async () => {
    attendanceRepository.getSummary.mockResolvedValue([
      { _id: 'PRESENT', count: 3 },
    ]);
    workerRepository.count.mockResolvedValue(3);

    const result = await attendanceService.getSummary(
      { attendanceDate: getTodayDateKey() },
      tenantId
    );

    expect(result.present).toBe(3);
    expect(result.total).toBe(3);
  });

  it('AS-005: counts each status correctly for today', async () => {
    attendanceRepository.getSummary.mockResolvedValue([
      { _id: 'PRESENT', count: 1 },
      { _id: 'ABSENT', count: 1 },
      { _id: 'HALF_DAY', count: 1 },
      { _id: 'LEAVE', count: 1 },
      { _id: 'HOLIDAY', count: 1 },
    ]);
    workerRepository.count.mockResolvedValue(5);

    const result = await attendanceService.getSummary(
      { attendanceDate: getTodayDateKey() },
      tenantId
    );

    expect(result.total).toBe(5);
    expect(result.present).toBe(1);
    expect(result.absent).toBe(1);
    expect(result.halfDay).toBe(1);
    expect(result.leave).toBe(1);
    expect(result.holiday).toBe(1);
  });

  it('AS-006: groups attendance by status and worker before counting', async () => {
    delete attendanceRepository.getSummary;
    Attendance.aggregate = jest.fn().mockResolvedValue([]);

    attendanceRepository.getSummary(
      {
        isDeleted: false,
        tenant: tenantId,
        attendanceDate: {
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        },
      },
      tenantId
    );

    expect(Attendance.aggregate).toHaveBeenCalled();

    const pipeline = Attendance.aggregate.mock.calls[0][0];

    expect(pipeline).toHaveLength(3);
    expect(pipeline[0].$match).toBeDefined();
    expect(pipeline[1].$group._id).toEqual({
      status: '$status',
      worker: '$worker',
    });
    expect(pipeline[2].$group._id).toBe('$_id.status');
  });

  it('AS-007: applies site filter to today summary', async () => {
    attendanceRepository.getSummary.mockResolvedValue([
      { _id: 'PRESENT', count: 1 },
    ]);
    workerRepository.count.mockResolvedValue(1);

    const result = await attendanceService.getSummary(
      { attendanceDate: getTodayDateKey(), site: siteId },
      tenantId
    );

    expect(attendanceRepository.getSummary).toHaveBeenCalledWith(
      expect.objectContaining({ site: siteId }),
      tenantId
    );

    expect(result.present).toBe(1);
  });

  it('AS-008: keeps summary tenant scoped', async () => {
    attendanceRepository.getSummary.mockResolvedValue([]);
    workerRepository.count.mockResolvedValue(0);

    await attendanceService.getSummary(
      { attendanceDate: getTodayDateKey() },
      tenantId
    );

    expect(attendanceRepository.getSummary).toHaveBeenCalledWith(
      expect.objectContaining({ tenant: tenantId }),
      tenantId
    );
  });

  it('AS-009: uses complete business day boundaries for today', async () => {
    const todayKey = getTodayDateKey();
    const { startDate, endDate } = getAttendanceDayRange(todayKey);

    expect(startDate).toBeInstanceOf(Date);
    expect(endDate).toBeInstanceOf(Date);

    const expectedStart = new Date(`${todayKey}T00:00:00+05:30`);
    expect(startDate.getTime()).toBe(expectedStart.getTime());

    const expectedEnd = startDate.getTime() + (24 * 60 * 60 * 1000) - 1;
    expect(endDate.getTime()).toBe(expectedEnd);

    // The business day is contiguous: the end of one day is one millisecond
    // before the start of the next day.
    const yesterdayKey = getCalendarDateKey(
      new Date(Date.now() - (24 * 60 * 60 * 1000))
    );
    const { startDate: todayStart } = getAttendanceDayRange(todayKey);
    const { endDate: yesterdayEnd } = getAttendanceDayRange(
      yesterdayKey
    );
    expect(yesterdayEnd.getTime() + 1).toBe(
      todayStart.getTime()
    );
  });

  it('AS-010: historical date filter selects that date summary, not today', async () => {
    attendanceRepository.getSummary.mockResolvedValue([
      { _id: 'ABSENT', count: 2 },
    ]);
    workerRepository.count.mockResolvedValue(2);

    const result = await attendanceService.getSummary(
      { attendanceDate: '2026-10-29' },
      tenantId
    );

    expect(attendanceRepository.getSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        attendanceDate: expect.objectContaining({
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        }),
      }),
      tenantId
    );

    // The summary reflects the requested (historical) date, not today.
    expect(result.absent).toBe(2);
  });

  it('AS-011: today summary reflects today records only via date scoped aggregation', async () => {
    const todayKey = getTodayDateKey();

    attendanceRepository.getSummary.mockResolvedValue([
      { _id: 'PRESENT', count: 1 },
    ]);
    workerRepository.count.mockResolvedValue(1);

    const result = await attendanceService.getSummary(
      { attendanceDate: todayKey },
      tenantId
    );

    const filter = attendanceRepository.getSummary.mock.calls[0][0];
    const { startDate, endDate } = getAttendanceDayRange(todayKey);

    expect(filter.attendanceDate.$gte.getTime()).toBe(
      startDate.getTime()
    );
    expect(filter.attendanceDate.$lte.getTime()).toBe(
      endDate.getTime()
    );

    // Historical records (before start of today) are excluded.
    expect(filter.attendanceDate.$gte.getTime()).toBe(
      new Date(`${todayKey}T00:00:00+05:30`).getTime()
    );

    expect(result.present).toBe(1);
  });
});
