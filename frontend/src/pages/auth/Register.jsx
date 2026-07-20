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

import authService from "../../services/auth.service";

import {
  RegisterContainer,
  RegisterCard,
  Logo,
  Heading,
  SubHeading,
  Form,
  InputGroup,
  Input,
  RegisterButton,
  Footer,
} from "./Register.style";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber:
          formData.mobileNumber,
        username: formData.username,
        password: formData.password,
      };

      const response =
        await authService.register(
          payload
        );

      alert(
        response.message ||
          "Super Admin created successfully."
      );

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>CW</Logo>

        <Heading>
          Create Super Admin
        </Heading>

        <SubHeading>
          Create your first
          administrator account
        </SubHeading>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <User size={18} />

            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Mail size={18} />

            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Phone size={18} />

            <Input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={
                formData.mobileNumber
              }
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <AtSign size={18} />

            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Lock size={18} />

            <Input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              style={{
                cursor: "pointer",
              }}
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </span>
          </InputGroup>

          <InputGroup>
            <Lock size={18} />

            <Input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              required
            />

            <span
              style={{
                cursor: "pointer",
              }}
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </span>
          </InputGroup>

          <RegisterButton
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Super Admin"}
          </RegisterButton>
        </Form>

        <Footer>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </Footer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;