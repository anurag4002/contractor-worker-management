import React from "react";
import { FiClock, FiEdit2, FiTrash2 } from "react-icons/fi";
import { TableCard, Table, Status, ActionButtons, IconButton } from "./AttendanceTable.style";

const AttendanceTable = ({ records = [], onHistory, onMark, onDelete, onChangeStatus }) => {
  return (
    <TableCard>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Photo</th>
            <th>Worker ID</th>
            <th>Worker Name</th>
            <th>Site</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                No attendance records found.
              </td>
            </tr>
          ) : (
            records.map((record, index) => {
              const worker = record.worker || {};
              const site = record.site || {};
              const workerName = worker.fullName || worker.firstName + " " + worker.lastName || "Unknown";

              return (
                <tr key={record._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    {worker.photo ? (
                      <img
                        src={worker.photo}
                        alt={workerName}
                        style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "42px", height: "42px", borderRadius: "50%",
                          background: "#2563EB", color: "#fff", display: "flex",
                          justifyContent: "center", alignItems: "center", fontWeight: 600,
                        }}
                      >
                        {workerName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td>{worker._id || worker.workerId || record.worker}</td>
                  <td>{workerName}</td>
                  <td>{site.siteName || record.site || "-"}</td>
                  <td>
                    {record.date ? new Date(record.date).toLocaleDateString("en-IN") : "-"}
                  </td>
                  <td>
                    <Status
                      status={record.status}
                      style={{ cursor: onChangeStatus ? 'pointer' : 'default' }}
                      onClick={() => onChangeStatus && onChangeStatus(record._id, record.status === "Present" ? "Absent" : "Present")}
                    >
                      {record.status || "Pending"}
                    </Status>
                  </td>
                  <td>
                    <ActionButtons>
                      <IconButton title="Mark/Edit Attendance" onClick={() => onMark(record)}>
                        <FiEdit2 />
                      </IconButton>
                      <IconButton title="Attendance History" onClick={() => onHistory(record)}>
                        <FiClock />
                      </IconButton>
                      {onDelete && (
                        <IconButton title="Delete Record" style={{ color: 'red' }} onClick={() => onDelete(record._id)}>
                          <FiTrash2 />
                        </IconButton>
                      )}
                    </ActionButtons>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </TableCard>
  );
};

export default AttendanceTable;