import React, { useMemo } from "react";

import Modal from "../modal/Modal";

import {
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

const cardStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: "1rem",
  marginBottom: "2rem",
};

const statCard = {
  padding: "1rem",
  border: "1px solid #E2E8F0",
  borderRadius: "12px",
  textAlign: "center",
  background: "#F8FAFC",
};

const AttendanceHistoryModal = ({
  open,
  worker,
  history = [],
  onClose,
}) => {

  const summary = useMemo(() => {

    const present = history.filter(
      (item) => item.status === "Present"
    ).length;

    const absent = history.filter(
      (item) => item.status === "Absent"
    ).length;

    const leave = history.filter(
      (item) => item.status === "Leave"
    ).length;

    const percentage =
      history.length === 0
        ? 0
        : Math.round(
            (present / history.length) * 100
          );

    return {
      present,
      absent,
      leave,
      percentage,
    };

  }, [history]);

  if (!worker) return null;

  return (

    <Modal
      open={open}
      title="Attendance History"
      submitText="Close"
      onClose={onClose}
      onSubmit={onClose}
    >

      {/* Worker */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >

        <div
          style={{
            width: "65px",
            height: "65px",
            borderRadius: "50%",
            background: "#2563EB",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.5rem",
            fontWeight: "700",
          }}
        >
          {worker.name.charAt(0)}
        </div>

        <div>

          <h2
            style={{
              margin: 0,
              color: "#0F172A",
            }}
          >
            {worker.name}
          </h2>

          <p
            style={{
              marginTop: ".3rem",
              color: "#64748B",
            }}
          >
            {worker.id}
          </p>

        </div>

      </div>

      {/* Summary */}

      <div style={cardStyle}>

        <div style={statCard}>
          <FiCheckCircle
            color="#16A34A"
            size={26}
          />
          <h3>{summary.present}</h3>
          <p>Present</p>
        </div>

        <div style={statCard}>
          <FiXCircle
            color="#DC2626"
            size={26}
          />
          <h3>{summary.absent}</h3>
          <p>Absent</p>
        </div>

        <div style={statCard}>
          <FiClock
            color="#F59E0B"
            size={26}
          />
          <h3>{summary.leave}</h3>
          <p>Leave</p>
        </div>

        <div style={statCard}>
          <FiUser
            color="#2563EB"
            size={26}
          />
          <h3>{summary.percentage}%</h3>
          <p>Attendance</p>
        </div>

      </div>

      {/* History Table */}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >

        <thead>

          <tr
            style={{
              background: "#F8FAFC",
            }}
          >

            <th
              style={{
                padding: "12px",
                textAlign: "left",
              }}
            >
              <FiCalendar />

            </th>

            <th>Date</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {history.map((item, index) => (

            <tr key={index}>

              <td
                style={{
                  padding: "12px",
                }}
              >
                {index + 1}
              </td>

              <td>{item.date}</td>

              <td>

                <span
                  style={{
                    padding: ".4rem .9rem",
                    borderRadius: "999px",
                    background:
                      item.status === "Present"
                        ? "#DCFCE7"
                        : item.status === "Absent"
                        ? "#FEE2E2"
                        : "#FEF3C7",

                    color:
                      item.status === "Present"
                        ? "#15803D"
                        : item.status === "Absent"
                        ? "#DC2626"
                        : "#B45309",

                    fontSize: ".8rem",
                    fontWeight: "600",
                  }}
                >

                  {item.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </Modal>

  );

};

export default AttendanceHistoryModal;