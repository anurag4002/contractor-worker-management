import { useState, useEffect } from "react";

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
  FormSelect,
  SectionCard,
  SectionTitle,
  SecondaryButton,
  PrimaryButton,
} from "../ui/form";

const currentYear = new Date().getFullYear();
const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const GenerateSalaryModal = ({ open, onClose, listParams = { page: 1, limit: 10 } }) => {
  const { generateSalaryFromAttendance, loading } = usePayroll();
  const [attendanceMonth, setAttendanceMonth] = useState(new Date().getMonth() + 1);
  const [attendanceYear, setAttendanceYear] = useState(currentYear);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setAttendanceMonth(new Date().getMonth() + 1);
      setAttendanceYear(currentYear);
    }
  }, [open]);

  if (!open) return null;

  const isGenerating = loading || isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await generateSalaryFromAttendance(
        {
          attendanceMonth: Number(attendanceMonth),
          attendanceYear: Number(attendanceYear),
        },
        listParams
      );
      onClose();
    } catch {
      // Error feedback is surfaced through the existing toast handler in PayrollContext.
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleId = "generate-salary-modal-title";

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id={titleId}>Generate Salary</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <SectionCard>
              <SectionTitle>Salary Generation</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel $required>Attendance Month</FormLabel>
                  <FormSelect name="attendanceMonth" value={attendanceMonth} onChange={(e) => setAttendanceMonth(Number(e.target.value))} required>
                    {MONTHS.slice(1).map((m, i) => (
                      <option key={i + 1} value={i + 1}>{m}</option>
                    ))}
                  </FormSelect>
                </FormField>

                <FormField>
                  <FormLabel $required>Attendance Year</FormLabel>
                  <FormSelect name="attendanceYear" value={attendanceYear} onChange={(e) => setAttendanceYear(Number(e.target.value))} required>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </FormSelect>
                </FormField>
              </FormGrid>
              <p style={{ margin: "0 0 1rem", color: "var(--text-secondary)", fontSize: ".9rem" }}>
                Salary records will be generated from attendance records for the selected month and year.
              </p>
            </SectionCard>

            <ModalFooter>
              <SecondaryButton type="button" onClick={onClose} disabled={isGenerating}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={isGenerating || !attendanceMonth || !attendanceYear}>
                {isGenerating ? "Generating..." : "Generate Salary"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default GenerateSalaryModal;
