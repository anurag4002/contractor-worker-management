import { Router } from 'express';

import roleController from '../controllers/role.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';

import {
  createRoleSchema,
  updateRoleSchema,
  changeRoleStatusSchema,
  getRolesQuerySchema,
} from '../validators/role.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  authMiddleware,
  authorize('ROLE_CREATE'),
  validate(createRoleSchema),
  roleController.createRole
);

/*
|--------------------------------------------------------------------------
| Get All Roles
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  authorize('ROLE_READ'),
  validate(getRolesQuerySchema, 'query'),
  roleController.getRoles
);

/*
|--------------------------------------------------------------------------
| Get Role By Id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  authorize('ROLE_READ'),
  roleController.getRoleById
);

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  authMiddleware,
  authorize('ROLE_UPDATE'),
  validate(updateRoleSchema),
  roleController.updateRole
);

/*
|--------------------------------------------------------------------------
| Change Role Status
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/status',
  authMiddleware,
  authorize('ROLE_UPDATE'),
  validate(changeRoleStatusSchema),
  roleController.changeRoleStatus
);

/*
|--------------------------------------------------------------------------
| Delete Role (Soft Delete)
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  authMiddleware,
  authorize('ROLE_DELETE'),
  roleController.deleteRole
);

export default router;