import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  ChartsGrid,
  ChartCard,
  ChartTitle,
} from "./DashboardCharts.style";

const COLORS = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#DC2626",
  "#8B5CF6",
  "#0EA5E9",
];

const DashboardCharts = ({ chartsData }) => {
  const [attendance, setAttendance] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    if (chartsData) {
      setAttendance(
        (chartsData.attendanceChart || []).map((item) => ({
          status: item._id.replace("_", " "),
          value: item.value,
        }))
      );

      setPayroll(
        (chartsData.payrollStatusChart || []).map((item) => ({
          name: item._id,
          value: item.value,
        }))
      );

      setSites(
        (chartsData.siteWorkerChart || []).map((item) => ({
          site: item.siteName,
          workers: item.totalWorkers,
        }))
      );
    }
  }, [chartsData]);

  return (
    <ChartsGrid>

      <ChartCard>
        <ChartTitle>
          Attendance Status
        </ChartTitle>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={attendance}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="status" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#2563EB"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard>
        <ChartTitle>
          Payroll Status
        </ChartTitle>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={payroll}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {payroll.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                      index %
                      COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard>
        <ChartTitle>
          Site Workers
        </ChartTitle>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={sites}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="site" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="workers"
              fill="#16A34A"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

    </ChartsGrid>
  );
};

export default DashboardCharts;