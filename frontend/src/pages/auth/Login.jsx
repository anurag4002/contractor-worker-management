import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import useFormErrors from "../../hooks/useFormErrors";
import { validateLogin } from "../../validators/auth.validator";
import { showSuccess, showError } from "../../components/common/toast";
import FormError from "../../components/ui/FormError";

import LoginIntro from "./LoginIntro";

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
  OptionsRow,
  RememberLabel,
  ForgotLink,
  SignInButton,
  RegisterLink,
  RegisterAnchor,
  CardFooter,
} from "./Login.style";

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
        showError("Unable to log in. Please check your details and try again.");
        return;
      }

      const user = response?.data?.data?.user || response?.data?.user || {};
      const role = user?.role?.code || user?.role;

      showSuccess("Logged in successfully.");

      if (role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
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
              <CardTitle>Welcome Back</CardTitle>
              <CardSubtitle>
                Sign in to continue to your workspace.
              </CardSubtitle>
            </CardHeader>

            <LoginForm onSubmit={handleSubmit} noValidate>
              <InputGroup>
                <FieldLabel htmlFor="login-email" $required>
                  Email
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiMail size={18} />
                  </InputIcon>
                  <LoginInput
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </InputWrapper>
                <FormError error={errors.email || apiErrors.email} />
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="login-password" $required>
                  Password
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiLock size={18} />
                  </InputIcon>
                  <PasswordInput
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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

              <OptionsRow>
                <RememberLabel>
                  <input
                    type="checkbox"
                    name="remember"
                    checked={values.remember}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    autoComplete="remember-token"
                  />
                  Remember me
                </RememberLabel>
                <ForgotLink to="/forgot-password">
                  Forgot password?
                </ForgotLink>
              </OptionsRow>

               <SignInButton type="submit" disabled={isSubmitting}>
                 {isSubmitting ? "Signing in..." : "Sign in"}
               </SignInButton>
            </LoginForm>

            <RegisterLink>
              Don't have an account?{" "}
              <RegisterAnchor to="/register">
                Sign up
              </RegisterAnchor>
            </RegisterLink>

            <CardFooter>
              <span>© {currentYear} Contractor Worker Management</span>
            </CardFooter>
          </LoginCard>
        </RightSection>
      </LoginWrapper>
    </LoginPage>
  );
};

export default Login;
