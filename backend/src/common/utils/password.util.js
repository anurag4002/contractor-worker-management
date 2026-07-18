import bcrypt from 'bcryptjs';
import env from '../../config/env.js';

export const hashPassword = async (password) => {
  return bcrypt.hash(
    password,
    env.BCRYPT_SALT_ROUNDS
  );
};

export const comparePassword = async (
  plainPassword,
  hashedPassword
) => {
  return bcrypt.compare(
    plainPassword,
    hashedPassword
  );
};