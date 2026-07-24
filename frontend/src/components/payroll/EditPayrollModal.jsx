import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import usePayroll from "../../hooks/usePayroll";
import {
    Overlay as ModalOverlay, Modal as ModalContent, Header as ModalHeader,
    Title as ModalTitle, CloseButton, Form as ModalForm, Grid, FormGroup, Label,
    Input, TextArea, Footer as ModalFooter, SaveButton, CancelButton,
} from "../workermodal/WorkerModal.style";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../ui/FormError";
import LoadingButton from "../ui/LoadingButton";

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
            <ModalContent>
                <ModalHeader>
                    <ModalTitle id={titleId}>Edit Payroll</ModalTitle>
                    <CloseButton type="button" onClick={onClose} aria-label="Close dialog"><FiX /></CloseButton>
                </ModalHeader>
                <ModalForm onSubmit={handleSubmit}>
                    <Grid>
                        <FormGroup>
                            <Label>Worker</Label>
                            <Input value={workerName || "—"} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label>Month / Year</Label>
                            <Input value={`${MONTHS[payroll.attendanceMonth] || ""} ${payroll.attendanceYear || ""}`} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label>Daily Wage (₹) *</Label>
                            <Input type="number" name="dailyWage" value={form.dailyWage} onChange={handleChange} min="0" required />
                            <FormError error={apiErrors.dailyWage} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Overtime Rate (₹/hr)</Label>
                            <Input type="number" name="overtimeRate" value={form.overtimeRate} onChange={handleChange} min="0" />
                            <FormError error={apiErrors.overtimeRate} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Bonus (₹)</Label>
                            <Input type="number" name="bonus" value={form.bonus} onChange={handleChange} min="0" />
                            <FormError error={apiErrors.bonus} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Deduction (₹)</Label>
                            <Input type="number" name="deduction" value={form.deduction} onChange={handleChange} min="0" />
                            <FormError error={apiErrors.deduction} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Advance Deduction (₹)</Label>
                            <Input type="number" name="advanceDeduction" value={form.advanceDeduction} onChange={handleChange} min="0" />
                            <FormError error={apiErrors.advanceDeduction} />
                        </FormGroup>
                        <FormGroup style={{ gridColumn: "1 / -1" }}>
                            <Label>Remarks</Label>
                            <TextArea name="remarks" rows="3" value={form.remarks} onChange={handleChange} />
                            <FormError error={apiErrors.remarks} />
                        </FormGroup>
                    </Grid>
                    <ModalFooter>
                        <CancelButton type="button" onClick={onClose} disabled={isSubmitting || loading}>Cancel</CancelButton>
                        <LoadingButton
                            type="submit"
                            loading={isSubmitting}
                            loadingText="Updating..."
                            style={{
                                background: "#2563EB", color: "white", padding: "0.55rem 1.25rem",
                                borderRadius: "0.6rem", fontSize: "0.95rem", fontWeight: 600,
                                border: "none", cursor: "pointer", transition: "all 0.2s"
                            }}
                        >
                            Update Payroll
                        </LoadingButton>
                    </ModalFooter>
                </ModalForm>
            </ModalContent>
        </ModalOverlay>
    );
};

export default EditPayrollModal;
