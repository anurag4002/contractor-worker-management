import React, {
  createContext,
  useMemo,
  useState,
} from "react";

import workersData from "../data/workers";
import attendanceData from "../data/attendance";
import salaryData from "../data/salary";
import sitesData from "../data/sites";

import {
  getSalarySummary,
} from "../utils/wageCalculator";

import {
  getAttendanceSummary,
} from "../utils/attendanceCalculator";

import {
  getDashboardReport,
  getWorkerReport,
  getSalaryReport,
  getMonthlyExpenseReport,
  getSiteReport,
} from "../utils/reportCalculator";

const WorkerContext =
  createContext();

export const WorkerProvider = ({
  children,
}) => {

  const [workers, setWorkers] =
    useState(workersData);

  const [attendance, setAttendance] =
    useState(attendanceData);

  const [salary, setSalary] =
    useState(salaryData);

  const [sites, setSites] =
    useState(sitesData);

  const salarySummary = useMemo(

    () =>

      getSalarySummary(

        workers,

        attendance,

        salary

      ),

    [

      workers,

      attendance,

      salary,

    ]

  );

  const attendanceSummary =
    useMemo(

      () =>

        getAttendanceSummary(

          workers,

          attendance

        ),

      [

        workers,

        attendance,

      ]

    );

  const dashboardReport =
    useMemo(

      () =>

        getDashboardReport(

          workers,

          attendance,

          salary,

          sites

        ),

      [

        workers,

        attendance,

        salary,

        sites,

      ]

    );

  const workerReport =
    useMemo(

      () =>

        getWorkerReport(

          workers,

          attendance,

          salary

        ),

      [

        workers,

        attendance,

        salary,

      ]

    );

  const salaryReport =
    useMemo(

      () =>

        getSalaryReport(

          workers,

          attendance,

          salary

        ),

      [

        workers,

        attendance,

        salary,

      ]

    );

  const expenseReport =
    useMemo(

      () =>

        getMonthlyExpenseReport(

          workers,

          attendance,

          salary

        ),

      [

        workers,

        attendance,

        salary,

      ]

    );

  const siteReport =
    useMemo(

      () =>

        getSiteReport(

          sites,

          workers,

          attendance

        ),

      [

        sites,

        workers,

        attendance,

      ]

    );
      const addWorker = (worker) => {

    const newWorker = {

      id: `CW${String(
        workers.length + 1
      ).padStart(3, "0")}`,

      photo: "",

      status: "Active",

      ...worker,

    };

    setWorkers((prev) => [

      ...prev,

      newWorker,

    ]);

  };

  const updateWorker = (
    id,
    data
  ) => {

    setWorkers((prev) =>

      prev.map((worker) =>

        worker.id === id

          ? {

              ...worker,

              ...data,

            }

          : worker

      )

    );

  };

  const deleteWorker = (
    id
  ) => {

    setWorkers((prev) =>

      prev.filter(

        (worker) =>

          worker.id !== id

      )

    );

    setAttendance((prev) =>

      prev.filter(

        (item) =>

          item.workerId !== id

      )

    );

    setSalary((prev) =>

      prev.filter(

        (item) =>

          item.workerId !== id

      )

    );

    setSites((prev) =>

      prev.map((site) => ({

        ...site,

        workers:

          site.workers.filter(

            (workerId) =>

              workerId !== id

          ),

      }))

    );

  };

  const markAttendance = (
    record
  ) => {

    setAttendance((prev) => [

      ...prev,

      {

        id: `ATT${Date.now()}`,

        ...record,

      },

    ]);

  };

  const updateAttendance = (
    id,
    status
  ) => {

    setAttendance((prev) =>

      prev.map((item) =>

        item.id === id

          ? {

              ...item,

              status,

            }

          : item

      )

    );

  };

  const addAdvancePayment = (
    workerId,
    payment
  ) => {

    setSalary((prev) =>

      prev.map((item) => {

        if (

          item.workerId !== workerId

        ) {

          return item;

        }

        return {

          ...item,

          paid:

            Number(item.paid || 0) +

            Number(payment.amount),

          paymentHistory: [

            ...(item.paymentHistory || []),

            payment,

          ],

        };

      })

    );

  };

  const assignWorkerToSite = (
    siteId,
    workerId
  ) => {

    setSites((prev) =>

      prev.map((site) => {

        if (

          site.id !== siteId

        ) {

          return site;

        }

        if (

          site.workers.includes(

            workerId

          )

        ) {

          return site;

        }

        return {

          ...site,

          workers: [

            ...site.workers,

            workerId,

          ],

        };

      })

    );

  };
    const value = {

    workers,

    attendance,

    salary,

    sites,

    salarySummary,

    attendanceSummary,

    dashboardReport,

    workerReport,

    salaryReport,

    expenseReport,

    siteReport,

    addWorker,

    updateWorker,

    deleteWorker,

    markAttendance,

    updateAttendance,

    addAdvancePayment,

    assignWorkerToSite,

    setWorkers,

    setAttendance,

    setSalary,

    setSites,

  };

  return (

    <WorkerContext.Provider

      value={value}

    >

      {children}

    </WorkerContext.Provider>

  );

};

export default WorkerContext;