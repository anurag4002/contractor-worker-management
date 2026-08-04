import React, {
  useEffect,
  useState,
} from "react";

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
  SectionCard,
  SectionTitle,
  SecondaryButton,
  PrimaryButton,
} from "../ui/form";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../../components/ui/FormError";

const defaultWorker = {
  id: "",
  name: "",
  mobile: "",
  photo: "",
  skill: "",
  workType: "",
  wageType: "Daily",
  dailyWage: "",
  monthlySalary: "",
  joiningDate: "",
  site: "Site A",
  status: "Active",
};

const EditWorkerModal = ({
  open,
  worker,
  onClose,
  onUpdateWorker,
}) => {
  const [form, setForm] = useState(defaultWorker);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors: apiErrors, clearFieldError, handleError } = useFormErrors();

  useEffect(() => {
    if (worker) {
      setForm({
        ...defaultWorker,
        ...worker,
      });
    }
  }, [worker]);

  if (!open || !worker) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.name.trim() === "" ||
      form.mobile.trim() === "" ||
      form.skill.trim() === "" ||
      form.workType.trim() === ""
    ) {
      handleError({ response: { data: { message: "Please fill all required fields." } } });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      handleError({ response: { data: { message: "Enter a valid mobile number.", errors: { mobile: "Invalid mobile number" } } } });
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdateWorker(form.id, {
        fullName: form.name,
        mobileNumber: form.mobile,
        trade: form.skill,
        salaryType: form.wageType === "Daily" ? "DAILY" : "MONTHLY",
        dailyWage: form.wageType === "Daily" ? Number(form.dailyWage) : 0,
        monthlySalary: form.wageType === "Monthly" ? Number(form.monthlySalary) : 0,
      });
      onClose();
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleId = "edit-worker-modal-title";

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id={titleId}>Edit Worker</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <SectionCard>
              <SectionTitle>Personal Information</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel>Worker ID</FormLabel>
                  <FormInput value={form.id} disabled />
                </FormField>

                <FormField>
                  <FormLabel $required>Worker Name</FormLabel>
                  <FormInput
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <FormError error={apiErrors.name || apiErrors.fullName} />
                </FormField>

                <FormField>
                  <FormLabel $required>Mobile Number</FormLabel>
                  <FormInput
                    type="tel"
                    maxLength={10}
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                  />
                  <FormError error={apiErrors.mobile || apiErrors.mobileNumber} />
                </FormField>

                <FormField>
                  <FormLabel>Photo URL</FormLabel>
                  <FormInput
                    name="photo"
                    value={form.photo}
                    onChange={handleChange}
                    placeholder="https://image-url"
                  />
                  <FormError error={apiErrors.photo} />
                </FormField>

                <FormField>
                  <FormLabel $required>Skill</FormLabel>
                  <FormInput
                    name="skill"
                    value={form.skill}
                    onChange={handleChange}
                    required
                  />
                  <FormError error={apiErrors.skill || apiErrors.trade} />
                </FormField>

                <FormField>
                  <FormLabel $required>Work Type</FormLabel>
                  <FormInput
                    name="workType"
                    value={form.workType}
                    onChange={handleChange}
                    required
                  />
                  <FormError error={apiErrors.workType} />
                </FormField>

                <FormField>
                  <FormLabel>Wage Type</FormLabel>
                  <FormSelect
                    name="wageType"
                    value={form.wageType}
                    onChange={handleChange}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Monthly">Monthly</option>
                  </FormSelect>
                </FormField>

                {form.wageType === "Daily" ? (
                  <FormField>
                    <FormLabel $required>Daily Wage</FormLabel>
                    <FormInput
                      type="number"
                      name="dailyWage"
                      value={form.dailyWage}
                      onChange={handleChange}
                    />
                    <FormError error={apiErrors.dailyWage} />
                  </FormField>
                ) : (
                  <FormField>
                    <FormLabel $required>Monthly Salary</FormLabel>
                    <FormInput
                      type="number"
                      name="monthlySalary"
                      value={form.monthlySalary}
                      onChange={handleChange}
                    />
                    <FormError error={apiErrors.monthlySalary} />
                  </FormField>
                )}

                <FormField>
                  <FormLabel $required>Joining Date</FormLabel>
                  <FormInput
                    type="date"
                    name="joiningDate"
                    value={form.joiningDate}
                    onChange={handleChange}
                  />
                  <FormError error={apiErrors.joiningDate} />
                </FormField>

                <FormField>
                  <FormLabel>Site</FormLabel>
                  <FormSelect
                    name="site"
                    value={form.site}
                    onChange={handleChange}
                  >
                    <option>Site A</option>
                    <option>Site B</option>
                    <option>Site C</option>
                    <option>Site D</option>
                  </FormSelect>
                </FormField>

                <FormField>
                  <FormLabel>Status</FormLabel>
                  <FormSelect
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </FormSelect>
                </FormField>
              </FormGrid>
            </SectionCard>

            {form.photo && (
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <img
                  src={form.photo}
                  alt={form.name}
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--border)",
                  }}
                />
              </div>
            )}

            <ModalFooter>
              <SecondaryButton type="button" onClick={onClose}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Worker"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditWorkerModal;
