import React, { useEffect, useState } from "react";
import useAttendance from "../../hooks/useAttendance";
import useSites from "../../hooks/useSites";
import useWorkers from "../../hooks/useWorkers";
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
  FormInput,
  FormTextarea,
  SectionCard,
  SectionTitle,
  SecondaryButton,
  PrimaryButton,
} from "../ui/form";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../../components/ui/FormError";

const MarkAttendanceModal = ({ open, record, onClose }) => {
  const { addAttendance, updateAttendance, loading } = useAttendance();
  const { sites } = useSites();
  const { workers } = useWorkers();
  const { errors: apiErrors, clearFieldError, handleError, clearAllErrors } = useFormErrors();
  const workersData = Array.isArray(workers) ? workers : [];

  const isEdit = !!(record && record._id);

  const [formData, setFormData] = useState({
    worker: "",
    site: "",
    attendanceDate: new Date().toISOString().split("T")[0],
    status: "PRESENT",
    regularHours: 8,
    overtimeHours: 0,
    remarks: "",
  });

  useEffect(() => {
    if (open && record) {
      clearAllErrors();
      setFormData({
        worker: record.worker?._id || record.worker || "",
        site: record.site?._id || record.site || "",
        attendanceDate: record.attendanceDate
          ? record.attendanceDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: record.status || "PRESENT",
        regularHours: record.regularHours ?? 8,
        overtimeHours: record.overtimeHours ?? 0,
        remarks: record.remarks || "",
      });
    } else if (open && !record) {
      clearAllErrors();
      setFormData({
        worker: "", site: "",
        attendanceDate: new Date().toISOString().split("T")[0],
        status: "PRESENT", regularHours: 8, overtimeHours: 0, remarks: "",
      });
    }
  }, [open, record]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      regularHours: Number(formData.regularHours),
      overtimeHours: Number(formData.overtimeHours),
    };
    try {
      if (isEdit) {
        await updateAttendance(record._id, payload);
      } else {
        await addAttendance(payload);
      }
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

  const sitesData = Array.isArray(sites) ? sites : [];

  const titleId = "mark-attendance-modal-title";

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id={titleId}>{isEdit ? "Edit Attendance" : "Mark Attendance"}</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <SectionCard>
              <SectionTitle>Attendance Details</SectionTitle>
              <FormGrid>
                {!isEdit && (
                  <>
                    <FormField>
                      <FormLabel $required>Worker</FormLabel>
                      <FormSelect name="worker" value={formData.worker} onChange={handleChange} required>
                        <option value="">-- Select Worker --</option>
                        {workersData.map((w) => (
                          <option key={w._id} value={w._id}>
                            {w.fullName || `${w.firstName || ''} ${w.lastName || ''}`.trim()}
                          </option>
                        ))}
                      </FormSelect>
                      <FormError error={apiErrors.worker} />
                    </FormField>
                    <FormField>
                      <FormLabel $required>Site</FormLabel>
                      <FormSelect name="site" value={formData.site} onChange={handleChange} required>
                        <option value="">-- Select Site --</option>
                        {sitesData.map((s) => (
                          <option key={s._id} value={s._id}>{s.siteName}</option>
                        ))}
                      </FormSelect>
                      <FormError error={apiErrors.site} />
                    </FormField>
                  </>
                )}

                {isEdit && (
                  <>
                    <FormField>
                      <FormLabel>Worker</FormLabel>
                      <FormSelect disabled>
                        <option>{record?.worker?.fullName || record?.worker?.firstName || record?.worker || "—"}</option>
                      </FormSelect>
                    </FormField>
                    <FormField>
                      <FormLabel>Site</FormLabel>
                      <FormSelect disabled>
                        <option>{record?.site?.siteName || record?.site || "—"}</option>
                      </FormSelect>
                    </FormField>
                  </>
                )}

                <FormField>
                  <FormLabel $required>Attendance Date</FormLabel>
                  <FormInput
                    type="date"
                    name="attendanceDate"
                    value={formData.attendanceDate}
                    onChange={handleChange}
                    required
                  />
                  <FormError error={apiErrors.attendanceDate} />
                </FormField>

                <FormField>
                  <FormLabel $required>Attendance Status</FormLabel>
                  <FormSelect name="status" value={formData.status} onChange={handleChange}>
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="HALF_DAY">Half Day</option>
                    <option value="LEAVE">Leave</option>
                    <option value="HOLIDAY">Holiday</option>
                  </FormSelect>
                  <FormError error={apiErrors.status} />
                </FormField>

                <FormField>
                  <FormLabel>Regular Hours</FormLabel>
                  <FormSelect name="regularHours" value={formData.regularHours} onChange={handleChange}>
                    {[...Array(13)].map((_, i) => (
                      <option key={i} value={i}>{i} Hours</option>
                    ))}
                  </FormSelect>
                </FormField>

                <FormField>
                  <FormLabel>Overtime Hours</FormLabel>
                  <FormSelect name="overtimeHours" value={formData.overtimeHours} onChange={handleChange}>
                    {[...Array(9)].map((_, i) => (
                      <option key={i} value={i}>{i} Hours</option>
                    ))}
                  </FormSelect>
                </FormField>

                <FormField style={{ gridColumn: "1 / -1" }}>
                  <FormLabel>Remarks</FormLabel>
                  <FormTextarea
                    rows="3"
                    name="remarks"
                    placeholder="Optional remark"
                    value={formData.remarks}
                    onChange={handleChange}
                  />
                  <FormError error={apiErrors.remarks} />
                </FormField>
              </FormGrid>
            </SectionCard>

            <ModalFooter>
              <SecondaryButton type="button" onClick={onClose} disabled={loading}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update Attendance" : "Save Attendance")}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default MarkAttendanceModal;
