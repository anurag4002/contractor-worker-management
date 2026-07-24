import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import usePayroll from "../../hooks/usePayroll";
import {
    Overlay as ModalOverlay, Modal as ModalContent, Header as ModalHeader,
    Title as ModalTitle, CloseButton,
} from "../workermodal/WorkerModal.style";
import { Table, TableCard, Status } from "./Payroll.style";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const WorkerPayrollHistoryModal = ({ open, onClose, payroll }) => {
    const { workerHistory, fetchWorkerHistory, loading } = usePayroll();

    const workerId = payroll?.worker?._id || payroll?.worker;

    useEffect(() => {
        if (open && workerId) fetchWorkerHistory(workerId);
    }, [open, workerId]);

    if (!open || !payroll) return null;

    const worker = payroll.worker || {};
    const workerName = worker.fullName || `${worker.firstName || ""} ${worker.lastName || ""}`.trim();
    const history = Array.isArray(workerHistory) ? workerHistory : [];

    const titleId = "worker-payroll-history-modal-title";

    return (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle id={titleId}>Payroll History — {workerName}</ModalTitle>
                    <CloseButton type="button" onClick={onClose} aria-label="Close dialog"><FiX /></CloseButton>
                </ModalHeader>
                <div style={{ padding: "1rem 1.5rem 1.5rem" }}>
                    {loading ? (
                        <p style={{ color: "#64748b", textAlign: "center" }}>Loading history...</p>
                    ) : history.length === 0 ? (
                        <p style={{ color: "#64748b", textAlign: "center" }}>No payroll history found for this worker.</p>
                    ) : (
                        <TableCard style={{ marginTop: 0 }}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Month / Year</th>
                                        <th>Daily Wage</th>
                                        <th>Net Payable</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((p, i) => (
                                        <tr key={p._id || i}>
                                            <td>{i + 1}</td>
                                            <td>{MONTHS[p.attendanceMonth]} {p.attendanceYear}</td>
                                            <td>₹{(p.dailyWage || 0).toLocaleString("en-IN")}</td>
                                            <td style={{ fontWeight: 600 }}>₹{(p.netPayable || 0).toLocaleString("en-IN")}</td>
                                            <td><Status status={p.status}>{p.status}</Status></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </TableCard>
                    )}
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default WorkerPayrollHistoryModal;
