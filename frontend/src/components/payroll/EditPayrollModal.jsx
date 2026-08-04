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
  FormGrid,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  SectionCard,
  SectionTitle,
  SecondaryButton,
  PrimaryButton,
} from "../ui/form";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../../components/ui/FormError";

const EditPayrollModal = ({ open, onClose, payroll }) => {
  const { updatePayroll, loading } = usePayroll();
  const [form, setForm] = useState({ dailyWage: 0, overtimeRate: 0, bonus: 0, deduction: 0, advanceDeduction: 0, remarks: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors: apiErrors, clearFieldError, handleError } = useFormErrors();

  useEffect(() => {
    if (open && payroll) {
      setForm({
        dailyWage: payroll.dailyWage || 0,
        overtimeRate: payroll.overtimeRate || 0,
        bonus: payroll.bonus || 0,
        deduction: payroll.deduction || 0,
        advanceDeduction: payroll.advanceDeduction || 0,
        remarks: payroll.remarks || "",
      });
    }
  }, [open, payroll]);

  if (!open || !payroll) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updatePayroll(payroll._id, {
        dailyWage: Number(form.dailyWage),
        overtimeRate: Number(form.overtimeRate),
        bonus: Number(form.bonus),
        deduction: Number(form.deduction),
        advanceDeduction: Number(form.advanceDeduction),
        remarks: form.remarks,
      });
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const worker = payroll.worker || {};
  const workerName = worker.fullName || `${worker.firstName || ""} ${worker.lastName || ""}`.trim();
  const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const titleId = "edit-payroll-modal-title";

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id={titleId}>Edit Payroll</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <SectionCard>
              <SectionTitle>Payroll Information</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel>Worker</FormLabel>
                  <FormInput value={workerName || "—"} disabled />
                </FormField>

                <FormField>
                  <FormLabel>Month / Year</FormLabel>
                  <FormInput value={`${MONTHS[payroll.attendanceMonth] || ""} ${payroll.attendanceYear || ""}`} disabled />
                </FormField>

                <FormField>
                  <FormLabel $required>Daily Wage (₹)</FormLabel>
                  <FormInput type="number" name="dailyWage" value={form.dailyWage} onChange={handleChange} min="0" required />
                  <FormError error={apiErrors.dailyWage} />
                </FormField>

                <FormField>
                  <FormLabel>Overtime Rate (₹/hr)</FormLabel>
                  <FormInput type="number" name="overtimeRate" value={form.overtimeRate} onChange={handleChange} min="0" />
                  <FormError error={apiErrors.overtimeRate} />
                </FormField>

                <FormField>
                  <FormLabel>Bonus (₹)</FormLabel>
                  <FormInput type="number" name="bonus" value={form.bonus} onChange={handleChange} min="0" />
                  <FormError error={apiErrors.bonus} />
                </FormField>

                <FormField>
                  <FormLabel>Deduction (₹)</FormLabel>
                  <FormInput type="number" name="deduction" value={form.deduction} onChange={handleChange} min="0" />
                  <FormError error={apiErrors.deduction} />
                </FormField>

                <FormField>
                  <FormLabel>Advance Deduction (₹)</FormLabel>
                  <FormInput type="number" name="advanceDeduction" value={form.advanceDeduction} onChange={handleChange} min="0" />
                  <FormError error={apiErrors.advanceDeduction} />
                </FormField>

                <FormField style={{ gridColumn: "1 / -1" }}>
                  <FormLabel>Remarks</FormLabel>
                  <FormTextarea name="remarks" rows="3" value={form.remarks} onChange={handleChange} />
                  <FormError error={apiErrors.remarks} />
                </FormField>
              </FormGrid>
            </SectionCard>

            <ModalFooter>
              <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting || loading}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Payroll"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditPayrollModal;
