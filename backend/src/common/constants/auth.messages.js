const AUTH_MESSAGES = {
  REGISTER: {
    SUCCESS: 'User registered successfully.',
  },

  LOGIN: {
    SUCCESS: 'Login successful.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    ACCOUNT_LOCKED:
      'Your account is temporarily locked. Please try again later.',
    ACCOUNT_INACTIVE:
      'Your account is inactive. Please contact the administrator.',
  },

  LOGOUT: {
    SUCCESS: 'Logout successful.',
  },

  USER: {
    NOT_FOUND: 'User not found.',
    EMAIL_ALREADY_EXISTS: 'Email already exists.',
    MOBILE_ALREADY_EXISTS: 'Mobile number already exists.',
    USERNAME_ALREADY_EXISTS: 'Username already exists.',
  },

  ROLE: {
    NOT_FOUND: 'Role not found.',
    INACTIVE: 'Assigned role is inactive.',
  },

  PASSWORD: {
    CHANGED: 'Password changed successfully.',
    RESET_SUCCESS: 'Password reset successfully.',
    INVALID: 'Invalid password.',
  },

  TOKEN: {
    INVALID: 'Invalid token.',
    EXPIRED: 'Token has expired.',
    REFRESH_REQUIRED: 'Refresh token is required.',
  },
};

export default AUTH_MESSAGES;