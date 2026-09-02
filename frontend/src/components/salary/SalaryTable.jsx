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
  CardList,
  Card as CardItem,
  CardHeader,
  CardName,
  CardSub,
  CardBody,
  CardField,
  CardLabel,
  CardValue,
  CardActions,
} from "./SalaryTable.style";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const SalaryTable = ({
  workers = [],
  onView,
  onAdvance,
  onHistory,
}) => {

  const getStatus = (worker) => {

    if (worker.status === "PAID") {

      return "Paid";

    }

    if (worker.status === "GENERATED" || worker.status === "PENDING") {

      return "Pending";

    }

    return "Pending";

  };

  const renderMobileCard = (worker, index) => {
    const status = getStatus(worker);
    return (
      <CardItem key={worker._id || index}>
        <CardHeader>
          <div style={{ minWidth: 0 }}>
            <CardName>{worker.worker?.fullName || "—"}</CardName>
            <CardSub>{worker.site?.siteName || "—"}</CardSub>
          </div>
          <Status $status={status}>{status}</Status>
        </CardHeader>
        <CardBody>
          <CardField>
            <CardLabel>Trade</CardLabel>
            <CardValue>{worker.worker?.trade || "—"}</CardValue>
          </CardField>
          <CardField>
            <CardLabel>Wage</CardLabel>
            <CardValue>{formatINR(worker.dailyWage)}/Day</CardValue>
          </CardField>
          <CardField>
            <CardLabel>Days</CardLabel>
            <CardValue>{worker.workingDays || 0}</CardValue>
          </CardField>
          <CardField>
            <CardLabel>Gross</CardLabel>
            <CardValue>{formatINR(worker.grossSalary)}</CardValue>
          </CardField>
          <CardField>
            <CardLabel>Advance</CardLabel>
            <CardValue>{formatINR(worker.advanceDeduction)}</CardValue>
          </CardField>
          <CardField>
            <CardLabel>Paid</CardLabel>
            <CardValue>{formatINR((worker.paid || 0) + (worker.advanceDeduction || 0))}</CardValue>
          </CardField>
          <CardField>
            <CardLabel>Balance</CardLabel>
            <CardValue>{formatINR(worker.status === "PAID" ? 0 : worker.netSalary)}</CardValue>
          </CardField>
        </CardBody>
        <CardActions>
          <IconButton title="Salary Slip" onClick={() => onView && onView(worker)}>
            <FiEye />
          </IconButton>
          <IconButton title="Advance Payment" onClick={() => onAdvance && onAdvance(worker)}>
            <FiCreditCard />
          </IconButton>
          <IconButton title="Payment History" onClick={() => onHistory && onHistory(worker)}>
            <FiClock />
          </IconButton>
        </CardActions>
      </CardItem>
    );
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
                    color: "var(--text-secondary)",
                  }}

                >

                  No salary records found.

                </td>

              </tr>

            ) : (

              workers.map((worker, index) => {

                const status = getStatus(worker);

                return (

                  <tr key={worker._id}>

                    <td>

                      {index + 1}

                    </td>

                    <td>

                      {

                        worker.photo ? (

                          <img

                            src={worker.photo}
                            alt={worker.worker?.fullName || "Worker"}

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
                              background: "var(--primary)",
                              color: "var(--text-on-primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                            }}

                          >

                            {worker.worker?.fullName?.charAt(0)?.toUpperCase()}

                          </div>

                        )

                      }

                    </td>

                    <td>{worker._id}</td>

                    <td>{worker.worker?.fullName || "-"}</td>

                    <td>{worker.site?.siteName || "-"}</td>

                    <td>{worker.worker?.trade || "-"}</td>

                    <td>{"Daily Wage"}</td>

                    <td>{`${formatINR(worker.dailyWage)}/Day`}</td>

                    <td>{worker.workingDays || 0}</td>

                    <td>{formatINR(worker.grossSalary)}</td>

                    <td>{formatINR(worker.advanceDeduction)}</td>

                    <td>{formatINR((worker.paid || 0) + (worker.advanceDeduction || 0))}</td>

                    <td>{formatINR(worker.status === "PAID" ? 0 : worker.netSalary)}</td>

                    <td><Status $status={status}>{status}</Status></td>

                    <td>

                      <ActionButtons>

                        <IconButton title="Salary Slip" onClick={() => onView && onView(worker)}>
                          <FiEye />
                        </IconButton>

                        <IconButton title="Advance Payment" onClick={() => onAdvance && onAdvance(worker)}>
                          <FiCreditCard />
                        </IconButton>

                        <IconButton title="Payment History" onClick={() => onHistory && onHistory(worker)}>
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

      <CardList>
        {workers.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
            No salary records found.
          </div>
        ) : (
          workers.map((w, i) => renderMobileCard(w, i))
        )}
      </CardList>

    </TableCard>

  );

};

export default SalaryTable;