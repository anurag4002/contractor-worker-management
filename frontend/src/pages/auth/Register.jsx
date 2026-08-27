import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiAtSign,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../components/common/toast";
import FormError from "../../components/ui/FormError";

import RegisterIntro from "./RegisterIntro";

import {
  validateEmail,
} from "../../validators/auth.validator";

import { PLAN } from "../../constants/subscription";

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
  PlanBadge,
  PlanInfo,
  PlanName,
  PlanPrice,
  TrialBadge,
} from "./Register.style";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const billingCycleParam = searchParams.get("billingCycle");
  const billingCycle = billingCycleParam === "YEARLY" || billingCycleParam === "MONTHLY"
    ? billingCycleParam
    : "MONTHLY";

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
    companyName: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[target.name];
      return next;
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = "Full name is required (min 2 characters).";
    }

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (formData.username && !/^[a-zA-Z0-9._]{3,30}$/.test(formData.username)) {
      errors.username = "Username can only contain letters, numbers, dots and underscores (3-30 characters).";
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (formData.companyName.trim().length < 2) {
      errors.companyName = "Company name must contain at least 2 characters.";
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Pincode must be a 6-digit number.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('[REGISTER-V2] React handleSubmit fired');
    console.log('[REGISTER-V2] event.type:', e.type);
    console.log('[REGISTER-V2] defaultPrevented:', e.defaultPrevented);
    console.log('[REGISTER-V2] currentTarget:', e.currentTarget?.tagName, e.currentTarget?.attributes?.getNamedItem('action')?.value || 'no-action');

    if (!validateForm()) {
      showError("Please correct the errors in the form.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        username: formData.username.trim() || undefined,
        password: formData.password,
        companyName: formData.companyName.trim(),
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        district: formData.district.trim() || undefined,
        state: formData.state.trim() || undefined,
        pincode: formData.pincode.trim() || undefined,
        billingCycle,
      };

      console.log('[REGISTER-V2] About to call AuthContext.register()');
      console.log('[REGISTER-V2] billingCycle:', billingCycle);
      console.log('[REGISTER-V2] payload keys:', Object.keys(payload));

      const response = await register(payload);

      console.log('[REGISTER-V2] Registration response received:', response);

      const authData = response?.data || response || {};
      const { user, accessToken, refreshToken } = authData;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("accessToken", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      showSuccess("Contractor account created successfully. Welcome to your 7-day free trial!");

      navigate(`/onboarding/payment?billingCycle=${billingCycle}`, { replace: true });
    } catch (error) {
      console.log('[REGISTER-V2] Registration error:', error.response?.status, error.response?.data);
      const serverFieldErrors = error?.response?.data?.errors;
      if (serverFieldErrors && typeof serverFieldErrors === 'object') {
        setFieldErrors((prev) => ({ ...prev, ...serverFieldErrors }));
        const messages = Object.values(serverFieldErrors).filter(Boolean);
        if (messages.length === 1) {
          showError(messages[0]);
        } else if (messages.length > 1) {
          showError(`${messages[0]} and ${messages.length - 1} other field(s) need attention.`);
        }
      } else {
        showError(error);
      }
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
          <RegisterIntro onIntroComplete={() => {}} />
        </LeftSection>

        <RightSection>
          <RegisterCard>
            <CardHeader>
              <CardTitle>Create Your Contractor Account</CardTitle>
              <CardSubtitle>
                Start your 7-day free trial of Contractor Pro.
              </CardSubtitle>
            </CardHeader>

            <PlanBadge>
              <PlanName>{PLAN.name}</PlanName>
              <PlanPrice>
                {billingCycle === "MONTHLY"
                  ? `₹${PLAN.monthlyPrice.toLocaleString("en-IN")}/month`
                  : `₹${PLAN.yearlyPrice.toLocaleString("en-IN")}/year`}
              </PlanPrice>
              <TrialBadge>7-Day Free Trial</TrialBadge>
            </PlanBadge>

            <RegisterForm onSubmit={handleSubmit}>
              <InputGroup>
                <FieldLabel htmlFor="register-companyName" $required>
                  Company / Contractor Name
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiBriefcase size={18} />
                  </InputIcon>
                  <FormInput
                    id="register-companyName"
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  {fieldErrors.companyName && (
                    <FormError error={fieldErrors.companyName} />
                  )}
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="register-fullName" $required>
                  Owner / Admin Name
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiUser size={18} />
                  </InputIcon>
                  <FormInput
                    id="register-fullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter owner/admin name"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  {fieldErrors.fullName && (
                    <FormError error={fieldErrors.fullName} />
                  )}
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
                    placeholder="Enter email address"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  {fieldErrors.email && (
                    <FormError error={fieldErrors.email} />
                  )}
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
                  {fieldErrors.mobileNumber && (
                    <FormError error={fieldErrors.mobileNumber} />
                  )}
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="register-username">
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
                    placeholder="Choose a username (optional)"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {fieldErrors.username && (
                    <FormError error={fieldErrors.username} />
                  )}
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
                  {fieldErrors.password && (
                    <FormError error={fieldErrors.password} />
                  )}
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
                {fieldErrors.confirmPassword && (
                  <FormError error={fieldErrors.confirmPassword} />
                )}
              </InputGroup>

              <InputGroup>
                <FieldLabel htmlFor="register-address">
                  Address
                </FieldLabel>
                <InputWrapper>
                  <InputIcon>
                    <FiMapPin size={18} />
                  </InputIcon>
                  <FormInput
                    id="register-address"
                    type="text"
                    name="address"
                    placeholder="Office address (optional)"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </InputWrapper>
              </InputGroup>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <InputGroup>
                  <FieldLabel htmlFor="register-city">City</FieldLabel>
                  <FormInput
                    id="register-city"
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </InputGroup>

                <InputGroup>
                  <FieldLabel htmlFor="register-state">State</FieldLabel>
                  <FormInput
                    id="register-state"
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </InputGroup>

                <InputGroup>
                  <FieldLabel htmlFor="register-pincode">Pincode</FieldLabel>
                  <FormInput
                    id="register-pincode"
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {fieldErrors.pincode && (
                    <FormError error={fieldErrors.pincode} />
                  )}
                </InputGroup>
              </div>

              <RegisterButton type="submit" disabled={loading}>
                {loading ? "Starting Free Trial..." : "Start Free Trial"}
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
