import { useMemo } from "react";

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
  Legend,
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

const DashboardCharts = ({
  attendanceChart,
  payrollChart,
  siteWorkersChart,
}) => {
  const attendance = useMemo(() => attendanceChart || [], [attendanceChart]);
  const payroll = useMemo(() => payrollChart || [], [payrollChart]);
  const sites = useMemo(() => siteWorkersChart || [], [siteWorkersChart]);

  return (
    <ChartsGrid>

      <ChartCard>
        <ChartTitle>
          Attendance Status
        </ChartTitle>

        {attendance.length === 0 ? (
          <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            No attendance data available.
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <BarChart data={attendance}>
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
        )}
      </ChartCard>

      <ChartCard>
        <ChartTitle>
          Payroll Status
        </ChartTitle>

        {payroll.length === 0 ? (
          <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            No payroll data available.
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <PieChart>
              <Pie
                data={payroll}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard>
        <ChartTitle>
          Site Workers
        </ChartTitle>

        {sites.length === 0 ? (
          <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            No site worker data available.
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <BarChart data={sites}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="site" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#16A34A"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

    </ChartsGrid>
  );
};

export default DashboardCharts;