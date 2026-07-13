import React from "react";

import {
  FiClipboard,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";

import ReportCard from "./ReportCard";

import {
  SummaryGrid,
} from "./ReportSummary.style";

const ReportSummary = ({
  reports = [],
}) => {

  const totalWorkers = reports.length;

  const totalSalary = reports.reduce(

    (sum, report) =>

      sum + Number(report.grossSalary || 0),

    0

  );

  const totalBalance = reports.reduce(

    (sum, report) =>

      sum + Number(report.balance || 0),

    0

  );

  const averageAttendance = reports.length

    ? Math.round(

        reports.reduce(

          (sum, report) =>

            sum + Number(report.attendance || 0),

          0

        ) / reports.length

      )

    : 0;

  const cards = [

    {

      title: "Workers Report",

      value: totalWorkers,

      icon: <FiClipboard />,

      color: "#2563EB",

    },

    {

      title: "Gross Salary",

      value: `₹${totalSalary.toLocaleString("en-IN")}`,

      icon: <FiDollarSign />,

      color: "#16A34A",

    },

    {

      title: "Pending Salary",

      value: `₹${totalBalance.toLocaleString("en-IN")}`,

      icon: <FiTrendingUp />,

      color: "#F59E0B",

    },

    {

      title: "Avg Attendance",

      value: `${averageAttendance}%`,

      icon: <FiFileText />,

      color: "#8B5CF6",

    },

  ];

  return (

    <SummaryGrid>

      {

        cards.map((card) => (

          <ReportCard

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

export default ReportSummary;