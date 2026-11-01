/**
 * ==========================================
 * Attendance Calendar Date Helpers
 * ==========================================
 * Attendance represents a calendar day (YYYY-MM-DD) and NOT an
 * arbitrary timestamp. All attendance date handling (default date,
 * max selectable date, future-date validation, display) must use the
 * same calendar-date logic in the configured business timezone.
 */

export const BUSINESS_TIMEZONE = 'Asia/Kolkata';

const calendarDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: BUSINESS_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const getCalendarDateKey = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

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

export const getTodayDateKey = () =>
  getCalendarDateKey(new Date());

export const getCurrentMonthKey = () => {
  const todayKey = getTodayDateKey();

  if (!todayKey) {
    return "";
  }

  const [year, month] = todayKey.split("-");

  return `${year}-${month}`;
};

export const isFutureAttendanceDate = (
  value,
  todayKey = getTodayDateKey()
) => {
  const dateKey = getCalendarDateKey(value);

  if (!dateKey) {
    return false;
  }

  const today = todayKey || getTodayDateKey();

  return String(dateKey) > String(today);
};

export const formatAttendanceDate = (value) => {
  const dateKey = getCalendarDateKey(value);

  if (!dateKey) {
    return '-';
  }

  const [day, month, year] = dateKey.split('-');

  return `${day}/${month}/${year}`;
};
