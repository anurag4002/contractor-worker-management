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

  const summary = workers.reduce(

    (acc, worker) => {

      acc.totalWorkers += 1;

      acc.totalDue += Number(worker.grossSalary || 0);

      acc.totalPaid += Number(worker.paid || 0);

      acc.totalAdvance += Number(worker.advance || 0);

      acc.totalBalance += Number(worker.balance || 0);

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

  const cards = [

    {

      title: "Total Workers",

      value: summary.totalWorkers,

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