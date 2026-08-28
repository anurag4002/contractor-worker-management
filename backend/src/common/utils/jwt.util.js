import jwt from 'jsonwebtoken';
import env from '../../config/env.js';

/**
 * Generate Access Token
 * @param {Object} payload
 * @returns {string}
 */
export const generateAccessToken = (payload) => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Access token generation aborted.');
  }

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Generate Refresh Token
 * @param {Object} payload
 * @returns {string}
 */
export const generateRefreshToken = (payload) => {
  if (!env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not configured. Refresh token generation aborted.');
  }

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verify Access Token
 * @param {string} token
 * @returns {Object}
 */
export const verifyAccessToken = (token) => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Access token verification aborted.');
  }

  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Verify Refresh Token
 * @param {string} token
 * @returns {Object}
 */
export const verifyRefreshToken = (token) => {
  if (!env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not configured. Refresh token verification aborted.');
  }

  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

/**
 * Decode Token
 * (Does NOT verify signature)
 * @param {string} token
 * @returns {Object|null}
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};