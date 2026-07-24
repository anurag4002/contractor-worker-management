import React, { useEffect, useState } from "react";
import useAttendance from "../../hooks/useAttendance";
import useSites from "../../hooks/useSites";
import useWorkers from "../../hooks/useWorkers";
import { Overlay, Modal, Header, Title, CloseButton, Form, FormGroup, Label, Select, TextArea, Footer, CancelButton, SaveButton } from "./MarkAttendanceModal.style";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../ui/FormError";
import LoadingButton from "../ui/LoadingButton";

// Used for both creating new attendance and editing existing records
const MarkAttendanceModal = ({ open, record, onClose }) => {
  const { addAttendance, updateAttendance, loading } = useAttendance();
  const { sites } = useSites();
  const { workers } = useWorkers();
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
      setFormData({
        worker: "", site: "",
        attendanceDate: new Date().toISOString().split("T")[0],
        status: "PRESENT", regularHours: 8, overtimeHours: 0, remarks: "",
      });
    }
  }, [open, record]);

  if (!open) return null;

  const { errors: apiErrors, clearFieldError, handleError } = useFormErrors();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name); // Clear error on change
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
    <Overlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <Modal>
        <Header>
          <Title id={titleId}>{isEdit ? "Edit Attendance" : "Mark Attendance"}</Title>
          <CloseButton onClick={onClose} aria-label="Close dialog">×</CloseButton>
        </Header>
        <Form onSubmit={handleSubmit}>
          {!isEdit && (
            <>
              <FormGroup>
                <Label>Worker *</Label>
                <Select name="worker" value={formData.worker} onChange={handleChange} required>
                  <option value="">-- Select Worker --</option>
                  {workersData.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.fullName || `${w.firstName || ''} ${w.lastName || ''}`.trim()}
                    </option>
                  ))}
                </Select>
                <FormError error={apiErrors.worker} />
              </FormGroup>
              <FormGroup>
                <Label>Site *</Label>
                <Select name="site" value={formData.site} onChange={handleChange} required>
                  <option value="">-- Select Site --</option>
                  {sitesData.map((s) => (
                    <option key={s._id} value={s._id}>{s.siteName}</option>
                  ))}
                </Select>
                <FormError error={apiErrors.site} />
              </FormGroup>
            </>
          )}

          {isEdit && (
            <>
              <FormGroup>
                <Label>Worker</Label>
                <Select disabled>
                  <option>{record?.worker?.fullName || record?.worker?.firstName || record?.worker || "—"}</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Site</Label>
                <Select disabled>
                  <option>{record?.site?.siteName || record?.site || "—"}</option>
                </Select>
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label>Attendance Date *</Label>
            <input
              type="date"
              name="attendanceDate"
              value={formData.attendanceDate}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #e2e8f0", width: "100%" }}
            />
            <FormError error={apiErrors.attendanceDate} />
          </FormGroup>

          <FormGroup>
            <Label>Attendance Status *</Label>
            <Select name="status" value={formData.status} onChange={handleChange}>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="LEAVE">Leave</option>
              <option value="HOLIDAY">Holiday</option>
            </Select>
            <FormError error={apiErrors.status} />
          </FormGroup>

          <FormGroup>
            <Label>Regular Hours</Label>
            <Select name="regularHours" value={formData.regularHours} onChange={handleChange}>
              {[...Array(13)].map((_, i) => (
                <option key={i} value={i}>{i} Hours</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Overtime Hours</Label>
            <Select name="overtimeHours" value={formData.overtimeHours} onChange={handleChange}>
              {[...Array(9)].map((_, i) => (
                <option key={i} value={i}>{i} Hours</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Remarks</Label>
            <TextArea
              rows="3"
              name="remarks"
              placeholder="Optional remark"
              value={formData.remarks}
              onChange={handleChange}
            />
            <FormError error={apiErrors.remarks} />
          </FormGroup>

          <Footer>
            <CancelButton type="button" onClick={onClose} disabled={loading}>Cancel</CancelButton>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText={isEdit ? "Updating..." : "Saving..."}
              style={{
                padding: "0.55rem 1.25rem", borderRadius: "0.6rem", fontSize: "0.95rem",
                fontWeight: 600, border: "none", cursor: "pointer", background: "#2563EB", color: "white"
              }}
            >
              {isEdit ? "Update Attendance" : "Save Attendance"}
            </LoadingButton>
          </Footer>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default MarkAttendanceModal;