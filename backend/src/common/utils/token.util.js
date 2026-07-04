import crypto from 'crypto';

/**
 * Generate a secure random token.
 *
 * @param {number} size - Token size in bytes.
 * @returns {string}
 */
export const generateRandomToken = (size = 32) => {
  return crypto.randomBytes(size).toString('hex');
};

/**
 * Generate Password Reset Token
 *
 * @returns {string}
 */
export const generatePasswordResetToken = () => {
  return generateRandomToken(32);
};

/**
 * Generate Email Verification Token
 *
 * @returns {string}
 */
export const generateEmailVerificationToken = () => {
  return generateRandomToken(32);
};

/**
 * Generate Mobile Verification Token
 *
 * @returns {string}
 */
export const generateMobileVerificationToken = () => {
  return generateRandomToken(32);
};