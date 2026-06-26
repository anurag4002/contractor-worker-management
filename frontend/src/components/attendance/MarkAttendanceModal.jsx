import React, { useEffect, useState } from "react";

import Modal from "../modal/Modal";

const MarkAttendanceModal = ({
  open,
  worker,
  onClose,
  onSave,
}) => {

  const [attendance, setAttendance] = useState({
    date: "",
    status: "Present",
    site: "",
    remarks: "",
  });

  useEffect(() => {

    if (worker) {

      setAttendance({
        date: new Date().toISOString().split("T")[0],
        status: worker.status || "Present",
        site: worker.site || "",
        remarks: "",
      });

    }

  }, [worker]);

  if (!worker) return null;

  const handleChange = (field, value) => {

    setAttendance((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  const handleSubmit = () => {

    onSave(worker.id, attendance);

    onClose();

  };

  return (

    <Modal
      open={open}
      title="Mark Attendance"
      submitText="Save Attendance"
      onClose={onClose}
      onSubmit={handleSubmit}
    >

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >

        <div>

          <label
            style={{
              display: "block",
              marginBottom: ".4rem",
              fontWeight: "600",
            }}
          >
            Worker
          </label>

          <input
            value={worker.name}
            disabled
            style={{
              width: "100%",
              padding: ".85rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".7rem",
            }}
          />

        </div>

        <div>

          <label
            style={{
              display: "block",
              marginBottom: ".4rem",
              fontWeight: "600",
            }}
          >
            Date
          </label>

          <input
            type="date"
            value={attendance.date}
            onChange={(e) =>
              handleChange("date", e.target.value)
            }
            style={{
              width: "100%",
              padding: ".85rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".7rem",
            }}
          />

        </div>

        <div>

          <label
            style={{
              display: "block",
              marginBottom: ".4rem",
              fontWeight: "600",
            }}
          >
            Site
          </label>

          <input
            value={attendance.site}
            onChange={(e) =>
              handleChange("site", e.target.value)
            }
            style={{
              width: "100%",
              padding: ".85rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".7rem",
            }}
          />

        </div>

        <div>

          <label
            style={{
              display: "block",
              marginBottom: ".4rem",
              fontWeight: "600",
            }}
          >
            Status
          </label>

          <select
            value={attendance.status}
            onChange={(e) =>
              handleChange("status", e.target.value)
            }
            style={{
              width: "100%",
              padding: ".85rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".7rem",
            }}
          >

            <option value="Present">
              Present
            </option>

            <option value="Absent">
              Absent
            </option>

            <option value="Leave">
              Leave
            </option>

          </select>

        </div>

        <div>

          <label
            style={{
              display: "block",
              marginBottom: ".4rem",
              fontWeight: "600",
            }}
          >
            Remarks
          </label>

          <textarea
            rows="4"
            value={attendance.remarks}
            onChange={(e) =>
              handleChange("remarks", e.target.value)
            }
            style={{
              width: "100%",
              resize: "none",
              padding: ".85rem",
              border: "1px solid #CBD5E1",
              borderRadius: ".7rem",
            }}
          />

        </div>

      </div>

    </Modal>

  );

};

export default MarkAttendanceModal;