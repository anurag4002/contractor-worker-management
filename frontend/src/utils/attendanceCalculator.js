export const getLatestAttendanceDate = (
  attendance
) => {

  if (!attendance.length) {

    return null;

  }

  return attendance
    .map((item) => item.date)
    .sort()
    .pop();

};

export const getTodayAttendance = (
  attendance,
  date
) => {

  const targetDate =
    date ||
    getLatestAttendanceDate(
      attendance
    );

  return attendance.filter(

    (item) =>

      item.date === targetDate

  );

};

export const getPresentWorkers = (
  attendance,
  date
) => {

  const targetDate =
    date ||
    getLatestAttendanceDate(
      attendance
    );

  return attendance.filter(

    (item) =>

      item.date === targetDate &&
      item.status === "Present"

  );

};

export const getAbsentWorkers = (
  attendance,
  date
) => {

  const targetDate =
    date ||
    getLatestAttendanceDate(
      attendance
    );

  return attendance.filter(

    (item) =>

      item.date === targetDate &&
      item.status === "Absent"

  );

};

export const getLeaveWorkers = (
  attendance,
  date
) => {

  const targetDate =
    date ||
    getLatestAttendanceDate(
      attendance
    );

  return attendance.filter(

    (item) =>

      item.date === targetDate &&
      item.status === "Leave"

  );

};

export const getAttendanceByWorker = (
  workerId,
  attendance
) => {

  return attendance.filter(

    (item) =>

      item.workerId === workerId

  );

};

export const getAttendanceBySite = (
  site,
  attendance
) => {

  return attendance.filter(

    (item) =>

      item.site === site

  );

};

export const getMonthlyAttendance = (
  attendance,
  month
) => {

  if (!month) {

    return attendance;

  }

  return attendance.filter(

    (item) =>

      item.date.startsWith(month)

  );

};

export const getAttendancePercentage = (
  workerId,
  attendance
) => {

  const records =
    getAttendanceByWorker(
      workerId,
      attendance
    );

  if (!records.length) {

    return 0;

  }

  const present =
    records.filter(

      (item) =>

        item.status === "Present"

    ).length;

  return Number(

    (
      (present /
        records.length) *
      100
    ).toFixed(2)

  );

};

export const getAttendanceSummary = (
  workers,
  attendance
) => {

  const latestDate =
    getLatestAttendanceDate(
      attendance
    );

  const todayAttendance =
    getTodayAttendance(
      attendance,
      latestDate
    );

  const present =
    getPresentWorkers(
      attendance,
      latestDate
    ).length;

  const absent =
    getAbsentWorkers(
      attendance,
      latestDate
    ).length;

  const leave =
    getLeaveWorkers(
      attendance,
      latestDate
    ).length;

  return {

    totalWorkers:
      workers.length,

    present,

    absent,

    leave,

    latestDate,

    attendancePercentage:

      workers.length

        ? Number(

            (
              (present /
                workers.length) *
              100
            ).toFixed(2)

          )

        : 0,

    todayAttendance,

  };

};

export const getSiteAttendanceSummary = (
  sites,
  attendance
) => {

  return sites.map((site) => {

    const records =
      getAttendanceBySite(
        site.name,
        attendance
      );

    const present =
      records.filter(

        (item) =>

          item.status === "Present"

      ).length;

    const absent =
      records.filter(

        (item) =>

          item.status === "Absent"

      ).length;

    const leave =
      records.filter(

        (item) =>

          item.status === "Leave"

      ).length;

    return {

      siteId: site.id,

      siteName: site.name,

      totalRecords:
        records.length,

      present,

      absent,

      leave,

      attendancePercentage:

        records.length

          ? Number(

              (
                (present /
                  records.length) *
                100
              ).toFixed(2)

            )

          : 0,

    };

  });

};