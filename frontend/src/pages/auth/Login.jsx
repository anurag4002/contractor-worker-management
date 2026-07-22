import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import { validateLogin } from "../../validators/auth.validator";

import {
  Page,
  Card,
  Logo,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Input,
  Icon,
  PasswordButton,
  Options,
  Checkbox,
  LoginButton,
  FooterText,
  ErrorText,
} from "./Login.style";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const {
    values,
    errors,
    handleChange,
    validateForm,
  } = useForm(
    {
      email: "",
      password: "",
      remember: false,
    },
    validateLogin
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: values.email,
        password: values.password,
      });

      if (!response.success) {
        alert(
          response.message ||
            "Login failed."
        );
        return;
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Logo>
          Contractor Worker
        </Logo>

        <Title>
          Welcome Back
        </Title>

        <Subtitle>
          Login to continue
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Icon>
              <FiMail />
            </Icon>

            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={values.email}
              onChange={handleChange}
              disabled={loading}
            />
          </InputGroup>

          {errors.email && (
            <ErrorText>
              {errors.email}
            </ErrorText>
          )}

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
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              disabled={loading}
            />

            <PasswordButton
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              disabled={loading}
            >
              {showPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </PasswordButton>
          </InputGroup>

          {errors.password && (
            <ErrorText>
              {errors.password}
            </ErrorText>
          )}

          <Options>
            <Checkbox>
              <input
                type="checkbox"
                name="remember"
                checked={values.remember}
                onChange={handleChange}
                disabled={loading}
              />
              Remember Me
            </Checkbox>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </Options>

          <LoginButton
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </LoginButton>
        </Form>

        <FooterText>
          Contractor Worker Management
        </FooterText>
      </Card>
    </Page>
  );
};

export default Login;