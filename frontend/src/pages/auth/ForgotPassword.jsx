import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiMail,
} from "react-icons/fi";

import {
  ForgotContainer,
  ForgotCard,
  Logo,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  SuccessMessage,
  SubmitButton,
  BackButton,
} from "./ForgotPassword.style";

const ForgotPassword = () => {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const validateEmail = () => {

    if (!email.trim()) {

      setError(
        "Email is required."
      );

      return false;

    }

    const emailRegex =

      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (

      !emailRegex.test(email)

    ) {

      setError(
        "Please enter a valid email."
      );

      return false;

    }

    setError("");

    return true;

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validateEmail()) {

      return;

    }

    setLoading(true);

    setTimeout(() => {

      setLoading(false);

      setSuccess(true);

    }, 1500);

  };

  return (

    <ForgotContainer>

      <ForgotCard>

        <Logo>

          <FiMail />

        </Logo>

        <Title>

          Forgot Password

        </Title>

        <Subtitle>

          Enter your registered email address.
          We'll send you a password reset link.

        </Subtitle>

        {

          success ? (

            <>

              <SuccessMessage>

                Password reset link has been
                sent successfully.

              </SuccessMessage>

              <BackButton

                onClick={()=>

                  navigate("/login")

                }

              >

                ← Back to Login

              </BackButton>

            </>

          ) : (

            <Form
              onSubmit={handleSubmit}
            >

              <FormGroup>

                <Label>

                  Email Address

                </Label>

                <Input

                  type="email"

                  placeholder="Enter your email"

                  value={email}

                  onChange={(e)=>

                    setEmail(
                      e.target.value
                    )

                  }

                />

                {

                  error && (

                    <ErrorMessage>

                      {error}

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

                    ? "Sending..."

                    : "Send Reset Link"

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

      </ForgotCard>

    </ForgotContainer>

  );

};

export default ForgotPassword;