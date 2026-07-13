import React from "react";

import {
  FiEye,
  FiCreditCard,
  FiClock,
} from "react-icons/fi";

import {
  TableCard,
  Table,
  Status,
  ActionButtons,
  IconButton,
} from "./SalaryTable.style";

const SalaryTable = ({
  workers = [],
  onView,
  onAdvance,
  onHistory,
}) => {

  const getStatus = (worker) => {

    if (worker.balance <= 0) {

      return "Paid";

    }

    if (worker.paid > 0) {

      return "Partial";

    }

    return "Pending";

  };

  return (

    <TableCard>

      <Table>

        <thead>

          <tr>

            <th>#</th>

            <th>Photo</th>

            <th>ID</th>

            <th>Worker</th>

            <th>Site</th>

            <th>Work Type</th>

            <th>Wage Type</th>

            <th>Rate</th>

            <th>Days</th>

            <th>Gross</th>

            <th>Advance</th>

            <th>Paid</th>

            <th>Balance</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            workers.length === 0 ? (

              <tr>

                <td

                  colSpan="15"

                  style={{

                    textAlign: "center",

                    padding: "2rem",

                    color: "#64748b",

                  }}

                >

                  No salary records found.

                </td>

              </tr>

            ) : (

              workers.map((worker, index) => {

                const status = getStatus(worker);

                return (

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

                              width: "40px",

                              height: "40px",

                              borderRadius: "50%",

                              objectFit: "cover",

                            }}

                          />

                        ) : (

                          <div

                            style={{

                              width: "40px",

                              height: "40px",

                              borderRadius: "50%",

                              background: "#2563EB",

                              color: "#fff",

                              display: "flex",

                              alignItems: "center",

                              justifyContent: "center",

                              fontWeight: 600,

                            }}

                          >

                            {

                              worker.name

                                ?.charAt(0)

                                ?.toUpperCase()

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

                      {worker.workType || "-"}

                    </td>

                    <td>

                      {worker.wageType}

                    </td>

                    <td>

                      {

                        worker.wageType === "Monthly"

                          ? `₹${Number(worker.monthlySalary || worker.dailyWage || 0).toLocaleString("en-IN")}/Month`

                          : `₹${Number(worker.dailyWage || 0).toLocaleString("en-IN")}/Day`

                      }

                    </td>

                    <td>

                      {worker.daysWorked || 0}

                    </td>

                    <td>

                      ₹{

                        Number(worker.grossSalary || 0)

                          .toLocaleString("en-IN")

                      }

                    </td>

                    <td>

                      ₹{

                        Number(worker.advance || 0)

                          .toLocaleString("en-IN")

                      }

                    </td>

                    <td>

                      ₹{

                        Number(worker.paid || 0)

                          .toLocaleString("en-IN")

                      }

                    </td>

                    <td>

                      ₹{

                        Number(worker.balance || 0)

                          .toLocaleString("en-IN")

                      }

                    </td>

                    <td>

                      <Status status={status}>

                        {status}

                      </Status>

                    </td>

                    <td>

                      <ActionButtons>

                        <IconButton

                          title="Salary Slip"

                          onClick={() =>

                            onView(worker)

                          }

                        >

                          <FiEye />

                        </IconButton>

                        <IconButton

                          title="Advance Payment"

                          onClick={() =>

                            onAdvance(worker)

                          }

                        >

                          <FiCreditCard />

                        </IconButton>

                        <IconButton

                          title="Payment History"

                          onClick={() =>

                            onHistory(worker)

                          }

                        >

                          <FiClock />

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

export default SalaryTable;