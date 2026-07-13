import { Router } from 'express';

import userController from '../controllers/user.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';

import authorize from '../middlewares/authorize.middleware.js';

import validate from '../middlewares/validate.middleware.js';

import {
  createUserSchema,
  updateUserSchema,
  changeUserStatusSchema,
  getUsersQuerySchema,
} from '../validators/user.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  authMiddleware,
  authorize('USER_CREATE'),
  validate(createUserSchema),
  userController.createUser
);

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  authorize('USER_READ'),
  validate(getUsersQuerySchema, 'query'),
  userController.getUsers
);

/*
|--------------------------------------------------------------------------
| Get User By Id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  authorize('USER_READ'),
  userController.getUserById
);

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  authMiddleware,
  authorize('USER_UPDATE'),
  validate(updateUserSchema),
  userController.updateUser
);

/*
|--------------------------------------------------------------------------
| Change User Status
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/status',
  authMiddleware,
  authorize('USER_UPDATE'),
  validate(changeUserStatusSchema),
  userController.changeUserStatus
);

/*
|--------------------------------------------------------------------------
| Soft Delete User
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  authMiddleware,
  authorize('USER_DELETE'),
  userController.deleteUser
);

export default router;