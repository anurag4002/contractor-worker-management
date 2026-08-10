import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiAtSign,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../components/common/toast";
import FormError from "../../components/ui/FormError";

import RegisterIntro from "./RegisterIntro";

import {
  RegisterPage,
  RegisterWrapper,
  LeftSection,
  RightSection,
  RegisterCard,
  CardHeader,
  CardTitle,
  CardSubtitle,
  RegisterForm,
  InputGroup,
  FieldLabel,
  InputWrapper,
  InputIcon,
  FormInput,
  PasswordField,
  PasswordToggle,
  RegisterButton,
  LoginLinkRow,
  LoginAnchor,
  CardFooter,
} from "./Register.style";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldError, setFieldError] = useState("");

  const handleChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
    if (fieldError) setFieldError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        username: formData.username,
        password: formData.password,
      };

      await register(payload);

      showSuccess("Super Admin created successfully.");

      navigate("/login");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const togglePassword = (setter) => () => setter((prev) => !prev);

  return (
    <RegisterPage>
      <RegisterWrapper>
        <LeftSection>
          <RegisterIntro />
        </LeftSection>

        <RightSection>
          <RegisterCard>
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardSubtitle>
                Set up your first administrator account to get started.
              </CardSubtitle>
            </CardHeader>

            <RegisterForm onSubmit={handleSubmit}>
              <InputGroup>
                <FieldLabel htmlFor="register-fullName" $required>
                  Full Name
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiUser size={18} />
                  </InputIcon>
                  <FormInput
                    id="register-fullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="register-email" $required>
                  Email Address
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiMail size={18} />
                  </InputIcon>
                  <FormInput
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="register-mobileNumber" $required>
                  Mobile Number
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiPhone size={18} />
                  </InputIcon>
                  <FormInput
                    id="register-mobileNumber"
                    type="tel"
                    name="mobileNumber"
                    placeholder="Enter mobile number"
                    autoComplete="tel"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="register-username" $required>
                  Username
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiAtSign size={18} />
                  </InputIcon>
                  <FormInput
                    id="register-username"
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="register-password" $required>
                  Password
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiLock size={18} />
                  </InputIcon>
                  <PasswordField
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={togglePassword(setShowPassword)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="register-confirmPassword" $required>
                  Confirm Password
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiLock size={18} />
                  </InputIcon>
                  <PasswordField
                    id="register-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={togglePassword(setShowConfirmPassword)}
                    disabled={loading}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputWrapper>
                <FormError error={fieldError} />
              </InputGroup>

              <RegisterButton type="submit" disabled={loading}>
                {loading ? "Creating Super Admin..." : "Create Super Admin"}
              </RegisterButton>
            </RegisterForm>

            <LoginLinkRow>
              Already have an account?{" "}
              <LoginAnchor to="/login">Login</LoginAnchor>
            </LoginLinkRow>

            <CardFooter>
              <span>© {currentYear} Contractor Worker Management</span>
            </CardFooter>
          </RegisterCard>
        </RightSection>
      </RegisterWrapper>
    </RegisterPage>
  );
};

export default Register;
