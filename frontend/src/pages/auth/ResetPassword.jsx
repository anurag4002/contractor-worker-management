import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import {
  ResetContainer,
  ResetCard,
  Logo,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  InputWrapper,
  Input,
  ToggleButton,
  PasswordStrength,
  ErrorMessage,
  SuccessMessage,
  SubmitButton,
  BackButton,
} from "./ResetPassword.style";

const ResetPassword = () => {

  const navigate =
    useNavigate();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const getStrength = () => {

    if (password.length < 6) {

      return "Weak";

    }

    if (password.length < 10) {

      return "Medium";

    }

    return "Strong";

  };

  const validate = () => {

    const newErrors = {};

    if (!password.trim()) {

      newErrors.password =
        "Password is required.";

    } else if (
      password.length < 6
    ) {

      newErrors.password =
        "Minimum 6 characters required.";

    }

    if (!confirmPassword.trim()) {

      newErrors.confirmPassword =
        "Confirm password is required.";

    } else if (
      password !== confirmPassword
    ) {

      newErrors.confirmPassword =
        "Passwords do not match.";

    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validate()) {

      return;

    }

    setLoading(true);

    setTimeout(() => {

      setLoading(false);

      setSuccess(true);

      setTimeout(() => {

        navigate("/login");

      }, 2000);

    }, 1500);

  };

  return (

    <ResetContainer>

      <ResetCard>

        <Logo>

          <FiLock />

        </Logo>

        <Title>

          Reset Password

        </Title>

        <Subtitle>

          Create a new secure password.

        </Subtitle>

        {

          success ? (

            <>

              <SuccessMessage>

                Password updated successfully.

                <br />

                Redirecting to login...

              </SuccessMessage>

            </>

          ) : (

            <Form
              onSubmit={handleSubmit}
            >

              <FormGroup>

                <Label>

                  New Password

                </Label>

                <InputWrapper>

                  <Input

                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    placeholder="Enter new password"

                    value={password}

                    onChange={(e)=>

                      setPassword(
                        e.target.value
                      )

                    }

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

                </InputWrapper>

                <PasswordStrength
                  strength={getStrength()}
                >

                  Strength :

                  {" "}

                  {getStrength()}

                </PasswordStrength>

                {

                  errors.password && (

                    <ErrorMessage>

                      {errors.password}

                    </ErrorMessage>

                  )

                }

              </FormGroup>

              <FormGroup>

                <Label>

                  Confirm Password

                </Label>

                <InputWrapper>

                  <Input

                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }

                    placeholder="Confirm password"

                    value={confirmPassword}

                    onChange={(e)=>

                      setConfirmPassword(
                        e.target.value
                      )

                    }

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

                </InputWrapper>

                {

                  errors.confirmPassword && (

                    <ErrorMessage>

                      {

                        errors.confirmPassword

                      }

                    </ErrorMessage>

                  )

                }

              </FormGroup>

              <SubmitButton

                type="submit"

                disabled={loading}

              >

                {

                  loading

                    ? "Updating..."

                    : "Reset Password"

                }

              </SubmitButton>

              <BackButton

                type="button"

                onClick={()=>

                  navigate("/login")

                }

              >

                ← Back to Login

              </BackButton>

            </Form>

          )

        }

      </ResetCard>

    </ResetContainer>

  );

};

export default ResetPassword;