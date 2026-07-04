import jwt from 'jsonwebtoken';
import env from '../../config/env.js';

/**
 * Generate Access Token
 * @param {Object} payload
 * @returns {string}
 */
export const generateAccessToken = (payload) => {
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
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Verify Refresh Token
 * @param {string} token
 * @returns {Object}
 */
export const verifyRefreshToken = (token) => {
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