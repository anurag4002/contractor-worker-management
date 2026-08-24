import { Router } from 'express';

import siteController from '../controllers/site.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import requireActiveSubscription from '../middlewares/subscription.middleware.js';

import {
  createSiteSchema,
  updateSiteSchema,
  changeSiteStatusSchema,
  assignWorkersSchema,
  getSitesQuerySchema,
} from '../validators/site.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Site
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('SITE_CREATE'),
  validate(createSiteSchema),
  siteController.createSite
);

/*
|--------------------------------------------------------------------------
| Get All Sites
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('SITE_READ'),
  validate(getSitesQuerySchema, 'query'),
  siteController.getSites
);

/*
|--------------------------------------------------------------------------
| Get Site By Id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('SITE_READ'),
  siteController.getSiteById
);

/*
|--------------------------------------------------------------------------
| Update Site
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('SITE_UPDATE'),
  validate(updateSiteSchema),
  siteController.updateSite
);

/*
|--------------------------------------------------------------------------
| Change Site Status
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/status',
  authMiddleware,
  requireActiveSubscription,
  authorize('SITE_UPDATE'),
  validate(changeSiteStatusSchema),
  siteController.changeSiteStatus
);

/*
|--------------------------------------------------------------------------
| Delete Site
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('SITE_DELETE'),
  siteController.deleteSite
);

/*
|--------------------------------------------------------------------------
| Assign Workers to Site
|--------------------------------------------------------------------------
*/

router.post(
  '/:id/assign-workers',
  authMiddleware,
  requireActiveSubscription,
  authorize('SITE_UPDATE'),
  validate(assignWorkersSchema),
  siteController.assignWorkers
);

export default router;