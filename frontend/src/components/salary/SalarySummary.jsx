import React from "react";

import {
  FiUsers,
  FiDollarSign,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi";

import SalaryCard from "./SalaryCard";

import {
  SummaryGrid,
} from "./SalarySummary.style";

const SalarySummary = ({
  workers = [],
}) => {

  const uniqueWorkers = [];

  const seenWorkerIds = new Set();

  workers.forEach((worker, index) => {

    const workerRef = worker?.worker;

    let workerId = workerRef?._id;

    if (!workerId) {

      workerId =
        workerRef && typeof workerRef === "object" && workerRef.employeeCode
          ? workerRef.employeeCode
          : workerRef;

    }

    const workerKey = String(
      workerId || worker?._id || `payroll-${index}`
    );

    if (seenWorkerIds.has(workerKey)) {

      return;

    }

    seenWorkerIds.add(workerKey);

    uniqueWorkers.push(worker);

  });

  const summary = uniqueWorkers.reduce(

    (acc, worker) => {

      acc.totalWorkers += 1;

      acc.totalDue += Number(worker.grossSalary || 0);

      acc.totalPaid += Number((worker.paid || 0) + (worker.advanceDeduction || 0));

      acc.totalAdvance += Number(worker.advanceDeduction || 0);

      const grossSalary = Number(worker.grossSalary || 0);

      const deduction = Number(worker.deduction || 0);

      const advanceDeduction = Number(worker.advanceDeduction || 0);

      const paid = Number(worker.paid || 0) + Number(advanceDeduction || 0);

      const totalPayable = grossSalary - deduction;

      const remainingBalance = Math.max(0, totalPayable - paid);

      acc.totalBalance += remainingBalance;

      return acc;

    },

    {

      totalWorkers: 0,

      totalDue: 0,

      totalPaid: 0,

      totalAdvance: 0,

      totalBalance: 0,

    }

  );

  const uniqueWorkerIds = new Set();

  uniqueWorkers.forEach((worker) => {

    const id = worker?.worker?._id || worker?.worker?.employeeCode || worker?.worker;

    if (id) {

      uniqueWorkerIds.add(String(id));

    }

  });

  const uniqueWorkerCount = uniqueWorkerIds.size;

  const cards = [

    {

      title: "Total Workers",

      value: uniqueWorkerCount,

      icon: <FiUsers />,

      color: "#2563EB",

    },

    {

      title: "Total Wage Due",

      value: `₹${summary.totalDue.toLocaleString("en-IN")}`,

      icon: <FiDollarSign />,

      color: "#F59E0B",

    },

    {

      title: "Salary Paid",

      value: `₹${summary.totalPaid.toLocaleString("en-IN")}`,

      icon: <FiCreditCard />,

      color: "#16A34A",

    },

    {

      title: "Remaining Balance",

      value: `₹${summary.totalBalance.toLocaleString("en-IN")}`,

      icon: <FiTrendingUp />,

      color: "#DC2626",

    },

  ];

  return (

    <SummaryGrid>

      {

        cards.map((card) => (

          <SalaryCard

            key={card.title}

            title={card.title}

            value={card.value}

            icon={card.icon}

            color={card.color}

          />

        ))

      }

    </SummaryGrid>

  );

};

export default SalarySummary;