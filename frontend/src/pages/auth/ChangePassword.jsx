import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../components/common/toast";

import {
  FormPage,
  FormContainer,
  FormHeader,
  FormTitle,
  FormSubtitle,
  FormField,
  FormLabel,
  FormInput,
  FormError,
  ButtonGroup,
  SecondaryButton,
  PrimaryButton,
} from "../../components/ui/form";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { changePassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.currentPassword) newErrors.currentPassword = "Current password is required.";
    if (!form.newPassword) newErrors.newPassword = "New password is required.";
    else if (form.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.newPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await changePassword(form.currentPassword, form.newPassword);
      showSuccess("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPage>
      <FormContainer style={{ maxWidth: "32rem" }}>
        <FormHeader>
          <div>
            <FormTitle>Change Password</FormTitle>
            <FormSubtitle>Update your account password.</FormSubtitle>
          </div>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <FormField>
            <FormLabel $required>Current Password</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type={showOldPassword ? "text" : "password"}
                name="currentPassword"
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={handleChange}
                style={{ paddingLeft: "2.9rem", paddingRight: "2.9rem" }}
              />
              <FiLock style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                }}
              >
                {showOldPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.currentPassword && <FormError error={errors.currentPassword} />}
          </FormField>

          <FormField>
            <FormLabel $required>New Password</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New password"
                value={form.newPassword}
                onChange={handleChange}
                style={{ paddingLeft: "2.9rem", paddingRight: "2.9rem" }}
              />
              <FiLock style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                }}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.newPassword && <FormError error={errors.newPassword} />}
          </FormField>

          <FormField>
            <FormLabel $required>Confirm Password</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                style={{ paddingLeft: "2.9rem", paddingRight: "2.9rem" }}
              />
              <FiLock style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                }}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && <FormError error={errors.confirmPassword} />}
          </FormField>

          <ButtonGroup>
            <SecondaryButton type="button" onClick={() => navigate(-1)}>
              <FiArrowLeft /> Back
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              <FiSave /> {loading ? "Updating..." : "Update Password"}
            </PrimaryButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    </FormPage>
  );
};

export default ChangePassword;
