import { Router } from 'express';

import authController from '../controllers/auth.controller.js';

import validate from '../middlewares/validate.middleware.js';

import {
  registerSchema,
  loginSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post(
  '/register',
  validate(registerSchema, 'body'),
  authController.register
);

router.post(
  '/login',
  validate(loginSchema, 'body'),
  authController.login
);
router.post(
  '/refresh-token',
  validate(refreshTokenSchema, 'body'),
  authController.refreshToken
);

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema, 'body'),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema, 'body'),
  authController.resetPassword
);

router.post(
  '/change-password',
  validate(changePasswordSchema, 'body'),
  authController.changePassword
);
export default router;