import React, { useState, useEffect } from "react";
import usePayroll from "../../hooks/usePayroll";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormField,
  FormLabel,
  FormSelect,
  FormInput,
  SectionCard,
  SectionTitle,
  SecondaryButton,
  PrimaryButton,
} from "../ui/form";
import FormError from "../../components/ui/FormError";

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
      <ModalContainer style={{ maxWidth: "30rem" }}>
        <ModalHeader>
          <ModalTitle id={titleId}>Change Payroll Status</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <SectionCard>
              <SectionTitle>Payroll Status</SectionTitle>
              <FormField>
                <FormLabel>Payroll</FormLabel>
                <FormSelect disabled>
                  <option>{workerName} — {MONTHS[payroll.attendanceMonth]} {payroll.attendanceYear}</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel $required>New Status</FormLabel>
                <FormSelect value={status} onChange={(e) => setStatus(e.target.value)} required>
                  <option value="PENDING">Pending</option>
                  <option value="GENERATED">Generated</option>
                  <option value="PAID">Paid</option>
                  <option value="CANCELLED">Cancelled</option>
                </FormSelect>
                <FormError error={undefined} />
              </FormField>
            </SectionCard>

            <ModalFooter>
              <SecondaryButton type="button" onClick={onClose} disabled={loading}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update Status"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ChangeStatusModal;
