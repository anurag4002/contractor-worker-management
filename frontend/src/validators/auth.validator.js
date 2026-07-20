export const validateEmail = (email) => {
  if (!email.trim()) {
    return "Email is required.";
  }

  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) {
    return "Please enter a valid email address.";
  }

  return "";
};

export const validatePassword = (
  password
) => {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return "";
};

export const validateConfirmPassword = (
  password,
  confirmPassword
) => {
  if (!confirmPassword) {
    return "Confirm password is required.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
};

export const validateLogin = (
  values
) => {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
};

export const validateForgotPassword = (
  values
) => {
  return {
    email: validateEmail(values.email),
  };
};

export const validateResetPassword = (
  values
) => {
  return {
    password: validatePassword(
      values.password
    ),
    confirmPassword:
      validateConfirmPassword(
        values.password,
        values.confirmPassword
      ),
  };
};