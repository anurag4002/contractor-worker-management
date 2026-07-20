
import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import dashboardService from "../../services/dashboard.service";

import {
  Card,
  Title,
} from "./AttendanceChart.style";

const AttendanceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadChart();
  }, []);

  const loadChart = async () => {
    try {
      const response =
        await dashboardService.getCharts();

      setData(
        response.data.attendanceChart || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <Title>
        Attendance Overview
      </Title>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#2563EB"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AttendanceChart;