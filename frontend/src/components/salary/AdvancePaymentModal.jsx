import React, { useEffect, useState } from "react";

import Modal from "../modal/Modal";

const AdvancePaymentModal = ({
  open,
  worker,
  onClose,
  onSave,
}) => {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (worker) {
      setAmount(worker.advance || 0);
    }
  }, [worker]);

  if (!worker) return null;

  const handleSubmit = () => {
    if (Number(amount) < 0) {
      alert("Advance amount cannot be negative.");
      return;
    }

    onSave(worker.id, Number(amount));
  };

  const totalSalary =
    worker.dailyWage * worker.daysWorked;

  const remaining =
    totalSalary -
    Number(amount) -
    worker.paid;

  return (
    <Modal
      open={open}
      title="Advance Payment"
      submitText="Save"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        {/* Worker */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: ".5rem",
              fontWeight: "600",
            }}
          >
            Worker Name
          </label>

          <input
            disabled
            value={worker.name}
            style={{
              width: "100%",
              padding: ".9rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".75rem",
              background: "#F8FAFC",
            }}
          />
        </div>

        {/* Daily Wage */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: ".5rem",
              fontWeight: "600",
            }}
          >
            Daily Wage
          </label>

          <input
            disabled
            value={`₹${worker.dailyWage}`}
            style={{
              width: "100%",
              padding: ".9rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".75rem",
              background: "#F8FAFC",
            }}
          />
        </div>

        {/* Days */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: ".5rem",
              fontWeight: "600",
            }}
          >
            Days Worked
          </label>

          <input
            disabled
            value={worker.daysWorked}
            style={{
              width: "100%",
              padding: ".9rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".75rem",
              background: "#F8FAFC",
            }}
          />
        </div>

        {/* Total Salary */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: ".5rem",
              fontWeight: "600",
            }}
          >
            Total Salary
          </label>

          <input
            disabled
            value={`₹${totalSalary}`}
            style={{
              width: "100%",
              padding: ".9rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".75rem",
              background: "#F8FAFC",
            }}
          />
        </div>

        {/* Advance */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: ".5rem",
              fontWeight: "600",
            }}
          >
            Advance Amount
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="Enter Advance Amount"
            style={{
              width: "100%",
              padding: ".9rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".75rem",
              outline: "none",
            }}
          />
        </div>

        {/* Remaining */}

        <div
          style={{
            background: "#EFF6FF",
            padding: "1rem",
            borderRadius: ".8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: "600",
            }}
          >
            Remaining Salary
          </span>

          <strong
            style={{
              color:
                remaining > 0
                  ? "#DC2626"
                  : "#16A34A",
              fontSize: "1.1rem",
            }}
          >
            ₹{remaining}
          </strong>
        </div>
      </div>
    </Modal>
  );
};

export default AdvancePaymentModal;