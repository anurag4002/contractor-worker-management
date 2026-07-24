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
import { showSuccess, showError } from "../../components/common/toast";

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
  FooterText,
} from "./Login.style";

import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../../components/ui/FormError";
import LoadingButton from "../../components/ui/LoadingButton";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const { errors: apiErrors, clearFieldError, handleError } = useFormErrors();

  const handleInputChange = (e) => {
    handleChange(e);
    clearFieldError(e.target.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await login({
        email: values.email,
        password: values.password,
      });

      if (!response || response.error) {
        showError("Login failed.");
        return;
      }

      showSuccess("Logged in successfully!");
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
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
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </InputGroup>

          <FormError error={errors.email || apiErrors.email} />

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
              onChange={handleInputChange}
              disabled={isSubmitting}
            />

            <PasswordButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </PasswordButton>
          </InputGroup>

          <FormError error={errors.password || apiErrors.password} />

          <Options>
            <Checkbox>
              <input
                type="checkbox"
                name="remember"
                checked={values.remember}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Remember Me
            </Checkbox>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </Options>

          <LoadingButton
            type="submit"
            loading={isSubmitting}
            loadingText="Logging In..."
            style={{
              width: "100%", padding: "0.95rem", borderRadius: "0.8rem",
              background: "#2563EB", color: "white", fontSize: "1rem",
              fontWeight: 600, border: "none", cursor: "pointer",
              transition: "0.3s", marginTop: "1rem"
            }}
          >
            Login
          </LoadingButton>
        </Form>

        <FooterText>
          Contractor Worker Management
        </FooterText>
      </Card>
    </Page>
  );
};

export default Login;