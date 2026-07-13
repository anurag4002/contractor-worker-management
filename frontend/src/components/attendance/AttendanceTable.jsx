import React from "react";

import {
  FiClock,
  FiEdit2,
} from "react-icons/fi";

import {
  TableCard,
  Table,
  Status,
  ActionButtons,
  IconButton,
} from "./AttendanceTable.style";

const AttendanceTable = ({
  workers = [],
  onHistory,
  onMark,
}) => {

  return (

    <TableCard>

      <Table>

        <thead>

          <tr>

            <th>#</th>

            <th>Photo</th>

            <th>Worker ID</th>

            <th>Worker Name</th>

            <th>Site</th>

            <th>Date</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            workers.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#64748b",
                  }}
                >

                  No attendance records found.

                </td>

              </tr>

            ) : (

              workers.map((worker, index) => (

                <tr key={worker.id}>

                  <td>

                    {index + 1}

                  </td>

                  <td>

                    {

                      worker.photo ? (

                        <img
                          src={worker.photo}
                          alt={worker.name}
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />

                      ) : (

                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: "#2563EB",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: 600,
                          }}
                        >

                          {

                            worker.name

                              ?.charAt(0)

                              ?.toUpperCase() || "W"

                          }

                        </div>

                      )

                    }

                  </td>

                  <td>

                    {worker.id}

                  </td>

                  <td>

                    {worker.name}

                  </td>

                  <td>

                    {worker.site || "-"}

                  </td>

                  <td>

                    {

                      worker.date

                        ? new Date(
                            worker.date
                          ).toLocaleDateString(
                            "en-IN"
                          )

                        : "-"

                    }

                  </td>

                  <td>

                    <Status
                      status={worker.status}
                    >

                      {worker.status || "Pending"}

                    </Status>

                  </td>

                  <td>

                    <ActionButtons>

                      <IconButton

                        title="Mark Attendance"

                        onClick={() =>

                          onMark(worker)

                        }

                      >

                        <FiEdit2 />

                      </IconButton>

                      <IconButton

                        title="Attendance History"

                        onClick={() =>

                          onHistory(worker)

                        }

                      >

                        <FiClock />

                      </IconButton>

                    </ActionButtons>

                  </td>

                </tr>

              ))

            )

          }

        </tbody>

      </Table>

    </TableCard>

  );

};

export default AttendanceTable;