import React, { useEffect, useState } from "react";
import useAttendance from "../../hooks/useAttendance";
import { Overlay, Modal, Header, Title, CloseButton, Table, EmptyState } from "./AttendanceHistoryModal.style";

const AttendanceHistoryModal = ({ open, workerId, onClose }) => {
  const { workerHistory, fetchWorkerHistory, loading } = useAttendance();

  useEffect(() => {
    if (open && workerId) {
      fetchWorkerHistory(workerId);
    }
  }, [open, workerId]);

  if (!open) return null;

  const history = Array.isArray(workerHistory) ? workerHistory : [];

  const statusLabel = (s) => {
    const map = { PRESENT: "Present", ABSENT: "Absent", HALF_DAY: "Half Day", LEAVE: "Leave", HOLIDAY: "Holiday" };
    return map[s] || s;
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>Attendance History</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        {loading ? (
          <EmptyState>Loading history...</EmptyState>
        ) : history.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Regular Hours</th>
                <th>Overtime</th>
                <th>Site</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString("en-IN") : "-"}</td>
                  <td>{statusLabel(item.status)}</td>
                  <td>{item.regularHours ?? 0} hrs</td>
                  <td>{item.overtimeHours ?? 0} hrs</td>
                  <td>{item.site?.siteName || "-"}</td>
                  <td>{item.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>No attendance history available for this worker.</EmptyState>
        )}
      </Modal>
    </Overlay>
  );
};

export default AttendanceHistoryModal;