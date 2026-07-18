import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiEye,
  FiEyeOff,
  FiShield,
} from "react-icons/fi";

import {
  LoginContainer,
  LoginCard,
  Logo,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  InputWrapper,
  Input,
  PasswordButton,
  Options,
  Remember,
  ForgotLink,
  LoginButton,
  Footer,
  ContactText,
  ErrorMessage,
} from "./Login.style";

const Login = () => {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [remember, setRemember] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const validate = () => {

    const newErrors = {};

    if (!email.trim()) {

      newErrors.email =
        "Email is required.";

    } else if (

      !/\S+@\S+\.\S+/.test(email)

    ) {

      newErrors.email =
        "Enter a valid email.";

    }

    if (!password.trim()) {

      newErrors.password =
        "Password is required.";

    } else if (

      password.length < 6

    ) {

      newErrors.password =
        "Minimum 6 characters required.";

    }

    setErrors(newErrors);

    return Object.keys(newErrors)
      .length === 0;

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "rememberMe",
        remember
      );

      setLoading(false);

      navigate("/dashboard");

    }, 1200);

  };

  return (

    <LoginContainer>

      <LoginCard>

        <Logo>

          <FiShield />

        </Logo>

        <Title>

          Welcome Back

        </Title>

        <Subtitle>

          Contractor Worker Management System

        </Subtitle>

        <Form
          onSubmit={handleSubmit}
        >

          <FormGroup>

            <Label>

              Email

            </Label>

            <Input

              type="email"

              placeholder="Enter email"

              value={email}

              onChange={(e)=>

                setEmail(
                  e.target.value
                )

              }

            />

            {

              errors.email && (

                <ErrorMessage>

                  {errors.email}

                </ErrorMessage>

              )

            }

          </FormGroup>

          <FormGroup>

            <Label>

              Password

            </Label>

            <InputWrapper>

              <Input

                type={

                  showPassword

                    ? "text"

                    : "password"

                }

                placeholder="Enter password"

                value={password}

                onChange={(e)=>

                  setPassword(
                    e.target.value
                  )

                }

              />

              <PasswordButton

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

              </PasswordButton>

            </InputWrapper>

            {

              errors.password && (

                <ErrorMessage>

                  {errors.password}

                </ErrorMessage>

              )

            }

          </FormGroup>

          <Options>

            <Remember>

              <input

                type="checkbox"

                checked={remember}

                onChange={(e)=>

                  setRemember(

                    e.target.checked

                  )

                }

              />

              Remember Me

            </Remember>

            <ForgotLink

              type="button"

              onClick={()=>

                navigate(

                  "/forgot-password"

                )

              }

            >

              Forgot Password?

            </ForgotLink>

          </Options>

          <LoginButton

            type="submit"

            disabled={loading}

          >

            {

              loading

                ? "Logging in..."

                : "Login"

            }

          </LoginButton>

        </Form>

        <Footer>

          Don't have an account?

          <br />

          <ContactText>

            Contact Administrator

          </ContactText>

        </Footer>

      </LoginCard>

    </LoginContainer>

  );

};

export default Login;