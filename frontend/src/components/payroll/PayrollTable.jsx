import React from "react";
import { FiEdit2, FiTrash2, FiEye, FiRefreshCw } from "react-icons/fi";
import { TableCard, Table, Status, ActionButtons, IconButton } from "./Payroll.style";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PayrollTable = ({ payrolls = [], onEdit, onDelete, onViewHistory, onChangeStatus }) => (
    <TableCard>
        <Table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Worker</th>
                    <th>Site</th>
                    <th>Month / Year</th>
                    <th>Daily Wage</th>
                    <th>Net Payable</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {payrolls.length === 0 ? (
                    <tr>
                        <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                            No payroll records found.
                        </td>
                    </tr>
                ) : (
                    payrolls.map((p, index) => {
                        const worker = p.worker || {};
                        const site = p.site || {};
                        const workerName = worker.fullName || `${worker.firstName || ""} ${worker.lastName || ""}`.trim() || "—";

                        return (
                            <tr key={p._id || index}>
                                <td>{index + 1}</td>
                                <td>{workerName}</td>
                                <td>{site.siteName || "—"}</td>
                                <td>{MONTHS[p.attendanceMonth] || "—"} {p.attendanceYear || ""}</td>
                                <td>₹{(p.dailyWage || 0).toLocaleString("en-IN")}</td>
                                <td style={{ fontWeight: 600 }}>₹{(p.netPayable || 0).toLocaleString("en-IN")}</td>
                                <td>
                                    <Status status={p.status}>{p.status || "PENDING"}</Status>
                                </td>
                                <td>
                                    <ActionButtons>
                                        <IconButton title="View Worker History" onClick={() => onViewHistory(p)}>
                                            <FiEye />
                                        </IconButton>
                                        <IconButton title="Edit Payroll" onClick={() => onEdit(p)}>
                                            <FiEdit2 />
                                        </IconButton>
                                        <IconButton title="Change Status" onClick={() => onChangeStatus(p)}>
                                            <FiRefreshCw />
                                        </IconButton>
                                        <IconButton title="Delete Payroll" style={{ color: "#dc2626" }} onClick={() => onDelete(p)}>
                                            <FiTrash2 />
                                        </IconButton>
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

export default PayrollTable;
