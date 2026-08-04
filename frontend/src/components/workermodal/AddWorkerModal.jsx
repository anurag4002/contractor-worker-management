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
  FormDatePicker,
  FormSelect,
  SectionCard,
  SectionTitle,
  SecondaryButton,
  PrimaryButton,
} from "../ui/form";

import { showSuccess } from "../../components/common/toast";
import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../../components/ui/FormError";

const initialState = {
  fullName: "",
  fatherName: "",
  mobileNumber: "",
  alternateMobileNumber: "",
  email: "",
  gender: "",
  dateOfBirth: "",
  bloodGroup: "",
  aadhaarNumber: "",
  panNumber: "",
  esicNumber: "",
  pfNumber: "",
  address: "",
  state: "",
  district: "",
  city: "",
  pincode: "",
  trade: "",
  skillLevel: "",
  joiningDate: "",
  salaryType: "DAILY",
  dailyWage: "",
  monthlySalary: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  relationship: "",
};

const tradeOptions = [
  { label: "Electrician", value: "ELECTRICIAN" },
  { label: "Plumber", value: "PLUMBER" },
  { label: "Welder", value: "WELDER" },
  { label: "Carpenter", value: "CARPENTER" },
  { label: "Mason", value: "MASON" },
  { label: "Painter", value: "PAINTER" },
  { label: "Helper", value: "HELPER" },
  { label: "Fitter", value: "FITTER" },
  { label: "Operator", value: "OPERATOR" },
  { label: "Supervisor", value: "SUPERVISOR" },
  { label: "Steel Fixer", value: "STEEL_FIXER" },
  { label: "Bar Bender", value: "BAR_BENDER" },
  { label: "Scaffolder", value: "SCAFFOLDER" },
  { label: "Machine Operator", value: "MACHINE_OPERATOR" },
  { label: "Driver", value: "DRIVER" },
  { label: "Security Guard", value: "SECURITY_GUARD" },
  { label: "Cleaner", value: "CLEANER" },
  { label: "Store Keeper", value: "STORE_KEEPER" },
  { label: "Other", value: "OTHER" },
];

const skillLevelOptions = [
  { label: "Highly Skilled", value: "HIGHLY_SKILLED" },
  { label: "Skilled", value: "SKILLED" },
  { label: "Semi Skilled", value: "SEMI_SKILLED" },
  { label: "Unskilled", value: "UNSKILLED" },
];

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const salaryTypeOptions = [
  { label: "Daily", value: "DAILY" },
  { label: "Monthly", value: "MONTHLY" },
];

const relationshipOptions = [
  { label: "Father", value: "FATHER" },
  { label: "Mother", value: "MOTHER" },
  { label: "Brother", value: "BROTHER" },
  { label: "Sister", value: "SISTER" },
  { label: "Spouse", value: "SPOUSE" },
  { label: "Guardian", value: "GUARDIAN" },
  { label: "Friend", value: "FRIEND" },
  { label: "Relative", value: "RELATIVE" },
  { label: "Other", value: "OTHER" },
];

const AddWorkerModal = ({
  open,
  onClose,
  onAddWorker,
}) => {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors: apiErrors, clearFieldError, handleError } = useFormErrors();

  useEffect(() => {
    if (open) {
      setForm(initialState);
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (form.fullName.trim().length < 2) newErrors.fullName = "Full name must be at least 2 characters";

    if (!form.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    else if (form.fatherName.trim().length < 2) newErrors.fatherName = "Father's name must be at least 2 characters";

    if (!form.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(form.mobileNumber)) newErrors.mobileNumber = "Mobile number must be 10 digits starting with 6-9";

    if (form.alternateMobileNumber && !/^[6-9]\d{9}$/.test(form.alternateMobileNumber)) {
      newErrors.alternateMobileNumber = "Alternate mobile must be 10 digits starting with 6-9";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.gender) newErrors.gender = "Gender is required";

    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";

    if (!form.bloodGroup) newErrors.bloodGroup = "Blood group is required";

    if (!form.aadhaarNumber.trim()) newErrors.aadhaarNumber = "Aadhaar number is required";
    else if (!/^\d{12}$/.test(form.aadhaarNumber)) newErrors.aadhaarNumber = "Aadhaar must be 12 digits";

    if (form.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber)) {
      newErrors.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
    }

    if (!form.address.trim()) newErrors.address = "Address is required";

    if (!form.state.trim()) newErrors.state = "State is required";

    if (!form.district.trim()) newErrors.district = "District is required";

    if (!form.city.trim()) newErrors.city = "City is required";

    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = "Pincode must be 6 digits";

    if (!form.trade) newErrors.trade = "Trade is required";

    if (!form.skillLevel) newErrors.skillLevel = "Skill level is required";

    if (!form.joiningDate) newErrors.joiningDate = "Joining date is required";

    if (!form.salaryType) newErrors.salaryType = "Salary type is required";

    if (form.salaryType === "DAILY") {
      if (!form.dailyWage && form.dailyWage !== "0") newErrors.dailyWage = "Daily wage is required";
      else if (isNaN(Number(form.dailyWage)) || Number(form.dailyWage) < 0) newErrors.dailyWage = "Invalid daily wage";
    }

    if (form.salaryType === "MONTHLY") {
      if (!form.monthlySalary && form.monthlySalary !== "0") newErrors.monthlySalary = "Monthly salary is required";
      else if (isNaN(Number(form.monthlySalary)) || Number(form.monthlySalary) < 0) newErrors.monthlySalary = "Invalid monthly salary";
    }

    if (form.accountNumber && !/^\d+$/.test(form.accountNumber)) {
      newErrors.accountNumber = "Account number must be numeric only";
    }

    if (form.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode)) {
      newErrors.ifscCode = "Invalid IFSC code (e.g. PUNB0123456)";
    }

    if (form.upiId && !/^[^\s@]+@[^\s@]+$/.test(form.upiId)) {
      newErrors.upiId = "Invalid UPI ID format";
    }

    if (!form.emergencyContactName.trim()) newErrors.emergencyContactName = "Emergency contact name is required";

    if (!form.emergencyContactNumber.trim()) newErrors.emergencyContactNumber = "Emergency contact number is required";
    else if (!/^[6-9]\d{9}$/.test(form.emergencyContactNumber)) newErrors.emergencyContactNumber = "Invalid emergency contact number";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      handleError({
        response: { data: { message: "Please fill all required fields.", errors: validationErrors } },
      });

      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    const payload = {
      fullName: form.fullName,
      fatherName: form.fatherName,
      mobileNumber: form.mobileNumber,
      alternateMobileNumber: form.alternateMobileNumber || null,
      email: form.email || null,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      bloodGroup: form.bloodGroup,
      aadhaarNumber: form.aadhaarNumber,
      panNumber: form.panNumber || null,
      esicNumber: form.esicNumber || null,
      pfNumber: form.pfNumber || null,
      address: form.address,
      state: form.state,
      district: form.district,
      city: form.city,
      pincode: form.pincode,
      trade: form.trade,
      skillLevel: form.skillLevel,
      joiningDate: form.joiningDate,
      salaryType: form.salaryType,
      dailyWage: form.salaryType === "DAILY" ? Number(form.dailyWage) : 0,
      monthlySalary: form.salaryType === "MONTHLY" ? Number(form.monthlySalary) : 0,
      bankName: form.bankName || null,
      accountNumber: form.accountNumber || null,
      ifscCode: form.ifscCode || null,
      upiId: form.upiId || null,
      emergencyContactName: form.emergencyContactName,
      emergencyContactNumber: form.emergencyContactNumber,
      relationship: form.relationship || null,
    };

    try {
      setIsSubmitting(true);
      await onAddWorker(payload);
      showSuccess("Worker added successfully.");
      setForm(initialState);
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleId = "add-worker-modal-title";

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id={titleId}>Add New Worker</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="Close dialog">×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <SectionCard>
              <SectionTitle>Personal Information</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel $required>Full Name</FormLabel>
                  <FormInput
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name (e.g. Vikram Singh)"
                    required
                  />
                  <FormError error={apiErrors.fullName} />
                </FormField>

                <FormField>
                  <FormLabel $required>Father's Name</FormLabel>
                  <FormInput
                    name="fatherName"
                    value={form.fatherName}
                    onChange={handleChange}
                    placeholder="Enter father's name (e.g. Ramesh Singh)"
                    required
                  />
                  <FormError error={apiErrors.fatherName} />
                </FormField>

                <FormField>
                  <FormLabel $required>Mobile Number</FormLabel>
                  <FormInput
                    type="tel"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number (e.g. 9123456789)"
                    maxLength={10}
                    required
                  />
                  <FormError error={apiErrors.mobileNumber} />
                </FormField>

                <FormField>
                  <FormLabel>Alternate Mobile Number</FormLabel>
                  <FormInput
                    type="tel"
                    name="alternateMobileNumber"
                    value={form.alternateMobileNumber}
                    onChange={handleChange}
                    placeholder="Optional alternate number (e.g. 9876543210)"
                    maxLength={10}
                  />
                  <FormError error={apiErrors.alternateMobileNumber} />
                </FormField>

                <FormField>
                  <FormLabel>Email</FormLabel>
                  <FormInput
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email (e.g. vikram@gmail.com)"
                  />
                  <FormError error={apiErrors.email} />
                </FormField>

                <FormField>
                  <FormLabel $required>Gender</FormLabel>
                  <FormSelect name="gender" value={form.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    {genderOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </FormSelect>
                  <FormError error={apiErrors.gender} />
                </FormField>

                <FormField>
                  <FormLabel $required>Date of Birth</FormLabel>
                  <FormDatePicker type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
                  <FormError error={apiErrors.dateOfBirth} />
                </FormField>

                <FormField>
                  <FormLabel $required>Blood Group</FormLabel>
                  <FormSelect name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
                    <option value="">Select Blood Group</option>
                    {bloodGroupOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </FormSelect>
                  <FormError error={apiErrors.bloodGroup} />
                </FormField>
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Identity Information</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel $required>Aadhaar Number</FormLabel>
                  <FormInput
                    name="aadhaarNumber"
                    value={form.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="12-digit Aadhaar number (e.g. 456789123456)"
                    maxLength={12}
                    required
                  />
                  <FormError error={apiErrors.aadhaarNumber} />
                </FormField>

                <FormField>
                  <FormLabel>PAN Number</FormLabel>
                  <FormInput
                    name="panNumber"
                    value={form.panNumber}
                    onChange={handleChange}
                    placeholder="PAN format (e.g. ABCDE1234F)"
                    maxLength={10}
                  />
                  <FormError error={apiErrors.panNumber} />
                </FormField>

                <FormField>
                  <FormLabel>ESIC Number</FormLabel>
                  <FormInput
                    name="esicNumber"
                    value={form.esicNumber}
                    onChange={handleChange}
                    placeholder="Enter ESIC number (e.g. ESIC789654)"
                  />
                  <FormError error={apiErrors.esicNumber} />
                </FormField>

                <FormField>
                  <FormLabel>PF Number</FormLabel>
                  <FormInput
                    name="pfNumber"
                    value={form.pfNumber}
                    onChange={handleChange}
                    placeholder="Enter PF number (e.g. PF789654)"
                  />
                  <FormError error={apiErrors.pfNumber} />
                </FormField>
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Address</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel $required>Address</FormLabel>
                  <FormInput
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House No., Street, Locality"
                    required
                  />
                  <FormError error={apiErrors.address} />
                </FormField>

                <FormField>
                  <FormLabel $required>State</FormLabel>
                  <FormInput
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Select State"
                    required
                  />
                  <FormError error={apiErrors.state} />
                </FormField>

                <FormField>
                  <FormLabel $required>District</FormLabel>
                  <FormInput
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="Enter District"
                    required
                  />
                  <FormError error={apiErrors.district} />
                </FormField>

                <FormField>
                  <FormLabel $required>City</FormLabel>
                  <FormInput
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter City"
                    required
                  />
                  <FormError error={apiErrors.city} />
                </FormField>

                <FormField>
                  <FormLabel $required>Pincode</FormLabel>
                  <FormInput
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN (e.g. 201308)"
                    maxLength={6}
                    required
                  />
                  <FormError error={apiErrors.pincode} />
                </FormField>
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Employment Details</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel $required>Trade</FormLabel>
                  <FormSelect name="trade" value={form.trade} onChange={handleChange} required>
                    <option value="">Select Trade</option>
                    {tradeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </FormSelect>
                  <FormError error={apiErrors.trade} />
                </FormField>

                <FormField>
                  <FormLabel $required>Skill Level</FormLabel>
                  <FormSelect name="skillLevel" value={form.skillLevel} onChange={handleChange} required>
                    <option value="">Select Skill Level</option>
                    {skillLevelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </FormSelect>
                  <FormError error={apiErrors.skillLevel} />
                </FormField>

                <FormField>
                  <FormLabel $required>Joining Date</FormLabel>
                  <FormDatePicker type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} required />
                  <FormError error={apiErrors.joiningDate} />
                </FormField>

                <FormField>
                  <FormLabel $required>Salary Type</FormLabel>
                  <FormSelect name="salaryType" value={form.salaryType} onChange={handleChange} required>
                    {salaryTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </FormSelect>
                  <FormError error={apiErrors.salaryType} />
                </FormField>

                {form.salaryType === "DAILY" && (
                  <FormField>
                    <FormLabel $required>Daily Wage</FormLabel>
                    <FormInput
                      type="number"
                      name="dailyWage"
                      value={form.dailyWage}
                      onChange={handleChange}
                      placeholder="Enter daily wage (e.g. 950)"
                      min={0}
                      required
                    />
                    <FormError error={apiErrors.dailyWage} />
                  </FormField>
                )}

                {form.salaryType === "MONTHLY" && (
                  <FormField>
                    <FormLabel $required>Monthly Salary</FormLabel>
                    <FormInput
                      type="number"
                      name="monthlySalary"
                      value={form.monthlySalary}
                      onChange={handleChange}
                      placeholder="Enter monthly salary (e.g. 28000)"
                      min={0}
                      required
                    />
                    <FormError error={apiErrors.monthlySalary} />
                  </FormField>
                )}
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Bank Details</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel>Bank Name</FormLabel>
                  <FormInput
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    placeholder="Enter bank name (e.g. Punjab National Bank)"
                  />
                  <FormError error={apiErrors.bankName} />
                </FormField>

                <FormField>
                  <FormLabel>Account Number</FormLabel>
                  <FormInput
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter account number (e.g. 789456123987)"
                  />
                  <FormError error={apiErrors.accountNumber} />
                </FormField>

                <FormField>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormInput
                    name="ifscCode"
                    value={form.ifscCode}
                    onChange={handleChange}
                    placeholder="IFSC format (e.g. PUNB0123456)"
                    maxLength={11}
                  />
                  <FormError error={apiErrors.ifscCode} />
                </FormField>

                <FormField>
                  <FormLabel>UPI ID</FormLabel>
                  <FormInput
                    name="upiId"
                    value={form.upiId}
                    onChange={handleChange}
                    placeholder="UPI ID (e.g. vikram@okpnb)"
                  />
                  <FormError error={apiErrors.upiId} />
                </FormField>
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Emergency Contact</SectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel $required>Emergency Contact Name</FormLabel>
                  <FormInput
                    name="emergencyContactName"
                    value={form.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Enter emergency contact name"
                    required
                  />
                  <FormError error={apiErrors.emergencyContactName} />
                </FormField>

                <FormField>
                  <FormLabel $required>Emergency Contact Number</FormLabel>
                  <FormInput
                    type="tel"
                    name="emergencyContactNumber"
                    value={form.emergencyContactNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                  />
                  <FormError error={apiErrors.emergencyContactNumber} />
                </FormField>

                <FormField>
                  <FormLabel>Relationship</FormLabel>
                  <FormSelect name="relationship" value={form.relationship} onChange={handleChange}>
                    <option value="">Select Relationship</option>
                    {relationshipOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </FormSelect>
                  <FormError error={apiErrors.relationship} />
                </FormField>
              </FormGrid>
            </SectionCard>

            <ModalFooter>
              <SecondaryButton type="button" onClick={onClose}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Worker"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddWorkerModal;
