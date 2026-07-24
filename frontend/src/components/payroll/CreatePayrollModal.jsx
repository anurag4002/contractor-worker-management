import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import usePayroll from "../../hooks/usePayroll";
import useWorkers from "../../hooks/useWorkers";
import useSites from "../../hooks/useSites";
import {
    Overlay as ModalOverlay, Modal as ModalContent, Header as ModalHeader,
    Title as ModalTitle, CloseButton, Form as ModalForm, Grid, FormGroup, Label,
    Input, Select, TextArea, Footer as ModalFooter, SaveButton, CancelButton,
} from "../workermodal/WorkerModal.style";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../ui/FormError";
import LoadingButton from "../ui/LoadingButton";

const currentYear = new Date().getFullYear();
const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const initialState = {
    worker: "", site: "",
    attendanceMonth: new Date().getMonth() + 1,
    attendanceYear: currentYear,
    dailyWage: "", overtimeRate: 0,
    bonus: 0, deduction: 0, advanceDeduction: 0, remarks: "",
};

const CreatePayrollModal = ({ open, onClose }) => {
    const { createPayroll, loading } = usePayroll();
    const { workers } = useWorkers();
    const { sites } = useSites();
    const [form, setForm] = useState(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { errors: apiErrors, clearFieldError, handleError } = useFormErrors();

    useEffect(() => { if (open) setForm(initialState); }, [open]);
    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        clearFieldError(name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await createPayroll({
                ...form,
                dailyWage: Number(form.dailyWage),
                overtimeRate: Number(form.overtimeRate),
                bonus: Number(form.bonus),
                deduction: Number(form.deduction),
                advanceDeduction: Number(form.advanceDeduction),
                attendanceMonth: Number(form.attendanceMonth),
                attendanceYear: Number(form.attendanceYear),
            });
            onClose();
        } catch (error) {
            handleError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const workersData = Array.isArray(workers) ? workers : [];
    const sitesData = Array.isArray(sites) ? sites : [];

    const titleId = "create-payroll-modal-title";

    return (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle id={titleId}>Create Payroll</ModalTitle>
                    <CloseButton type="button" onClick={onClose} aria-label="Close dialog"><FiX /></CloseButton>
                </ModalHeader>
                <ModalForm onSubmit={handleSubmit}>
                    <Grid>
                        <FormGroup>
                            <Label>Worker *</Label>
                            <Select name="worker" value={form.worker} onChange={handleChange} required>
                                <option value="">-- Select Worker --</option>
                                {workersData.map((w) => (
                                    <option key={w._id} value={w._id}>
                                        {w.fullName || `${w.firstName || ""} ${w.lastName || ""}`.trim()}
                                    </option>
                                ))}
                            </Select>
                            <FormError error={apiErrors.worker} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Site *</Label>
                            <Select name="site" value={form.site} onChange={handleChange} required>
                                <option value="">-- Select Site --</option>
                                {sitesData.map((s) => <option key={s._id} value={s._id}>{s.siteName}</option>)}
                            </Select>
                            <FormError error={apiErrors.site} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Month *</Label>
                            <Select name="attendanceMonth" value={form.attendanceMonth} onChange={handleChange} required>
                                {MONTHS.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                            </Select>
                            <FormError error={apiErrors.attendanceMonth} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Year *</Label>
                            <Select name="attendanceYear" value={form.attendanceYear} onChange={handleChange} required>
                                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                            </Select>
                            <FormError error={apiErrors.attendanceYear} />
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
                            <TextArea name="remarks" rows="3" value={form.remarks} onChange={handleChange} placeholder="Optional..." />
                            <FormError error={apiErrors.remarks} />
                        </FormGroup>
                    </Grid>
                    <ModalFooter>
                        <CancelButton type="button" onClick={onClose} disabled={isSubmitting || loading}>Cancel</CancelButton>
                        <LoadingButton
                            type="submit"
                            loading={isSubmitting}
                            loadingText="Creating..."
                            style={{
                                background: "#2563EB", color: "white", padding: "0.55rem 1.25rem",
                                borderRadius: "0.6rem", fontSize: "0.95rem", fontWeight: 600,
                                border: "none", cursor: "pointer", transition: "all 0.2s"
                            }}
                        >
                            Create Payroll
                        </LoadingButton>
                    </ModalFooter>
                </ModalForm>
            </ModalContent>
        </ModalOverlay>
    );
};

export default CreatePayrollModal;
