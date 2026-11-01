/**
 * ==========================================
 * Attendance Calendar Date Helpers
 * ==========================================
 * Attendance represents a calendar day (YYYY-MM-DD) and NOT an
 * arbitrary timestamp. All attendance date comparisons (today,
 * future-date rejection, duplicate checks, day ranges) must therefore
 * be performed against the calendar date in the configured business
 * timezone instead of relying on raw UTC/local timestamp arithmetic.
 */

export const BUSINESS_TIMEZONE = 'Asia/Kolkata';

const calendarDateFormatter = new Intl.DateTimeFormat(
  'en-CA',
  {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
);

/**
 * Converts any date-like value into a calendar date key
 * (YYYY-MM-DD) expressed in the business timezone.
 *
 * Returns null when the value is missing or invalid.
 */
export const getCalendarDateKey = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = calendarDateFormatter.formatToParts(date);
  const getPart = (type) =>
    parts.find((part) => part.type === type)?.value ?? '0';

  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');

  return `${year}-${month}-${day}`;
};

/**
 * Returns today's calendar date key (YYYY-MM-DD) in the
 * business timezone.
 */
export const getTodayDateKey = () =>
  getCalendarDateKey(new Date());

/**
 * Compares two calendar date keys (YYYY-MM-DD) and reports whether
 * the provided date lies in the future relative to the given (or
 * current) calendar date.
 */
export const isFutureDateKey = (
  dateKey,
  todayKey = getTodayDateKey()
) => {
  if (!dateKey) {
    return false;
  }

  const today =
    todayKey || getTodayDateKey();

  return String(dateKey) > String(today);
};

/**
 * Returns the start (00:00:00.000) of the calendar day for the
 * provided date in the business timezone.
 */
export const getAttendanceDayStart = (value) => {
  const dateKey = getCalendarDateKey(value);

  if (!dateKey) {
    return null;
  }

  return new Date(
    `${dateKey}T00:00:00+05:30`
  );
};

/**
 * Returns the end (23:59:59.999) of the calendar day for the
 * provided date in the business timezone.
 */
export const getAttendanceDayEnd = (value) => {
  const startDate = getAttendanceDayStart(value);

  if (!startDate) {
    return null;
  }

  return new Date(
    startDate.getTime() + (24 * 60 * 60 * 1000) - 1
  );
};

/**
 * Returns the inclusive [start, end] range (in milliseconds since
 * epoch, both Date instances) of the attendance calendar day for
 * the provided date in the business timezone.
 */
export const getAttendanceDayRange = (value) => {
  const startDate = getAttendanceDayStart(value);
  const endDate = getAttendanceDayEnd(value);

  return {
    startDate,
    endDate,
  };
};
