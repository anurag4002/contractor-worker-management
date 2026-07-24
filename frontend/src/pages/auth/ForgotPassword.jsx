import { useState } from "react";

import {
  FiArrowLeft,
  FiMail,
} from "react-icons/fi";

import { Link } from "react-router-dom";

import {
  Page,
  Card,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Icon,
  Input,
  Button,
  Footer,
  SuccessMessage,
} from "./ForgotPassword.style";

import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../components/common/toast";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!email) return;

    try {
      setLoading(true);
      await forgotPassword(email);
      setSuccess(true);
      showSuccess("Reset password link sent to your email.");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to send reset link.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }

  };

  return (

    <Page>

      <Card>

        <Title>

          Forgot Password

        </Title>

        <Subtitle>

          Enter your registered email address.

        </Subtitle>

        {

          success && (

            <SuccessMessage>

              Reset password link has been sent to your email.

            </SuccessMessage>

          )

        }

        <Form
          onSubmit={handleSubmit}
        >

          <InputGroup>

            <Icon>

              <FiMail />

            </Icon>

            <Input

              type="email"

              placeholder="Email Address"

              value={email}

              onChange={(e) =>

                setEmail(e.target.value)

              }

              required

            />

          </InputGroup>

          <Button disabled={loading}>

            {loading ? "Sending..." : "Send Reset Link"}

          </Button>

        </Form>

        <Footer>

          <Link to="/login">

            <FiArrowLeft />

            Back to Login

          </Link>

        </Footer>

      </Card>

    </Page>

  );

};

export default ForgotPassword;