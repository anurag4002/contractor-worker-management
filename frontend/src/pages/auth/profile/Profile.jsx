import { useState, useEffect } from "react";
import {
  FiEdit, FiSave, FiX, FiKey, FiEye, FiEyeOff, FiArrowLeft, FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../../../context/AuthContext.jsx";
import { showSuccess, showError } from "../../../components/common/toast";

import {
  FormPage,
  FormContainer,
  FormHeader,
  FormTitle,
  FormSubtitle,
  FormGrid,
  FormField,
  FormLabel,
  FormInput,
  FormError,
  SectionCard,
  SectionTitle,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
} from "../../../components/ui/form";

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
`;

const EMPTY = "—";

const getRoleDisplay = (role) => {
  if (!role) return EMPTY;
  if (typeof role === "string") return role || EMPTY;
  if (typeof role === "object") return role.name || role.code || EMPTY;
  return String(role);
};
const getStatus = (u) => {
  if (!u) return EMPTY;
  if (u.status) return u.status;
  if (typeof u.isActive === "boolean") return u.isActive ? "Active" : "Inactive";
  return EMPTY;
};
const val = (v) => (v == null || v === "" ? EMPTY : v);

const Profile = () => {
  const { user, getProfile, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProfile();
        setProfileData(res?.data || user);
      } catch {
        setProfileData(user);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", mobileNumber: "", username: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({ fullName: "", mobileNumber: "", username: "" });

  const p = profileData || user || {};

  const startEdit = () => {
    setForm({
      fullName: p.fullName || "",
      mobileNumber: p.mobileNumber || "",
      username: p.username || "",
    });
    setErrors({ fullName: "", mobileNumber: "", username: "" });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getValidationErrors = () => {
    const nextErrors = { fullName: "", mobileNumber: "", username: "" };
    const fullName = form.fullName.trim();
    const mobileNumber = form.mobileNumber.trim();
    const username = form.username.trim();

    if (!fullName) {
      nextErrors.fullName = "Full name is required.";
    } else if (fullName.length < 2) {
      nextErrors.fullName = "Full name must be at least 2 characters.";
    }

    if (mobileNumber && !/^[6-9]\d{9}$/.test(mobileNumber)) {
      nextErrors.mobileNumber = "Enter a valid 10-digit Indian mobile number.";
    }

    if (username && username.length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }

    return nextErrors;
  };

  const handleSave = async () => {
    const validationErrors = getValidationErrors();
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    try {
      setSaving(true);

      const payload = {};
      const nextFullName = form.fullName.trim();
      const nextMobileNumber = form.mobileNumber.trim();
      const nextUsername = form.username.trim();

      if (nextFullName && nextFullName !== (p.fullName || "")) payload.fullName = nextFullName;
      if (nextMobileNumber && nextMobileNumber !== (p.mobileNumber || "")) payload.mobileNumber = nextMobileNumber;
      if (nextUsername && nextUsername !== (p.username || "")) payload.username = nextUsername;

      if (Object.keys(payload).length === 0) {
        setIsEditing(false);
        return;
      }

      const response = await updateProfile(payload);
      const responseData = response?.data;
      const updatedUser = responseData?.data || responseData?.user || responseData || { ...p, ...payload };

      const mergedUser = { ...(p || {}), ...updatedUser };
      setProfileData(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      showSuccess("Profile updated successfully. Your profile information has been saved.");
      setErrors({ fullName: "", mobileNumber: "", username: "" });
      setIsEditing(false);
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCfm, setShowCfm] = useState(false);

  const handlePwChange = (e) => setPw((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePwSubmit = async () => {
    if (!pw.oldPassword) return showError("Current password is required.");
    if (pw.newPassword.length < 8) return showError("New password must be at least 8 characters.");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(pw.newPassword))
      return showError("Password must contain uppercase, lowercase, number and special char.");
    if (pw.newPassword !== pw.confirm) return showError("Passwords do not match.");

    try {
      setPwSaving(true);
      await changePassword(pw.oldPassword, pw.newPassword);
      showSuccess("Password changed successfully.");
      setPw({ oldPassword: "", newPassword: "", confirm: "" });
      setShowPw(false);
    } catch (err) {
      showError(err);
    } finally {
      setPwSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <FormPage>
        <FormContainer>
          <FormHeader>
            <FormTitle>Loading profile…</FormTitle>
          </FormHeader>
        </FormContainer>
      </FormPage>
    );
  }

  const nameDisplay = val(p.fullName || p.email);
  const roleDisplay = getRoleDisplay(p.role);

  return (
    <FormPage>
      <FormContainer>
        <FormHeader>
          <div>
            <FormTitle>{nameDisplay}</FormTitle>
            <FormSubtitle>{roleDisplay}</FormSubtitle>
          </div>
        </FormHeader>

        <SectionCard>
          <SectionTitle>Profile Information</SectionTitle>
          <FormGrid>
            <FormField>
              <FormLabel $required>Full Name</FormLabel>
              <FormInput
                name="fullName"
                value={isEditing ? form.fullName : val(p.fullName)}
                readOnly={!isEditing}
                onChange={handleChange}
                disabled={saving}
              />
              {errors.fullName && <FormError error={errors.fullName} />}
            </FormField>

            <FormField>
              <FormLabel>Email</FormLabel>
              <FormInput name="email" value={val(p.email)} readOnly disabled />
            </FormField>

            <FormField>
              <FormLabel $required>Phone Number</FormLabel>
              <FormInput
                name="mobileNumber"
                value={isEditing ? form.mobileNumber : val(p.mobileNumber)}
                readOnly={!isEditing}
                onChange={handleChange}
                disabled={saving}
              />
              {errors.mobileNumber && <FormError error={errors.mobileNumber} />}
            </FormField>

            <FormField>
              <FormLabel $required>Username</FormLabel>
              <FormInput
                name="username"
                value={isEditing ? form.username : val(p.username)}
                readOnly={!isEditing}
                onChange={handleChange}
                disabled={saving}
              />
              {errors.username && <FormError error={errors.username} />}
            </FormField>

            <FormField>
              <FormLabel>Employee ID</FormLabel>
              <FormInput name="employeeId" value={val(p.employeeId || p.employee_code || "—")} readOnly disabled />
            </FormField>

            <FormField>
              <FormLabel>Department</FormLabel>
              <FormInput name="department" value={val(p.department || "—")} readOnly disabled />
            </FormField>

            <FormField>
              <FormLabel>Role</FormLabel>
              <FormInput name="role" value={roleDisplay} readOnly disabled />
            </FormField>

            <FormField>
              <FormLabel>Account Status</FormLabel>
              <FormInput name="status" value={getStatus(p)} readOnly disabled />
            </FormField>

            <FormField>
              <FormLabel>Last Login</FormLabel>
              <FormInput name="lastLogin" value={val(p.lastLogin || p.last_login || "—")} readOnly disabled />
            </FormField>

            <FormField>
              <FormLabel>Join Date</FormLabel>
              <FormInput name="joinDate" value={val(p.joinDate || p.join_date || "—")} readOnly disabled />
            </FormField>
          </FormGrid>
        </SectionCard>

        <ButtonGroup>
          <SecondaryButton type="button" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </SecondaryButton>
          {!isEditing ? (
            <>
              <SecondaryButton type="button" onClick={() => setShowPw((v) => !v)}>
                <FiKey /> {showPw ? "Hide Password" : "Change Password"}
              </SecondaryButton>
              <PrimaryButton type="button" onClick={startEdit}>
                <FiEdit /> Edit Profile
              </PrimaryButton>
            </>
          ) : (
            <>
              <SecondaryButton type="button" onClick={() => setIsEditing(false)} disabled={saving}>
                <FiX /> Cancel
              </SecondaryButton>
              <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
                {saving ? <><FiLoader size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><FiSave /> Save Changes</>}
              </PrimaryButton>
            </>
          )}
        </ButtonGroup>

        {showPw && (
          <SectionCard>
            <SectionTitle>Change Password</SectionTitle>
            <FormGrid>
              <FormField>
                <FormLabel $required>Current Password</FormLabel>
                <PasswordWrapper>
                  <FormInput
                    type={showOld ? "text" : "password"}
                    name="oldPassword"
                    value={pw.oldPassword}
                    onChange={handlePwChange}
                    placeholder="Enter current password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    aria-label={showOld ? "Hide password" : "Show password"}
                  >
                    {showOld ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </PasswordWrapper>
              </FormField>

              <FormField>
                <FormLabel $required>New Password</FormLabel>
                <PasswordWrapper>
                  <FormInput
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    value={pw.newPassword}
                    onChange={handlePwChange}
                    placeholder="Min 8 chars, upper+lower+number+special"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    {showNew ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </PasswordWrapper>
              </FormField>

              <FormField>
                <FormLabel $required>Confirm Password</FormLabel>
                <PasswordWrapper>
                  <FormInput
                    type={showCfm ? "text" : "password"}
                    name="confirm"
                    value={pw.confirm}
                    onChange={handlePwChange}
                    placeholder="Re-enter new password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowCfm(!showCfm)}
                    aria-label={showCfm ? "Hide password" : "Show password"}
                  >
                    {showCfm ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </PasswordWrapper>
              </FormField>
            </FormGrid>

            <ButtonGroup>
              <SecondaryButton
                type="button"
                onClick={() => { setShowPw(false); setPw({ oldPassword: "", newPassword: "", confirm: "" }); }}
              >
                <FiX /> Cancel
              </SecondaryButton>
              <PrimaryButton type="button" onClick={handlePwSubmit} disabled={pwSaving}>
                <FiSave /> {pwSaving ? "Updating…" : "Update Password"}
              </PrimaryButton>
            </ButtonGroup>
          </SectionCard>
        )}
      </FormContainer>
    </FormPage>
  );
};

export default Profile;
