import React, { useState, useEffect } from "react";
import usePayroll from "../../hooks/usePayroll";
import useWorkers from "../../hooks/useWorkers";
import useSites from "../../hooks/useSites";
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
  FormSelect,
  FormTextarea,
  SectionCard,
  SectionTitle,
  SecondaryButton,
  PrimaryButton,
} from "../ui/form";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../../components/ui/FormError";

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
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id={titleId}>Create Payroll</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <SectionCard>
              <SectionTitle>Payroll Details</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel $required>Worker</FormLabel>
                  <FormSelect name="worker" value={form.worker} onChange={handleChange} required>
                    <option value="">-- Select Worker --</option>
                    {workersData.map((w) => (
                      <option key={w._id} value={w._id}>
                        {w.fullName || `${w.firstName || ""} ${w.lastName || ""}`.trim()}
                      </option>
                    ))}
                  </FormSelect>
                  <FormError error={apiErrors.worker} />
                </FormField>

                <FormField>
                  <FormLabel $required>Site</FormLabel>
                  <FormSelect name="site" value={form.site} onChange={handleChange} required>
                    <option value="">-- Select Site --</option>
                    {sitesData.map((s) => <option key={s._id} value={s._id}>{s.siteName}</option>)}
                  </FormSelect>
                  <FormError error={apiErrors.site} />
                </FormField>

                <FormField>
                  <FormLabel $required>Month</FormLabel>
                  <FormSelect name="attendanceMonth" value={form.attendanceMonth} onChange={handleChange} required>
                    {MONTHS.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                  </FormSelect>
                  <FormError error={apiErrors.attendanceMonth} />
                </FormField>

                <FormField>
                  <FormLabel $required>Year</FormLabel>
                  <FormSelect name="attendanceYear" value={form.attendanceYear} onChange={handleChange} required>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </FormSelect>
                  <FormError error={apiErrors.attendanceYear} />
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
                  <FormTextarea name="remarks" rows="3" value={form.remarks} onChange={handleChange} placeholder="Optional..." />
                  <FormError error={apiErrors.remarks} />
                </FormField>
              </FormGrid>
            </SectionCard>

            <ModalFooter>
              <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting || loading}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Payroll"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreatePayrollModal;
