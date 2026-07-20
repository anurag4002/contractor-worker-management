import { useState } from "react";

import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";

import { Link } from "react-router-dom";

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

  const [error, setError] =
    useState("");

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

  const handleSubmit = (e) => {

    e.preventDefault();

    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;

    }

    setError("");

    alert(
      "Password Reset Successfully"
    );

    // Backend API
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

              onChange={(e)=>

                setPassword(
                  e.target.value
                )

              }

              required

            />

            <ToggleButton
              type="button"
              onClick={()=>

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

              onChange={(e)=>

                setConfirmPassword(

                  e.target.value

                )

              }

              required

            />

            <ToggleButton
              type="button"
              onClick={()=>

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

          {

            error && (

              <ErrorMessage>

                {error}

              </ErrorMessage>

            )

          }

          <Button>

            Reset Password

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