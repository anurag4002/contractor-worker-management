import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import usePayroll from "../../hooks/usePayroll";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  SecondaryButton,
  DangerButton,
} from "../ui/form";

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
      <ModalContainer style={{ maxWidth: "32rem" }}>
        <ModalHeader>
          <ModalTitle id={titleId} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)" }}>
            <FiAlertTriangle /> Delete Payroll
          </ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <p>
            Are you sure you want to delete the payroll for{" "}
            <strong>{workerName}</strong> for{" "}
            <strong>{MONTHS[payroll.attendanceMonth]} {payroll.attendanceYear}</strong>?
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>This action cannot be undone.</p>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton type="button" onClick={onClose} disabled={loading}>
            Cancel
          </SecondaryButton>
          <DangerButton type="button" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </DangerButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DeletePayrollModal;
