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

const AttendanceSummary = ({
  workers,
}) => {

  return (

    <SummaryGrid>

      <AttendanceCard
        title="Total Workers"
        value={workers.totalWorkers || 0}
        icon={<FiUsers />}
        color="#2563EB"
      />

      <AttendanceCard
        title="Present Today"
        value={workers.present || 0}
        icon={<FiCheckCircle />}
        color="#16A34A"
      />

      <AttendanceCard
        title="Absent Today"
        value={workers.absent || 0}
        icon={<FiXCircle />}
        color="#DC2626"
      />

      <AttendanceCard
        title="On Leave"
        value={workers.leave || 0}
        icon={<FiCoffee />}
        color="#F59E0B"
      />

    </SummaryGrid>

  );

};

export default AttendanceSummary;