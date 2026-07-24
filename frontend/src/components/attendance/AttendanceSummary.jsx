import React from "react";

import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiCoffee,
} from "react-icons/fi";

import AttendanceCard from "./AttendanceCard";

import {
  SummaryGrid,
} from "./AttendanceSummary.style";

const AttendanceSummary = ({ summary }) => {
  const s = summary || {};

  return (

    <SummaryGrid>

      <AttendanceCard
        title="Total Workers"
        value={s.totalWorkers || 0}
        icon={<FiUsers />}
        color="#2563EB"
      />

      <AttendanceCard
        title="Present Today"
        value={s.present || s.totalPresent || 0}
        icon={<FiCheckCircle />}
        color="#16A34A"
      />

      <AttendanceCard
        title="Absent Today"
        value={s.absent || s.totalAbsent || 0}
        icon={<FiXCircle />}
        color="#DC2626"
      />

      <AttendanceCard
        title="On Leave"
        value={s.leave || s.onLeave || s.totalLeave || 0}
        icon={<FiCoffee />}
        color="#F59E0B"
      />

    </SummaryGrid>

  );

};

export default AttendanceSummary;