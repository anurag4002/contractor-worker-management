import { Router } from 'express';

import authController from '../controllers/auth.controller.js';

import validate from '../middlewares/validate.middleware.js';

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../validators/auth.validator.js';

import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.post(
  '/logout',
  authMiddleware,
  authController.logout
);

router.post(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  authController.changePassword
);

router.get(
  '/profile',
  authMiddleware,
  authController.getProfile
);

router.put(
  '/profile',
  authMiddleware,
  validate(updateProfileSchema),
  authController.updateProfile
);

export default router;