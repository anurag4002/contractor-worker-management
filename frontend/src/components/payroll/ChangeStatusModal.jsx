import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import usePayroll from "../../hooks/usePayroll";
import {
    Overlay as ModalOverlay, Modal as ModalContent, Header as ModalHeader,
    Title as ModalTitle, CloseButton, Form as ModalForm, FormGroup, Label, Select,
    Footer as ModalFooter, SaveButton, CancelButton,
} from "../workermodal/WorkerModal.style";

const ChangeStatusModal = ({ open, onClose, payroll }) => {
    const { changeStatus, loading } = usePayroll();
    const [status, setStatus] = useState("PENDING");

    useEffect(() => {
        if (open && payroll) setStatus(payroll.status || "PENDING");
    }, [open, payroll]);

    if (!open || !payroll) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await changeStatus(payroll._id, status);
            onClose();
        } catch { }
    };

    const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const worker = payroll.worker || {};
    const workerName = worker.fullName || `${worker.firstName || ""} ${worker.lastName || ""}`.trim();

    const titleId = "change-status-modal-title";

    return (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <ModalContent style={{ maxWidth: "30rem" }}>
                <ModalHeader>
                    <ModalTitle id={titleId}>Change Payroll Status</ModalTitle>
                    <CloseButton type="button" onClick={onClose} aria-label="Close dialog"><FiX /></CloseButton>
                </ModalHeader>
                <ModalForm onSubmit={handleSubmit}>
                    <FormGroup style={{ margin: "0 0 1rem" }}>
                        <Label>Payroll</Label>
                        <Select disabled>
                            <option>{workerName} — {MONTHS[payroll.attendanceMonth]} {payroll.attendanceYear}</option>
                        </Select>
                    </FormGroup>
                    <FormGroup>
                        <Label>New Status *</Label>
                        <Select value={status} onChange={(e) => setStatus(e.target.value)} required>
                            <option value="PENDING">Pending</option>
                            <option value="GENERATED">Generated</option>
                            <option value="PAID">Paid</option>
                            <option value="CANCELLED">Cancelled</option>
                        </Select>
                    </FormGroup>
                    <ModalFooter>
                        <CancelButton type="button" onClick={onClose} disabled={loading}>Cancel</CancelButton>
                        <SaveButton type="submit" disabled={loading}>{loading ? "Saving..." : "Update Status"}</SaveButton>
                    </ModalFooter>
                </ModalForm>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ChangeStatusModal;
