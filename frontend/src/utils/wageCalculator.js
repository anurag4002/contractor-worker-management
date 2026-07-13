export const getPresentDays = (
  workerId,
  attendance
) => {

  return attendance.filter(

    (item) =>

      item.workerId === workerId &&
      item.status === "Present"

  ).length;

};

export const getAbsentDays = (
  workerId,
  attendance
) => {

  return attendance.filter(

    (item) =>

      item.workerId === workerId &&
      item.status === "Absent"

  ).length;

};

export const getLeaveDays = (
  workerId,
  attendance
) => {

  return attendance.filter(

    (item) =>

      item.workerId === workerId &&
      item.status === "Leave"

  ).length;

};

export const calculateGrossSalary = (
  worker,
  attendance
) => {

  const presentDays =
    getPresentDays(
      worker.id,
      attendance
    );

  if (worker.wageType === "Monthly") {

    return Number(
      worker.monthlySalary || 0
    );

  }

  return (
    presentDays *
    Number(worker.dailyWage || 0)
  );

};

export const calculateNetSalary = (
  worker,
  attendance,
  salaryRecord = {}
) => {

  const grossSalary =
    calculateGrossSalary(
      worker,
      attendance
    );

  const advance =
    Number(
      salaryRecord.advance || 0
    );

  return Math.max(
    grossSalary - advance,
    0
  );

};

export const calculateBalance = (
  worker,
  attendance,
  salaryRecord = {}
) => {

  const netSalary =
    calculateNetSalary(
      worker,
      attendance,
      salaryRecord
    );

  const paid =
    Number(
      salaryRecord.paid || 0
    );

  return Math.max(
    netSalary - paid,
    0
  );

};

export const calculateSalary = (
  worker,
  attendance = [],
  salaryRecord = {}
) => {

  const presentDays =
    getPresentDays(
      worker.id,
      attendance
    );

  const grossSalary =
    calculateGrossSalary(
      worker,
      attendance
    );

  const advance =
    Number(
      salaryRecord.advance || 0
    );

  const paid =
    Number(
      salaryRecord.paid || 0
    );

  const netSalary =
    Math.max(
      grossSalary - advance,
      0
    );

  const balance =
    Math.max(
      netSalary - paid,
      0
    );

  let status = "Pending";

  if (balance === 0) {

    status = "Paid";

  } else if (paid > 0) {

    status = "Partial";

  }

  return {

    daysWorked:
      presentDays,

    grossSalary,

    advance,

    paid,

    netSalary,

    balance,

    status,

  };

};

export const getSalarySummary = (
  workers,
  attendance,
  salary
) => {

  return workers.map((worker) => {

    const salaryRecord = salary.find(

      (item) =>

        item.workerId === worker.id

    ) || {};

    const presentDays =
      getPresentDays(
        worker.id,
        attendance
      );

    const absentDays =
      getAbsentDays(
        worker.id,
        attendance
      );

    const leaveDays =
      getLeaveDays(
        worker.id,
        attendance
      );

    return {

      ...worker,

      presentDays,

      absentDays,

      leaveDays,

      ...calculateSalary(

        worker,

        attendance,

        salaryRecord

      ),

      paymentHistory:
        salaryRecord.paymentHistory || [],

    };

  });

};