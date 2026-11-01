import {
  createAttendanceSchema,
  updateAttendanceSchema,
} from '../../src/validators/attendance.validator.js';
import {
  getCalendarDateKey,
  getTodayDateKey,
} from '../../src/common/utils/attendanceDate.util.js';

const FUTURE_ATTENDANCE_MESSAGE =
  'Future attendance cannot be marked. Please select today or a past date.';

describe('Attendance Validator - future date protection', () => {
  it('AT-003: rejects create attendance for tomorrow', async () => {
    const tomorrowKey = getCalendarDateKey(
      new Date(Date.now() + (24 * 60 * 60 * 1000))
    );

    const { error } = await createAttendanceSchema.validate({
      worker: '507f1f77bcf86cd799439002',
      site: '507f1f77bcf86cd799439005',
      attendanceDate: new Date(`${tomorrowKey}T00:00:00+05:30`),
      status: 'PRESENT',
    });

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(
      FUTURE_ATTENDANCE_MESSAGE
    );
  });

  it('AT-004: rejects create attendance several days in the future', async () => {
    const futureKey = getCalendarDateKey(
      new Date(Date.now() + (5 * 24 * 60 * 60 * 1000))
    );

    const { error } = await createAttendanceSchema.validate({
      worker: '507f1f77bcf86cd799439002',
      site: '507f1f77bcf86cd799439005',
      attendanceDate: new Date(`${futureKey}T00:00:00+05:30`),
      status: 'PRESENT',
    });

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(
      FUTURE_ATTENDANCE_MESSAGE
    );
  });

  it('AT-005: rejects update attendance to a future date', async () => {
    const tomorrowKey = getCalendarDateKey(
      new Date(Date.now() + (24 * 60 * 60 * 1000))
    );

    const { error } = await updateAttendanceSchema.validate({
      attendanceDate: new Date(`${tomorrowKey}T00:00:00+05:30`),
      status: 'PRESENT',
    });

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(
      FUTURE_ATTENDANCE_MESSAGE
    );
  });

  it('AT-001: accepts create attendance for today', async () => {
    const { error } = await createAttendanceSchema.validate({
      worker: '507f1f77bcf86cd799439002',
      site: '507f1f77bcf86cd799439005',
      attendanceDate: new Date(`${getTodayDateKey()}T00:00:00+05:30`),
      status: 'PRESENT',
    });

    expect(error).toBeUndefined();
  });

  it('AT-002: accepts create attendance for a past date', async () => {
    const { error } = await createAttendanceSchema.validate({
      worker: '507f1f77bcf86cd799439002',
      site: '507f1f77bcf86cd799439005',
      attendanceDate: new Date('2026-10-29T00:00:00+05:30'),
      status: 'PRESENT',
    });

    expect(error).toBeUndefined();
  });
});
