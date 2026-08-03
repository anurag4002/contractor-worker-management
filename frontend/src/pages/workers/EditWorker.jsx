import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiLoader, FiSave } from "react-icons/fi";
import styled from "styled-components";

import workerService from "../../services/worker.service";
import { showSuccess, showError } from "../../components/common/toast";

const Page = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
`;

const Card = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
`;

const Subtitle = styled.p`
  margin: 0.35rem 0 0;
  color: var(--text-secondary);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 0.45rem;
`;

const Label = styled.label`
  color: var(--text-secondary);
  font-size: 0.86rem;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 0.95rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 0.95rem;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const ErrorText = styled.div`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.9rem;
  margin-top: 1.6rem;
`;

const Button = styled.button`
  border: none;
  border-radius: 0.9rem;
  padding: 0.9rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
`;

const SecondaryButton = styled(Button)`
  background: var(--border);
  color: var(--text);
`;

const PrimaryButton = styled(Button)`
  background: var(--primary);
  color: white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--danger);
`;

const EmptyState = styled.div`
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
`;

const SectionCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
`;

const SectionTitle = styled.h4`
  margin: 0 0 1rem;
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary);
`;

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

const getWorkerPayload = (payload) => payload?.data || payload?.worker || payload?.workerData || payload || {};

const EditWorker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
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
  });

  const loadWorker = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await workerService.getWorkerById(id);
      const w = getWorkerPayload(response);
      setWorker(w);
      setForm({
        fullName: w.fullName || "",
        fatherName: w.fatherName || "",
        mobileNumber: w.mobileNumber || "",
        alternateMobileNumber: w.alternateMobileNumber || "",
        email: w.email || "",
        gender: w.gender || "",
        dateOfBirth: w.dateOfBirth ? w.dateOfBirth.split("T")[0] : "",
        bloodGroup: w.bloodGroup || "",
        aadhaarNumber: w.aadhaarNumber || "",
        panNumber: w.panNumber || "",
        esicNumber: w.esicNumber || "",
        pfNumber: w.pfNumber || "",
        address: w.address || "",
        state: w.state || "",
        district: w.district || "",
        city: w.city || "",
        pincode: w.pincode || "",
        trade: w.trade || "",
        skillLevel: w.skillLevel || "",
        joiningDate: w.joiningDate ? w.joiningDate.split("T")[0] : "",
        salaryType: w.salaryType || "DAILY",
        dailyWage: w.dailyWage != null ? String(w.dailyWage) : "",
        monthlySalary: w.monthlySalary != null ? String(w.monthlySalary) : "",
        bankName: w.bankName || "",
        accountNumber: w.accountNumber || "",
        ifscCode: w.ifscCode || "",
        upiId: w.upiId || "",
        emergencyContactName: w.emergencyContactName || "",
        emergencyContactNumber: w.emergencyContactNumber || "",
        relationship: w.relationship || "",
      });
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("Worker not found.");
      } else if (!err?.response && err?.message?.toLowerCase().includes("network")) {
        setError("Network Error. Unable to connect to server.");
      } else {
        setError("Unable to load worker details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadWorker();
    }
  }, [id]);

  const isSubmitDisabled = useMemo(() => {
    return saving || !form.fullName.trim() || !form.mobileNumber.trim();
  }, [saving, form.fullName, form.mobileNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      setSaving(true);
      await workerService.updateWorker(id, payload);
      showSuccess("Worker updated successfully.");
      navigate(`/workers/${id}`);
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.errors?.[0] || err?.message || "Something went wrong.";
      if (!err?.response && err?.message?.toLowerCase().includes("network")) {
        showError("Network Error\nUnable to connect to server.\nPlease check your internet connection.");
      } else if (err?.response?.status === 500) {
        showError("Something went wrong.\nPlease try again later.");
      } else {
        showError(`Worker Update Failed\n${message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <Card>
        {loading ? (
          <EmptyState>
            <FiLoader size={20} style={{ animation: "spin 1s linear infinite", marginRight: "0.5rem" }} />
            Loading worker details...
          </EmptyState>
        ) : error ? (
          <ErrorState>
            <div>{error}</div>
            <ButtonRow>
              <SecondaryButton type="button" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
              </SecondaryButton>
              <PrimaryButton type="button" onClick={loadWorker}>
                Retry
              </PrimaryButton>
            </ButtonRow>
          </ErrorState>
        ) : !worker ? (
          <EmptyState>Worker not found.</EmptyState>
        ) : (
          <>
            <Header>
              <div>
                <Title>Edit Worker</Title>
                <Subtitle>Update the selected worker profile.</Subtitle>
              </div>
            </Header>

            <form onSubmit={handleSubmit}>
              <SectionCard>
                <SectionTitle>Personal Information</SectionTitle>
                <FormGrid>
                  <Field>
                    <Label>Full Name *</Label>
                    <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter full name (e.g. Vikram Singh)" required />
                    {validate().fullName && <ErrorText>{validate().fullName}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Father's Name *</Label>
                    <Input name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Enter father's name (e.g. Ramesh Singh)" required />
                    {validate().fatherName && <ErrorText>{validate().fatherName}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Mobile Number *</Label>
                    <Input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="10-digit mobile number (e.g. 9123456789)" maxLength={10} required />
                    {validate().mobileNumber && <ErrorText>{validate().mobileNumber}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Alternate Mobile Number</Label>
                    <Input name="alternateMobileNumber" value={form.alternateMobileNumber} onChange={handleChange} placeholder="Optional alternate number (e.g. 9876543210)" maxLength={10} />
                    {validate().alternateMobileNumber && <ErrorText>{validate().alternateMobileNumber}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Email</Label>
                    <Input name="email" value={form.email} onChange={handleChange} placeholder="Enter email (e.g. vikram@gmail.com)" />
                    {validate().email && <ErrorText>{validate().email}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Gender *</Label>
                    <Select name="gender" value={form.gender} onChange={handleChange} required>
                      <option value="">Select Gender</option>
                      {genderOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                    {validate().gender && <ErrorText>{validate().gender}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Date of Birth *</Label>
                    <Input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
                    {validate().dateOfBirth && <ErrorText>{validate().dateOfBirth}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Blood Group *</Label>
                    <Select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
                      <option value="">Select Blood Group</option>
                      {bloodGroupOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                    {validate().bloodGroup && <ErrorText>{validate().bloodGroup}</ErrorText>}
                  </Field>
                </FormGrid>
              </SectionCard>

              <SectionCard>
                <SectionTitle>Identity Information</SectionTitle>
                <FormGrid>
                  <Field>
                    <Label>Aadhaar Number *</Label>
                    <Input name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} placeholder="12-digit Aadhaar number (e.g. 456789123456)" maxLength={12} required />
                    {validate().aadhaarNumber && <ErrorText>{validate().aadhaarNumber}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>PAN Number</Label>
                    <Input name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="PAN format (e.g. ABCDE1234F)" maxLength={10} />
                    {validate().panNumber && <ErrorText>{validate().panNumber}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>ESIC Number</Label>
                    <Input name="esicNumber" value={form.esicNumber} onChange={handleChange} placeholder="Enter ESIC number (e.g. ESIC789654)" />
                    {validate().esicNumber && <ErrorText>{validate().esicNumber}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>PF Number</Label>
                    <Input name="pfNumber" value={form.pfNumber} onChange={handleChange} placeholder="Enter PF number (e.g. PF789654)" />
                    {validate().pfNumber && <ErrorText>{validate().pfNumber}</ErrorText>}
                  </Field>
                </FormGrid>
              </SectionCard>

              <SectionCard>
                <SectionTitle>Address</SectionTitle>
                <FormGrid>
                  <Field>
                    <Label>Address *</Label>
                    <Input name="address" value={form.address} onChange={handleChange} placeholder="House No., Street, Locality" required />
                    {validate().address && <ErrorText>{validate().address}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>State *</Label>
                    <Input name="state" value={form.state} onChange={handleChange} placeholder="Select State" required />
                    {validate().state && <ErrorText>{validate().state}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>District *</Label>
                    <Input name="district" value={form.district} onChange={handleChange} placeholder="Enter District" required />
                    {validate().district && <ErrorText>{validate().district}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>City *</Label>
                    <Input name="city" value={form.city} onChange={handleChange} placeholder="Enter City" required />
                    {validate().city && <ErrorText>{validate().city}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Pincode *</Label>
                    <Input name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit PIN (e.g. 201308)" maxLength={6} required />
                    {validate().pincode && <ErrorText>{validate().pincode}</ErrorText>}
                  </Field>
                </FormGrid>
              </SectionCard>

              <SectionCard>
                <SectionTitle>Employment Details</SectionTitle>
                <FormGrid>
                  <Field>
                    <Label>Trade *</Label>
                    <Select name="trade" value={form.trade} onChange={handleChange} required>
                      <option value="">Select Trade</option>
                      {tradeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                    {validate().trade && <ErrorText>{validate().trade}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Skill Level *</Label>
                    <Select name="skillLevel" value={form.skillLevel} onChange={handleChange} required>
                      <option value="">Select Skill Level</option>
                      {skillLevelOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                    {validate().skillLevel && <ErrorText>{validate().skillLevel}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Joining Date *</Label>
                    <Input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} required />
                    {validate().joiningDate && <ErrorText>{validate().joiningDate}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Salary Type *</Label>
                    <Select name="salaryType" value={form.salaryType} onChange={handleChange} required>
                      {salaryTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                    {validate().salaryType && <ErrorText>{validate().salaryType}</ErrorText>}
                  </Field>

                  {form.salaryType === "DAILY" && (
                    <Field>
                      <Label>Daily Wage *</Label>
                      <Input type="number" name="dailyWage" value={form.dailyWage} onChange={handleChange} placeholder="Enter daily wage (e.g. 950)" min={0} required />
                      {validate().dailyWage && <ErrorText>{validate().dailyWage}</ErrorText>}
                    </Field>
                  )}

                  {form.salaryType === "MONTHLY" && (
                    <Field>
                      <Label>Monthly Salary *</Label>
                      <Input type="number" name="monthlySalary" value={form.monthlySalary} onChange={handleChange} placeholder="Enter monthly salary (e.g. 28000)" min={0} required />
                      {validate().monthlySalary && <ErrorText>{validate().monthlySalary}</ErrorText>}
                    </Field>
                  )}
                </FormGrid>
              </SectionCard>

              <SectionCard>
                <SectionTitle>Bank Details</SectionTitle>
                <FormGrid>
                  <Field>
                    <Label>Bank Name</Label>
                    <Input name="bankName" value={form.bankName} onChange={handleChange} placeholder="Enter bank name (e.g. Punjab National Bank)" />
                    {validate().bankName && <ErrorText>{validate().bankName}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Account Number</Label>
                    <Input name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Enter account number (e.g. 789456123987)" />
                    {validate().accountNumber && <ErrorText>{validate().accountNumber}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>IFSC Code</Label>
                    <Input name="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="IFSC format (e.g. PUNB0123456)" maxLength={11} />
                    {validate().ifscCode && <ErrorText>{validate().ifscCode}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>UPI ID</Label>
                    <Input name="upiId" value={form.upiId} onChange={handleChange} placeholder="UPI ID (e.g. vikram@okpnb)" />
                    {validate().upiId && <ErrorText>{validate().upiId}</ErrorText>}
                  </Field>
                </FormGrid>
              </SectionCard>

              <SectionCard>
                <SectionTitle>Emergency Contact</SectionTitle>
                <FormGrid>
                  <Field>
                    <Label>Emergency Contact Name *</Label>
                    <Input name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} placeholder="Enter emergency contact name" required />
                    {validate().emergencyContactName && <ErrorText>{validate().emergencyContactName}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Emergency Contact Number *</Label>
                    <Input name="emergencyContactNumber" value={form.emergencyContactNumber} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} required />
                    {validate().emergencyContactNumber && <ErrorText>{validate().emergencyContactNumber}</ErrorText>}
                  </Field>

                  <Field>
                    <Label>Relationship</Label>
                    <Select name="relationship" value={form.relationship} onChange={handleChange}>
                      <option value="">Select Relationship</option>
                      {relationshipOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                    {validate().relationship && <ErrorText>{validate().relationship}</ErrorText>}
                  </Field>
                </FormGrid>
              </SectionCard>

              <ButtonRow>
                <SecondaryButton type="button" onClick={() => navigate(`/workers/${id}`)}>
                  <FiArrowLeft /> Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={isSubmitDisabled}>
                  <FiSave /> {saving ? "Saving..." : "Save Changes"}
                </PrimaryButton>
              </ButtonRow>
            </form>
          </>
        )}
      </Card>
    </Page>
  );
};

export default EditWorker;