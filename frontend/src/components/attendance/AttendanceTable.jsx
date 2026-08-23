import React from "react";
import { FiClock, FiEdit2, FiTrash2 } from "react-icons/fi";
import { TableCard, Table, Status, ActionButtons, IconButton, AttendanceCardList, AttendanceCard, AttendanceCardHeader, AttendanceCardIdentity, AttendanceCardName, AttendanceCardMeta, AttendanceCardBody, AttendanceCardField, AttendanceCardLabel, AttendanceCardValue, AttendanceCardActions } from "./AttendanceTable.style";

const AttendanceTable = ({ records = [], onHistory, onMark, onDelete, onChangeStatus }) => {
  const renderMobileCard = (record, index) => {
    const worker = record.worker || {};
    const site = record.site || {};
    const workerName = worker.fullName || worker.firstName + " " + worker.lastName || "Unknown";

    return (
      <AttendanceCard key={`card-${record._id || index}`}>
        <AttendanceCardHeader>
          <AttendanceCardIdentity>
            {worker.photo ? (
              <img src={worker.photo} alt={workerName} style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "42px", height: "42px", borderRadius: "50%",
                background: "var(--primary)", color: "var(--text-on-primary)", display: "flex",
                justifyContent: "center", alignItems: "center", fontWeight: 600, flexShrink: 0,
              }}>
                {workerName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div>
              <AttendanceCardName>{workerName}</AttendanceCardName>
              <AttendanceCardMeta>{site.siteName || record.site || "No Site"}</AttendanceCardMeta>
            </div>
          </AttendanceCardIdentity>
          <Status $status={record.status} style={{ cursor: onChangeStatus ? 'pointer' : 'default' }}
            onClick={() => onChangeStatus && onChangeStatus(record._id, record.status === "Present" ? "Absent" : "Present")}>
            {record.status || "Pending"}
          </Status>
        </AttendanceCardHeader>
        <AttendanceCardBody>
          <AttendanceCardField>
            <AttendanceCardLabel>Date</AttendanceCardLabel>
            <AttendanceCardValue>{record.date ? new Date(record.date).toLocaleDateString("en-IN") : "-"}</AttendanceCardValue>
          </AttendanceCardField>
          <AttendanceCardField>
            <AttendanceCardLabel>Worker ID</AttendanceCardLabel>
            <AttendanceCardValue>{worker._id || worker.workerId || record.worker || "-"}</AttendanceCardValue>
          </AttendanceCardField>
        </AttendanceCardBody>
        <AttendanceCardActions>
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
        </AttendanceCardActions>
      </AttendanceCard>
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
              <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
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
                      <img src={worker.photo} alt={workerName} style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{
                        width: "42px", height: "42px", borderRadius: "50%",
                        background: "var(--primary)", color: "var(--text-on-primary)", display: "flex",
                        justifyContent: "center", alignItems: "center", fontWeight: 600,
                      }}>
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
                      $status={record.status}
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

      <AttendanceCardList>
        {records.length === 0 ? (
          <AttendanceCard>
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              No attendance records found.
            </div>
          </AttendanceCard>
        ) : (
          records.map((record, index) => renderMobileCard(record, index))
        )}
      </AttendanceCardList>
    </TableCard>
  );
};

export default AttendanceTable;
