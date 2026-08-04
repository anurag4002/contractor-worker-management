import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  AtSign,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
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
  PrimaryButton,
  FormError,
} from "../../components/ui/form";

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

      const response = await register(payload);

      showSuccess(
        response.data?.message || "Super Admin created successfully."
      );

      navigate("/login");
    } catch (error) {
      showError(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPage style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-hover))" }}>
      <FormContainer style={{ maxWidth: "34rem", padding: "2.5rem" }}>
        <FormHeader style={{ textAlign: "center" }}>
          <div style={{ width: "5rem", height: "5rem", margin: "0 auto 1.5rem", borderRadius: "1rem", background: "var(--primary)", color: "var(--surface)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.6rem", fontWeight: 700 }}>
            CW
          </div>
          <FormTitle style={{ fontSize: "2.2rem", textAlign: "center", marginBottom: "0.5rem" }}>
            Create Super Admin
          </FormTitle>
          <FormSubtitle style={{ textAlign: "center", marginBottom: "2rem" }}>
            Create your first administrator account
          </FormSubtitle>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <FormField>
            <FormLabel $required>Full Name</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.9rem" }}
              />
              <User size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            </div>
          </FormField>

          <FormField>
            <FormLabel $required>Email</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.9rem" }}
              />
              <Mail size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            </div>
          </FormField>

          <FormField>
            <FormLabel $required>Mobile Number</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.9rem" }}
              />
              <Phone size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            </div>
          </FormField>

          <FormField>
            <FormLabel $required>Username</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.9rem" }}
              />
              <AtSign size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            </div>
          </FormField>

          <FormField>
            <FormLabel $required>Password</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.9rem", paddingRight: "2.9rem" }}
              />
              <Lock size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <span
                style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--text-secondary)" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </FormField>

          <FormField>
            <FormLabel $required>Confirm Password</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.9rem", paddingRight: "2.9rem" }}
              />
              <Lock size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <span
                style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--text-secondary)" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </FormField>

          {fieldError && <FormError error={fieldError} />}

          <FormField style={{ marginTop: "1rem" }}>
            <PrimaryButton type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Creating..." : "Create Super Admin"}
            </PrimaryButton>
          </FormField>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Login
          </Link>
        </div>
      </FormContainer>
    </FormPage>
  );
};

export default Register;
