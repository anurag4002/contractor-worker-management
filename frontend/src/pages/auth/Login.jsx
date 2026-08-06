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
  FormPage,
  FormContainer,
  FormHeader,
  FormTitle,
  FormSubtitle,
  FormField,
  FormLabel,
  FormInput,
  FormCheckbox,
  PrimaryButton,
} from "../../components/ui/form";

import useFormErrors from "../../hooks/useFormErrors";
import FormError from "../../components/ui/FormError";

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
    <FormPage style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-hover))" }}>
      <FormContainer style={{ maxWidth: "28rem", padding: "2.5rem" }}>
        <FormHeader>
          <div style={{ textAlign: "center", width: "100%" }}>
            <FormTitle style={{ fontSize: "2rem", textAlign: "center" }}>
              Welcome Back
            </FormTitle>
            <FormSubtitle style={{ textAlign: "center", marginTop: "0.4rem" }}>
              Login to continue
            </FormSubtitle>
          </div>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <FormField>
            <FormLabel $required>Email</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type="email"
                name="email"
                placeholder="Email Address"
                value={values.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                style={{ paddingLeft: "2.9rem" }}
              />
              <FiMail style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} size={18} />
            </div>
            <FormError error={errors.email || apiErrors.email} />
          </FormField>

          <FormField>
            <FormLabel $required>Password</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                style={{ paddingLeft: "2.9rem", paddingRight: "2.9rem" }}
              />
              <FiLock style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                style={{
                  position: "absolute",
                  right: "0.9rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <FormError error={errors.password || apiErrors.password} />
          </FormField>

          <FormField style={{ marginTop: "1rem" }}>
            <FormCheckbox>
              <input
                type="checkbox"
                name="remember"
                checked={values.remember}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Remember Me
            </FormCheckbox>

            <Link to="/forgot-password" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              Forgot Password?
            </Link>
          </FormField>

          <div style={{ marginTop: "1rem" }}>
            <PrimaryButton type="submit" disabled={isSubmitting} style={{ width: "100%" }}>
              {isSubmitting ? "Logging In..." : "Login"}
            </PrimaryButton>
          </div>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Contractor Worker Management
        </div>
      </FormContainer>
    </FormPage>
  );
};

export default Login;
