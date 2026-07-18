export const AUTH_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 10,

  ACCOUNT_LOCK_DURATION: 1 * 60 * 1000,

  PASSWORD_RESET_TOKEN_EXPIRY: 15 * 60 * 1000,

  ACCESS_TOKEN_PAYLOAD_FIELDS: [
    '_id',
    'email',
    'role',
  ],
};

export default AUTH_CONSTANTS;