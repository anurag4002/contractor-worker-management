import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import useFormErrors from "../../hooks/useFormErrors";
import { validateLogin } from "../../validators/auth.validator";
import { showSuccess, showError } from "../../components/common/toast";
import FormError from "../../components/ui/FormError";

import LoginIntro from "../auth/LoginIntro";

import {
  LoginPage,
  LoginWrapper,
  LeftSection,
  RightSection,
  LoginCard,
  CardHeader,
  CardTitle,
  CardSubtitle,
  LoginForm,
  InputGroup,
  FieldLabel,
  InputWrapper,
  InputIcon,
  LoginInput,
  PasswordInput,
  PasswordToggle,
  SignInButton,
  CardFooter,
  LoginLinkRow,
  LoginAnchor,
} from "../auth/Login.style";

const SuperAdminLogin = () => {
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

      const user = response?.data?.data?.user || response?.data?.user || {};
      const role = user?.role?.code || user?.role;

      if (role !== "SUPER_ADMIN") {
        showError("Access denied. Super Admin credentials required.");
        return;
      }

      showSuccess("Welcome back, Super Admin!");
      navigate("/super-admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <LoginPage>
      <LoginWrapper>
        <LeftSection>
          <LoginIntro />
        </LeftSection>

        <RightSection>
          <LoginCard>
            <CardHeader>
              <CardTitle>
                <FiShield style={{ marginRight: 8, verticalAlign: "middle" }} />
                Super Admin Login
              </CardTitle>
              <CardSubtitle>
                Platform administration access only.
              </CardSubtitle>
            </CardHeader>

            <LoginForm onSubmit={handleSubmit} noValidate>
              <InputGroup>
                <FieldLabel htmlFor="superadmin-login-email" $required>
                  Email
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiMail size={18} />
                  </InputIcon>
                  <LoginInput
                    id="superadmin-login-email"
                    type="email"
                    name="email"
                    placeholder="Enter super admin email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </InputWrapper>
                <FormError error={errors.email || apiErrors.email} />
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="superadmin-login-password" $required>
                  Password
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiLock size={18} />
                  </InputIcon>
                  <PasswordInput
                    id="superadmin-login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isSubmitting}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputWrapper>
                <FormError error={errors.password || apiErrors.password} />
              </InputGroup>

              <SignInButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In as Super Admin"}
              </SignInButton>
            </LoginForm>

            <LoginLinkRow>
              <LoginAnchor to="/login">
                Back to Contractor Login
              </LoginAnchor>
            </LoginLinkRow>

            <CardFooter>
              <span>© {currentYear} Contractor Worker Management</span>
            </CardFooter>
          </LoginCard>
        </RightSection>
      </LoginWrapper>
    </LoginPage>
  );
};

export default SuperAdminLogin;
