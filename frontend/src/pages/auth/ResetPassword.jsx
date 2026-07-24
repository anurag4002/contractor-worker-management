import { useState } from "react";

import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";

import { Link, useSearchParams, useNavigate } from "react-router-dom";

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
  PasswordStrength,
  ErrorMessage,
  Button,
  Footer,
} from "./ResetPassword.style";

const ResetPassword = () => {

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const getStrength = () => {

    if (password.length < 6) {

      return {
        text: "Weak",
        color: "#DC2626",
      };

    }

    if (password.length < 10) {

      return {
        text: "Medium",
        color: "#F59E0B",
      };

    }

    return {
      text: "Strong",
      color: "#16A34A",
    };

  };

  const strength =
    getStrength();

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    if (!token) {
      showError("Reset token is missing from the URL.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password);
      showSuccess("Password Reset Successfully");
      navigate("/login", { replace: true });
    } catch (err) {
      showError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <Page>

      <Card>

        <Title>

          Reset Password

        </Title>

        <Subtitle>

          Create your new password.

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
                showPassword
                  ? "text"
                  : "password"
              }

              placeholder="New Password"

              value={password}

              onChange={(e) =>

                setPassword(
                  e.target.value
                )

              }

              required

            />

            <ToggleButton
              type="button"
              onClick={() =>

                setShowPassword(

                  !showPassword

                )

              }
            >

              {

                showPassword

                  ? <FiEyeOff />

                  : <FiEye />

              }

            </ToggleButton>

          </InputGroup>

          <PasswordStrength
            color={strength.color}
          >

            Password Strength :

            {" "}

            {strength.text}

          </PasswordStrength>

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

              placeholder="Confirm Password"

              value={confirmPassword}

              onChange={(e) =>

                setConfirmPassword(

                  e.target.value

                )

              }

              required

            />

            <ToggleButton
              type="button"
              onClick={() =>

                setShowConfirmPassword(

                  !showConfirmPassword

                )

              }
            >

              {

                showConfirmPassword

                  ? <FiEyeOff />

                  : <FiEye />

              }

            </ToggleButton>

          </InputGroup>

          {/* Removed internal error mapping, relying on toast */}

          <Button disabled={loading}>

            {loading ? "Resetting..." : "Reset Password"}

          </Button>

        </Form>

        <Footer>

          <Link
            to="/login"
          >

            <FiArrowLeft />

            Back to Login

          </Link>

        </Footer>

      </Card>

    </Page>

  );

};

export default ResetPassword;