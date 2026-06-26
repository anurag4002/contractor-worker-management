import React from "react";

import {
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import {
  TableCard,
  Table,
  WorkerInfo,
  Avatar,
  Status,
  ActionButtons,
  IconButton,
} from "../../pages/workers/Workers.style";

const WorkerTable = ({
  workers,
  onView,
  onEdit,
  onDelete,
}) => {

  return (

    <TableCard>

      <Table>

        <thead>

          <tr>

            <th>Worker</th>

            <th>Phone</th>

            <th>Skill</th>

            <th>Site</th>

            <th>Daily Wage</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {workers.length === 0 ? (

            <tr>

              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#64748B",
                }}
              >

                No Workers Found

              </td>

            </tr>

          ) : (

            workers.map((worker) => (

              <tr key={worker.id}>

                <td>

                  <WorkerInfo>

                    <Avatar>

                      {worker.name.charAt(0)}

                    </Avatar>

                    <div>

                      <strong>

                        {worker.name}

                      </strong>

                      <p
                        style={{
                          marginTop: ".25rem",
                          color: "#64748B",
                          fontSize: ".85rem",
                        }}
                      >

                        {worker.id}

                      </p>

                    </div>

                  </WorkerInfo>

                </td>

                <td>{worker.phone}</td>

                <td>{worker.skill}</td>

                <td>{worker.site}</td>

                <td>{worker.salary}</td>

                <td>

                  <Status
                    status={worker.status}
                  >

                    {worker.status}

                  </Status>

                </td>

                <td>

                  <ActionButtons>

                    <IconButton
                      title="View"
                      onClick={() =>
                        onView(worker)
                      }
                    >

                      <FiEye />

                    </IconButton>

                    <IconButton
                      title="Edit"
                      onClick={() =>
                        onEdit(worker)
                      }
                    >

                      <FiEdit2 />

                    </IconButton>

                    <IconButton
                      title="Delete"
                      onClick={() =>
                        onDelete(worker)
                      }
                    >

                      <FiTrash2 />

                    </IconButton>

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

export default WorkerTable;