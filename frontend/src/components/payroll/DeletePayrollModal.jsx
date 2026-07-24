import React from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import usePayroll from "../../hooks/usePayroll";
import {
    Overlay as ModalOverlay, Modal as ModalContent, Header as ModalHeader,
    Title as ModalTitle, CloseButton, Footer as ModalFooter, SaveButton, CancelButton,
} from "../workermodal/WorkerModal.style";

const DeletePayrollModal = ({ open, onClose, payroll }) => {
    const { deletePayroll, loading } = usePayroll();
    if (!open || !payroll) return null;

    const worker = payroll.worker || {};
    const workerName = worker.fullName || `${worker.firstName || ""} ${worker.lastName || ""}`.trim();
    const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const handleDelete = async () => {
        try {
            await deletePayroll(payroll._id);
            onClose();
        } catch { }
    };

    const titleId = "delete-payroll-modal-title";

    return (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <ModalContent style={{ maxWidth: "32rem" }}>
                <ModalHeader>
                    <ModalTitle id={titleId} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#dc2626" }}>
                        <FiAlertTriangle /> Delete Payroll
                    </ModalTitle>
                    <CloseButton type="button" onClick={onClose} aria-label="Close dialog"><FiX /></CloseButton>
                </ModalHeader>
                <div style={{ padding: "1.5rem" }}>
                    <p>
                        Are you sure you want to delete the payroll for{" "}
                        <strong>{workerName}</strong> for{" "}
                        <strong>{MONTHS[payroll.attendanceMonth]} {payroll.attendanceYear}</strong>?
                    </p>
                    <p style={{ color: "#64748b", fontSize: "0.875rem" }}>This action cannot be undone.</p>
                </div>
                <ModalFooter>
                    <CancelButton type="button" onClick={onClose} disabled={loading}>Cancel</CancelButton>
                    <SaveButton type="button" style={{ background: "#dc2626" }} onClick={handleDelete} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </SaveButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default DeletePayrollModal;
