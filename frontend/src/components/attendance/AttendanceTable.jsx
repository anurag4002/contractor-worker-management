import React from "react";

import {
  TableCard,
  Table,
  StatusBadge,
  ActionButtons,
  ActionButton,
} from "../../pages/attendance/Attendance.style";

const AttendanceTable = ({
  workers,
  onStatusChange,
}) => {
  return (
    <TableCard>
      <Table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Worker Name</th>

            <th>Site</th>

            <th>Date</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {workers.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#64748B",
                }}
              >

                No Attendance Found

              </td>

            </tr>

          ) : (

            workers.map((worker) => (

              <tr key={worker.id}>

                <td>{worker.id}</td>

                <td>{worker.name}</td>

                <td>{worker.site}</td>

                <td>{worker.date}</td>

                <td>

                  <StatusBadge status={worker.status}>

                    {worker.status}

                  </StatusBadge>

                </td>

                <td>

                  <ActionButtons>

                    <ActionButton
                      type="present"
                      onClick={() =>
                        onStatusChange(
                          worker.id,
                          "Present"
                        )
                      }
                    >

                      Present

                    </ActionButton>

                    <ActionButton
                      type="absent"
                      onClick={() =>
                        onStatusChange(
                          worker.id,
                          "Absent"
                        )
                      }
                    >

                      Absent

                    </ActionButton>

                    <ActionButton
                      type="leave"
                      onClick={() =>
                        onStatusChange(
                          worker.id,
                          "Leave"
                        )
                      }
                    >

                      Leave

                    </ActionButton>

                  </ActionButtons>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </Table>
    </TableCard>
  );
};

export default AttendanceTable;