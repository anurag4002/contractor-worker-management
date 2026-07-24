import { useState } from "react";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiSave,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../components/common/toast";

import {
  Page,
  Card,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Icon,
  Input,
  ToggleButton,
  ErrorText,
  SaveButton,
} from "./ChangePassword.style";

const ChangePassword = () => {
  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] =
    useState({});

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const { changePassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.currentPassword) {
      newErrors.currentPassword =
        "Current password is required.";
    }

    if (!form.newPassword) {
      newErrors.newPassword =
        "New password is required.";
    } else if (
      form.newPassword.length < 8
    ) {
      newErrors.newPassword =
        "Password must be at least 8 characters.";
    }

    if (
      form.confirmPassword !==
      form.newPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors)
      .length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      await changePassword(form.currentPassword, form.newPassword);
      showSuccess("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <Page>

      <Card>

        <Title>

          Change Password

        </Title>

        <Subtitle>

          Update your account password.

        </Subtitle>

        <Form
          onSubmit={handleSubmit}
        >

          <InputGroup>

            <Icon>

              <FiLock />

            </Icon>

            <Input
              type={
                showOldPassword
                  ? "text"
                  : "password"
              }
              name="currentPassword"
              placeholder="Current Password"
              value={
                form.currentPassword
              }
              onChange={handleChange}
            />

            <ToggleButton
              type="button"
              onClick={() =>
                setShowOldPassword(
                  !showOldPassword
                )
              }
            >
              {showOldPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </ToggleButton>

          </InputGroup>

          {errors.currentPassword && (
            <ErrorText>
              {errors.currentPassword}
            </ErrorText>
          )}

          <InputGroup>

            <Icon>

              <FiLock />

            </Icon>

            <Input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              name="newPassword"
              placeholder="New Password"
              value={
                form.newPassword
              }
              onChange={handleChange}
            />

            <ToggleButton
              type="button"
              onClick={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
            >
              {showNewPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </ToggleButton>

          </InputGroup>

          {errors.newPassword && (
            <ErrorText>
              {errors.newPassword}
            </ErrorText>
          )}

          <InputGroup>

            <Icon>

              <FiLock />

            </Icon>

            <Input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              value={
                form.confirmPassword
              }
              onChange={handleChange}
            />

            <ToggleButton
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </ToggleButton>

          </InputGroup>

          {errors.confirmPassword && (
            <ErrorText>
              {errors.confirmPassword}
            </ErrorText>
          )}

          <SaveButton
            type="submit"
            disabled={loading}
          >
            <FiSave />

            {loading ? "Updating..." : "Update Password"}

          </SaveButton>

        </Form>

      </Card>

    </Page>
  );
};

export default ChangePassword;