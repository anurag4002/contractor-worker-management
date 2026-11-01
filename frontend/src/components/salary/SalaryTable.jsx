import React from "react";

import {
  FiEye,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
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

const getWorkerIdDisplay = (worker) => {

  const workerRef = worker?.worker;

  const id = workerRef?.employeeCode || workerRef?._id || workerRef;

  return id || "-";

};

const getPayrollPeriod = (worker) => {

  const month = Number(worker?.attendanceMonth || 0);

  const year = Number(worker?.attendanceYear || 0);

  if (!month || !year) {

    return "-";

  }

  return `${year}-${String(month).padStart(2, "0")}`;

};

const getRemainingBalance = (worker) => {

  const grossSalary = Number(worker?.grossSalary || 0);

  const deduction = Number(worker?.deduction || 0);

  const advanceDeduction = Number(worker?.advanceDeduction || 0);

  const paid = Number(worker?.paid || 0) + Number(advanceDeduction || 0);

  const totalPayable = grossSalary - deduction;

  const remainingBalance = totalPayable - paid;

  return Math.max(0, remainingBalance);

};

const SalaryTable = ({
  workers = [],
  onView,
  onAdvance,
  onHistory,
  onPayment,
  emptyMessage = "No salary records found.",
}) => {

  const getStatus = (worker) => {

    if (worker?.status === "CANCELLED") {

      return "Cancelled";

    }

    const remainingBalance = getRemainingBalance(worker);

    if (worker?.status === "PAID" || remainingBalance <= 0) {

      return "Paid";

    }

    const paid =
      Number(worker?.paid || 0) +
      Number(worker?.advanceDeduction || 0);

    if (paid > 0) {

      return "Partially Paid";

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
            <CardLabel>Period</CardLabel>
            <CardValue>{getPayrollPeriod(worker)}</CardValue>
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
            <CardValue>{formatINR(getRemainingBalance(worker))}</CardValue>
          </CardField>
        </CardBody>
        <CardActions>
          <IconButton title="Salary Slip" onClick={() => onView && onView(worker)}>
            <FiEye />
          </IconButton>
          <IconButton title="Record Salary Payment" onClick={() => onPayment && onPayment(worker)}>
            <FiCheckCircle />
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

            <th>Worker ID</th>

            <th>Worker</th>

            <th>Payroll Month</th>

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

                  colSpan="16"

                  style={{

                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--text-secondary)",
                  }}

                >

                  {emptyMessage}

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

                    <td>{getWorkerIdDisplay(worker)}</td>

                    <td>{worker.worker?.fullName || "-"}</td>

                    <td>{getPayrollPeriod(worker)}</td>

                    <td>{worker.site?.siteName || "-"}</td>

                    <td>{worker.worker?.trade || "-"}</td>

                    <td>{"Daily Wage"}</td>

                    <td>{`${formatINR(worker.dailyWage)}/Day`}</td>

                    <td>{worker.workingDays || 0}</td>

                    <td>{formatINR(worker.grossSalary)}</td>

                    <td>{formatINR(worker.advanceDeduction)}</td>

                    <td>{formatINR((worker.paid || 0) + (worker.advanceDeduction || 0))}</td>

                    <td>{formatINR(getRemainingBalance(worker))}</td>

                    <td><Status $status={status}>{status}</Status></td>

                    <td>

                      <ActionButtons>

                        <IconButton title="Salary Slip" onClick={() => onView && onView(worker)}>
                          <FiEye />
                        </IconButton>

                        <IconButton title="Record Salary Payment" onClick={() => onPayment && onPayment(worker)}>
                          <FiCheckCircle />
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
            {emptyMessage}
          </div>
        ) : (
          workers.map((w, i) => renderMobileCard(w, i))
        )}
      </CardList>

    </TableCard>

  );

};

export default SalaryTable;