import React from "react";

import {
  FiEye,
  FiFileText,
  FiDownload,
} from "react-icons/fi";

import {
  TableCard,
  Table,
  Status,
  ActionButtons,
  IconButton,
} from "./ReportTable.style";

const ReportTable = ({
  reports = [],
  onView,
}) => {

  return (

    <TableCard>

      <Table>

        <thead>

          <tr>

            <th>#</th>

            <th>Worker ID</th>

            <th>Worker Name</th>

            <th>Site</th>

            <th>Attendance</th>

            <th>Gross Salary</th>

            <th>Net Salary</th>

            <th>Balance</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            reports.length === 0 ? (

              <tr>

                <td

                  colSpan="10"

                  style={{

                    textAlign: "center",

                    padding: "2rem",

                    color: "#64748B",

                  }}

                >

                  No reports found.

                </td>

              </tr>

            ) : (

              reports.map((report, index) => {

                const attendance = Number(
                  report.attendance || 0
                );

                const grossSalary = Number(
                  report.grossSalary || 0
                );

                const netSalary = Number(
                  report.netSalary || 0
                );

                const balance = Number(
                  report.balance || 0
                );

                const status =

                  balance <= 0

                    ? "Paid"

                    : balance < grossSalary

                    ? "Partial"

                    : "Pending";

                return (

                  <tr key={report.id}>

                    <td>

                      {index + 1}

                    </td>

                    <td>

                      {report.id}

                    </td>

                    <td>

                      {report.name}

                    </td>

                    <td>

                      {report.site}

                    </td>

                    <td>

                      {attendance}%

                    </td>

                    <td>

                      ₹{grossSalary.toLocaleString("en-IN")}

                    </td>

                    <td>

                      ₹{netSalary.toLocaleString("en-IN")}

                    </td>

                    <td>

                      ₹{balance.toLocaleString("en-IN")}

                    </td>

                    <td>

                      <Status status={status}>

                        {status}

                      </Status>

                    </td>

                    <td>

                      <ActionButtons>

                        <IconButton

                          title="Preview Report"

                          onClick={() =>

                            onView(report)

                          }

                        >

                          <FiEye />

                        </IconButton>

                        <IconButton

                          title="Download PDF"

                        >

                          <FiFileText />

                        </IconButton>

                        <IconButton

                          title="Export Excel"

                        >

                          <FiDownload />

                        </IconButton>

                      </ActionButtons>

                    </td>

                  </tr>

                );

              })

            )

          }

        </tbody>

      </Table>

    </TableCard>

  );

};

export default ReportTable;