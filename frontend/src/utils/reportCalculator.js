import {
  calculateGrossSalary,
  calculateNetSalary,
  calculateBalance,
  calculateSalary,
  getPresentDays,
  getAbsentDays,
  getLeaveDays,
} from "./wageCalculator";

import {
  getAttendancePercentage,
} from "./attendanceCalculator";

export const getWorkerReport = (
  workers,
  attendance,
  salary
) => {

  return workers.map((worker) => {

    const salaryRecord =
      salary.find(

        (item) =>

          item.workerId === worker.id

      ) || {};

    const salaryDetails =
      calculateSalary(

        worker,

        attendance,

        salaryRecord

      );

    return {

      id: worker.id,

      name: worker.name,

      site: worker.site,

      skill: worker.skill,

      workType: worker.workType,

      wageType: worker.wageType,

      attendance:

        getAttendancePercentage(

          worker.id,

          attendance

        ),

      presentDays:

        getPresentDays(

          worker.id,

          attendance

        ),

      absentDays:

        getAbsentDays(

          worker.id,

          attendance

        ),

      leaveDays:

        getLeaveDays(

          worker.id,

          attendance

        ),

      ...salaryDetails,

    };

  });

};

export const getSalaryReport = (
  workers,
  attendance,
  salary
) => {

  return workers.map((worker) => {

    const salaryRecord =
      salary.find(

        (item) =>

          item.workerId === worker.id

      ) || {};

    const salaryDetails =
      calculateSalary(

        worker,

        attendance,

        salaryRecord

      );

    return {

      workerId: worker.id,

      workerName: worker.name,

      site: worker.site,

      workType: worker.workType,

      wageType: worker.wageType,

      attendance:

        getAttendancePercentage(

          worker.id,

          attendance

        ),

      ...salaryDetails,

    };

  });

};

export const getMonthlyExpenseReport = (
  workers,
  attendance,
  salary
) => {

  const salaryReport =
    getSalaryReport(

      workers,

      attendance,

      salary

    );

  return {

    totalWorkers:
      workers.length,

    totalGross:

      salaryReport.reduce(

        (sum, item) =>

          sum + item.grossSalary,

        0

      ),

    totalAdvance:

      salaryReport.reduce(

        (sum, item) =>

          sum + item.advance,

        0

      ),

    totalPaid:

      salaryReport.reduce(

        (sum, item) =>

          sum + item.paid,

        0

      ),

    totalBalance:

      salaryReport.reduce(

        (sum, item) =>

          sum + item.balance,

        0

      ),

  };

};

export const getDashboardReport = (
  workers,
  attendance,
  salary,
  sites
) => {

  const expense =
    getMonthlyExpenseReport(

      workers,

      attendance,

      salary

    );

  const presentToday =
    attendance.filter(

      (item) =>

        item.status === "Present"

    ).length;

  return {

    totalWorkers:

      workers.length,

    totalSites:

      sites.length,

    presentToday,

    totalGross:

      expense.totalGross,

    totalAdvance:

      expense.totalAdvance,

    totalPaid:

      expense.totalPaid,

    totalBalance:

      expense.totalBalance,

  };

};

export const getSiteReport = (
  sites,
  workers,
  attendance
) => {

  return sites.map((site) => {

    const siteWorkers =
      workers.filter(

        (worker) =>

          worker.site === site.name

      );

    const present =
      attendance.filter(

        (item) =>

          item.site === site.name &&
          item.status === "Present"

      ).length;

    const absent =
      attendance.filter(

        (item) =>

          item.site === site.name &&
          item.status === "Absent"

      ).length;

    const leave =
      attendance.filter(

        (item) =>

          item.site === site.name &&
          item.status === "Leave"

      ).length;

    const total =
      present +
      absent +
      leave;

    return {

      siteId: site.id,

      siteName: site.name,

      supervisor: site.supervisor,

      workers:
        siteWorkers.length,

      present,

      absent,

      leave,

      attendancePercentage:

        total

          ? Number(

              (
                (present / total) *
                100

              ).toFixed(2)

            )

          : 0,

    };

  });

};