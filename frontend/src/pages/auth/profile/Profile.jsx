import { useState, useEffect } from "react";
import {
  FiUser, FiMail, FiPhone, FiShield, FiLock,
  FiEdit, FiSave, FiX, FiKey, FiEye, FiEyeOff, FiClock, FiCalendar, FiArrowLeft, FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext.jsx";
import { showSuccess, showError } from "../../../components/common/toast";

import {
  Page, Card, AvatarCircle, HeaderSection, Name, RoleLabel,
  SummaryText, InfoGrid, FieldGroup, FieldLabel, FieldBox,
  FieldIcon, FieldInput, FieldError, ButtonRow, PrimaryButton, SecondaryButton, BackButton,
} from "./Profile.style";

const EMPTY = "—";

/* ── Helpers ─────────────────────────────────────────── */
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

/* ── Component ───────────────────────────────────────── */
const Profile = () => {
  const { user, getProfile, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  /* ── profile fetch on mount ── */
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

  /* ── edit mode ── */
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

  const getErrorMessage = (error) => {
    if (error?.response?.data?.message) return error.response.data.message;
    if (Array.isArray(error?.response?.data?.errors) && error.response.data.errors.length > 0) {
      return error.response.data.errors[0];
    }
    if (error?.message) return error.message;
    return "Something went wrong.";
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
      showSuccess("Profile Updated Successfully\nYour profile information has been updated successfully.");
      setErrors({ fullName: "", mobileNumber: "", username: "" });
      setIsEditing(false);
    } catch (error) {
      const apiStatus = error?.response?.status;
      const message = getErrorMessage(error);

      if (!error?.response && error?.message?.toLowerCase().includes("network")) {
        showError("Network Error\nUnable to connect to server.\nPlease check your internet connection.");
      } else if (apiStatus === 500) {
        showError("Something went wrong.\nPlease try again later.");
      } else {
        showError(`Profile Update Failed\n${message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  /* ── change password section ── */
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
      showSuccess("Password changed successfully!");
      setPw({ oldPassword: "", newPassword: "", confirm: "" });
      setShowPw(false);
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setPwSaving(false);
    }
  };

  /* ── Loading ── */
  if (profileLoading) {
    return (
      <Page>
        <Card>
          <HeaderSection><Name>Loading profile…</Name></HeaderSection>
        </Card>
      </Page>
    );
  }

  /* ── Render ── */
  const nameDisplay = val(p.fullName || p.email);
  const roleDisplay = getRoleDisplay(p.role);

  return (
    <Page>
      <Card>
        {/* Avatar */}
        <AvatarCircle aria-hidden>
          {p.fullName ? p.fullName.charAt(0).toUpperCase() : <FiUser size={40} />}
        </AvatarCircle>

        <HeaderSection>
          <Name>{nameDisplay}</Name>
          <RoleLabel>{roleDisplay}</RoleLabel>
          <SummaryText>
            View and manage your profile details and account security.
          </SummaryText>
        </HeaderSection>

        {/* ── Fields ── */}
        <InfoGrid>
          {/* Full Name — editable */}
          <FieldGroup>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <FieldBox>
              <FieldIcon><FiUser /></FieldIcon>
              <FieldInput
                id="fullName" name="fullName"
                value={isEditing ? form.fullName : val(p.fullName)}
                readOnly={!isEditing}
                onChange={handleChange}
                disabled={saving}
              />
            </FieldBox>
            {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
          </FieldGroup>

          {/* Email — read-only system field */}
          <FieldGroup>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldBox>
              <FieldIcon><FiMail /></FieldIcon>
              <FieldInput id="email" value={val(p.email)} readOnly />
            </FieldBox>
          </FieldGroup>

           {/* Mobile Number — editable */}
           <FieldGroup>
             <FieldLabel htmlFor="mobileNumber">Phone Number</FieldLabel>
            <FieldBox>
              <FieldIcon><FiPhone /></FieldIcon>
              <FieldInput
                id="mobileNumber" name="mobileNumber"
                value={isEditing ? form.mobileNumber : val(p.mobileNumber)}
                readOnly={!isEditing}
                onChange={handleChange}
                disabled={saving}
              />
            </FieldBox>
            {errors.mobileNumber && <FieldError>{errors.mobileNumber}</FieldError>}
          </FieldGroup>

           {/* Username — editable */}
           <FieldGroup>
             <FieldLabel htmlFor="username">Username</FieldLabel>
             <FieldBox>
               <FieldIcon><FiShield /></FieldIcon>
               <FieldInput
                 id="username" name="username"
                 value={isEditing ? form.username : val(p.username)}
                 readOnly={!isEditing}
                 onChange={handleChange}
                 disabled={saving}
               />
             </FieldBox>
             {errors.username && <FieldError>{errors.username}</FieldError>}
           </FieldGroup>

           {/* Employee ID — read-only */}
           <FieldGroup>
             <FieldLabel htmlFor="employeeId">Employee ID</FieldLabel>
             <FieldBox>
               <FieldIcon><FiShield /></FieldIcon>
               <FieldInput id="employeeId" value={val(p.employeeId || p.employee_code || "—")} readOnly />
             </FieldBox>
           </FieldGroup>

           {/* Department — read-only */}
           <FieldGroup>
             <FieldLabel htmlFor="department">Department</FieldLabel>
             <FieldBox>
               <FieldIcon><FiShield /></FieldIcon>
               <FieldInput id="department" value={val(p.department || "—")} readOnly />
             </FieldBox>
           </FieldGroup>

           {/* Role — read-only system field */}
           <FieldGroup>
             <FieldLabel htmlFor="role">Role</FieldLabel>
             <FieldBox>
               <FieldIcon><FiShield /></FieldIcon>
               <FieldInput id="role" value={roleDisplay} readOnly />
             </FieldBox>
           </FieldGroup>

           {/* Account Status — read-only system field */}
           <FieldGroup>
             <FieldLabel htmlFor="status">Account Status</FieldLabel>
             <FieldBox>
               <FieldIcon><FiLock /></FieldIcon>
               <FieldInput id="status" value={getStatus(p)} readOnly />
             </FieldBox>
           </FieldGroup>

           {/* Last Login — read-only */}
           <FieldGroup>
             <FieldLabel htmlFor="lastLogin">Last Login</FieldLabel>
             <FieldBox>
               <FieldIcon><FiClock /></FieldIcon>
               <FieldInput id="lastLogin" value={val(p.lastLogin || p.last_login || "—")} readOnly />
             </FieldBox>
           </FieldGroup>

           {/* Join Date — read-only */}
           <FieldGroup>
             <FieldLabel htmlFor="joinDate">Join Date</FieldLabel>
             <FieldBox>
               <FieldIcon><FiCalendar /></FieldIcon>
               <FieldInput id="joinDate" value={val(p.joinDate || p.join_date || "—")} readOnly />
             </FieldBox>
           </FieldGroup>
         </InfoGrid>

         {/* ── Profile buttons ── */}
         <ButtonRow>
           <BackButton type="button" onClick={() => navigate(-1)}>
             <FiArrowLeft /> Back
           </BackButton>
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
         </ButtonRow>

        {/* ── Inline Change Password ── */}
        {showPw && (
          <div style={{
            marginTop: "2rem", padding: "1.5rem", borderRadius: "1rem",
            background: "var(--bg)", border: "1px solid var(--border)",
          }}>
            <h3 style={{ margin: "0 0 1rem", fontSize: "1.05rem", color: "var(--text)" }}>
              <FiKey style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
              Change Password
            </h3>

            {/* Current Password */}
            <FieldGroup style={{ marginBottom: "0.75rem" }}>
              <FieldLabel>Current Password</FieldLabel>
              <FieldBox>
                <FieldIcon><FiLock /></FieldIcon>
                <FieldInput
                  type={showOld ? "text" : "password"}
                  name="oldPassword" value={pw.oldPassword}
                  onChange={handlePwChange} placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowOld(!showOld)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                  {showOld ? <FiEyeOff /> : <FiEye />}
                </button>
              </FieldBox>
            </FieldGroup>

            {/* New Password */}
            <FieldGroup style={{ marginBottom: "0.75rem" }}>
              <FieldLabel>New Password</FieldLabel>
              <FieldBox>
                <FieldIcon><FiLock /></FieldIcon>
                <FieldInput
                  type={showNew ? "text" : "password"}
                  name="newPassword" value={pw.newPassword}
                  onChange={handlePwChange} placeholder="Min 8 chars, upper+lower+number+special"
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                  {showNew ? <FiEyeOff /> : <FiEye />}
                </button>
              </FieldBox>
            </FieldGroup>

            {/* Confirm Password */}
            <FieldGroup style={{ marginBottom: "1rem" }}>
              <FieldLabel>Confirm Password</FieldLabel>
              <FieldBox>
                <FieldIcon><FiLock /></FieldIcon>
                <FieldInput
                  type={showCfm ? "text" : "password"}
                  name="confirm" value={pw.confirm}
                  onChange={handlePwChange} placeholder="Re-enter new password"
                />
                <button type="button" onClick={() => setShowCfm(!showCfm)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                  {showCfm ? <FiEyeOff /> : <FiEye />}
                </button>
              </FieldBox>
            </FieldGroup>

            <ButtonRow>
              <SecondaryButton type="button" onClick={() => { setShowPw(false); setPw({ oldPassword: "", newPassword: "", confirm: "" }); }}>
                <FiX /> Cancel
              </SecondaryButton>
              <PrimaryButton type="button" onClick={handlePwSubmit} disabled={pwSaving}>
                <FiSave /> {pwSaving ? "Updating…" : "Update Password"}
              </PrimaryButton>
            </ButtonRow>
          </div>
        )}
      </Card>
    </Page>
  );
};

export default Profile;
