import { useState, useEffect } from "react";
import {
  FiUser, FiMail, FiPhone, FiShield, FiLock,
  FiEdit, FiSave, FiX, FiKey, FiEye, FiEyeOff,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext.jsx";
import { showSuccess, showError } from "../../../components/common/toast";

import {
  Page, Card, AvatarCircle, HeaderSection, Name, RoleLabel,
  SummaryText, InfoGrid, FieldGroup, FieldLabel, FieldBox,
  FieldIcon, FieldInput, ButtonRow, PrimaryButton, SecondaryButton,
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

  const p = profileData || user || {};

  const startEdit = () => {
    setForm({
      fullName: p.fullName || "",
      mobileNumber: p.mobileNumber || "",
      username: p.username || "",
    });
    setIsEditing(true);
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    /* Client-side quick check */
    if (form.fullName.length < 2) return showError("Full name must be at least 2 characters.");
    if (form.mobileNumber && !/^[6-9]\d{9}$/.test(form.mobileNumber))
      return showError("Enter a valid 10-digit Indian mobile number.");
    if (form.username && form.username.length < 3)
      return showError("Username must be at least 3 characters.");

    try {
      setSaving(true);
      const payload = {};
      if (form.fullName) payload.fullName = form.fullName;
      if (form.mobileNumber) payload.mobileNumber = form.mobileNumber;
      if (form.username) payload.username = form.username;
      await updateProfile(payload);
      setProfileData((prev) => ({ ...prev, ...payload }));
      showSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to update profile.");
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
              />
            </FieldBox>
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
            <FieldLabel htmlFor="mobileNumber">Mobile Number</FieldLabel>
            <FieldBox>
              <FieldIcon><FiPhone /></FieldIcon>
              <FieldInput
                id="mobileNumber" name="mobileNumber"
                value={isEditing ? form.mobileNumber : val(p.mobileNumber)}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </FieldBox>
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
              />
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

          {/* Status — read-only system field */}
          <FieldGroup>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <FieldBox>
              <FieldIcon><FiLock /></FieldIcon>
              <FieldInput id="status" value={getStatus(p)} readOnly />
            </FieldBox>
          </FieldGroup>
        </InfoGrid>

        {/* ── Profile buttons ── */}
        <ButtonRow>
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
                <FiSave /> {saving ? "Saving…" : "Save Changes"}
              </PrimaryButton>
            </>
          )}
        </ButtonRow>

        {/* ── Inline Change Password ── */}
        {showPw && (
          <div style={{
            marginTop: "2rem", padding: "1.5rem", borderRadius: "1rem",
            background: "#f8fafc", border: "1px solid #e2e8f0",
          }}>
            <h3 style={{ margin: "0 0 1rem", fontSize: "1.05rem", color: "#0f172a" }}>
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
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
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
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
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
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
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
