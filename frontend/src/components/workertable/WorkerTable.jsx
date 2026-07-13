import React from "react";

import {
  FiEye,
  FiEdit,
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
} from "./WorkerTable.style";

const WorkerTable = ({
  workers = [],
  onView,
  onEdit,
  onDelete,
}) => {

  return (

    <TableCard>

      <Table>

        <thead>

          <tr>

            <th>#</th>

            <th>Photo</th>

            <th>Worker ID</th>

            <th>Name</th>

            <th>Mobile</th>

            <th>Skill</th>

            <th>Work Type</th>

            <th>Site</th>

            <th>Wage Type</th>

            <th>Wage</th>

            <th>Joining Date</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            workers.length === 0 ? (

              <tr>

                <td
                  colSpan={13}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#64748b",
                  }}
                >

                  No workers found.

                </td>

              </tr>

            ) : (

              workers.map((worker, index) => (

                <tr key={worker.id}>

                  <td>

                    {index + 1}

                  </td>

                  <td>

                    <WorkerInfo>

                      {

                        worker.photo ? (

                          <img

                            src={worker.photo}

                            alt={worker.name}

                            width="42"

                            height="42"

                            style={{

                              borderRadius: "50%",

                              objectFit: "cover",

                            }}

                          />

                        ) : (

                          <Avatar>

                            {

                              worker.name

                                ?.charAt(0)

                                ?.toUpperCase() || "W"

                            }

                          </Avatar>

                        )

                      }

                    </WorkerInfo>

                  </td>

                  <td>

                    {worker.id}

                  </td>

                  <td>

                    {worker.name}

                  </td>

                  <td>

                    {worker.mobile}

                  </td>

                  <td>

                    {worker.skill}

                  </td>

                  <td>

                    {worker.workType}

                  </td>

                  <td>

                    {worker.site || "-"}

                  </td>

                  <td>

                    {worker.wageType}

                  </td>

                  <td>

                    {

                      worker.wageType === "Daily"

                        ? `₹${Number(

                            worker.dailyWage || 0

                          ).toLocaleString("en-IN")}/Day`

                        : `₹${Number(

                            worker.monthlySalary || 0

                          ).toLocaleString("en-IN")}/Month`

                    }

                  </td>

                  <td>

                    {worker.joiningDate || "-"}

                  </td>

                  <td>

                    <Status

                      status={

                        worker.status || "Active"

                      }

                    >

                      {

                        worker.status || "Active"

                      }

                    </Status>

                  </td>

                  <td>

                    <ActionButtons>

                      <IconButton

                        title="View Profile"

                        onClick={() =>

                          onView(worker)

                        }

                      >

                        <FiEye />

                      </IconButton>

                      <IconButton

                        title="Edit Worker"

                        onClick={() =>

                          onEdit(worker)

                        }

                      >

                        <FiEdit />

                      </IconButton>

                      <IconButton

                        title="Delete Worker"

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

            )

          }

        </tbody>

      </Table>

    </TableCard>

  );

};

export default WorkerTable;