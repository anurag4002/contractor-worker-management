import React from "react";
import { FiEdit2, FiTrash2, FiEye, FiRefreshCw } from "react-icons/fi";
import {
  TableCard,
  Table,
  Status,
  ActionButtons,
  IconButton,
  CardList,
  CardItem,
  CardHeader,
  CardName,
  CardSub,
  CardBody,
  CardField,
  CardLabel,
  CardValue,
  CardActions,
} from "./Payroll.style";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const PayrollTable = ({ payrolls = [], onEdit, onDelete, onViewHistory, onChangeStatus }) => {
    const renderCard = (p, index) => {
        const worker = p.worker || {};
        const site = p.site || {};
        const workerName = worker.fullName || `${worker.firstName || ""} ${worker.lastName || ""}`.trim() || "—";
        return (
            <CardItem key={`card-${p._id || index}`}>
                <CardHeader>
                    <div style={{ minWidth: 0 }}>
                        <CardName>{workerName}</CardName>
                        <CardSub>{site.siteName || "—"}</CardSub>
                    </div>
                    <Status $status={p.status}>{p.status || "PENDING"}</Status>
                </CardHeader>
                <CardBody>
                    <CardField>
                        <CardLabel>Month / Year</CardLabel>
                        <CardValue>
                            {MONTHS[p.attendanceMonth] || "—"} {p.attendanceYear || ""}
                        </CardValue>
                    </CardField>
                    <CardField>
                        <CardLabel>Daily Wage</CardLabel>
                        <CardValue>{formatINR(p.dailyWage)}</CardValue>
                    </CardField>
                    <CardField>
                        <CardLabel>Net Payable</CardLabel>
                        <CardValue style={{ fontWeight: 600 }}>{formatINR(p.netPayable)}</CardValue>
                    </CardField>
                </CardBody>
                <CardActions>
                    <IconButton title="View Worker History" onClick={() => onViewHistory && onViewHistory(p)}>
                        <FiEye />
                    </IconButton>
                    <IconButton title="Edit Payroll" onClick={() => onEdit && onEdit(p)}>
                        <FiEdit2 />
                    </IconButton>
                    <IconButton title="Change Status" onClick={() => onChangeStatus && onChangeStatus(p)}>
                        <FiRefreshCw />
                    </IconButton>
                    <IconButton title="Delete Payroll" style={{ color: "var(--danger)" }} onClick={() => onDelete && onDelete(p)}>
                        <FiTrash2 />
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
                        <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
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
                                <td>{formatINR(p.dailyWage)}</td>
                                <td style={{ fontWeight: 600 }}>{formatINR(p.netPayable)}</td>
                                <td>
                                    <Status $status={p.status}>{p.status || "PENDING"}</Status>
                                </td>
                                <td>
                                    <ActionButtons>
                                        <IconButton title="View Worker History" onClick={() => onViewHistory && onViewHistory(p)}>
                                            <FiEye />
                                        </IconButton>
                                        <IconButton title="Edit Payroll" onClick={() => onEdit && onEdit(p)}>
                                            <FiEdit2 />
                                        </IconButton>
                                        <IconButton title="Change Status" onClick={() => onChangeStatus && onChangeStatus(p)}>
                                            <FiRefreshCw />
                                        </IconButton>
                                        <IconButton title="Delete Payroll" style={{ color: "var(--danger)" }} onClick={() => onDelete && onDelete(p)}>
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
        <CardList>
            {payrolls.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                    No payroll records found.
                </div>
            ) : (
                payrolls.map((p, i) => renderCard(p, i))
            )}
        </CardList>
    </TableCard>
    );
};

export default PayrollTable;
