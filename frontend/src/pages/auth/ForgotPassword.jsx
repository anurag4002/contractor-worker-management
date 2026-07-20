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

const ForgotPassword = () => {

  const [email, setEmail] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!email) return;

    // Backend API

    setSuccess(true);

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

              onChange={(e)=>

                setEmail(e.target.value)

              }

              required

            />

          </InputGroup>

          <Button>

            Send Reset Link

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