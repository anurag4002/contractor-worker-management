import { Router } from 'express';

import workerController from '../controllers/worker.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import requireActiveSubscription from '../middlewares/subscription.middleware.js';

import {
  createWorkerSchema,
  updateWorkerSchema,
  changeWorkerStatusSchema,
  getWorkersQuerySchema,
} from '../validators/worker.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Worker
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('WORKER_CREATE'),
  validate(createWorkerSchema),
  workerController.createWorker
);

/*
|--------------------------------------------------------------------------
| Get All Workers
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('WORKER_READ'),
  validate(getWorkersQuerySchema, 'query'),
  workerController.getWorkers
);

/*
|--------------------------------------------------------------------------
| Get Worker By Id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('WORKER_READ'),
  workerController.getWorkerById
);

/*
|--------------------------------------------------------------------------
| Update Worker
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('WORKER_UPDATE'),
  validate(updateWorkerSchema),
  workerController.updateWorker
);

/*
|--------------------------------------------------------------------------
| Change Worker Status
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/status',
  authMiddleware,
  requireActiveSubscription,
  authorize('WORKER_UPDATE'),
  validate(changeWorkerStatusSchema),
  workerController.changeWorkerStatus
);

/*
|--------------------------------------------------------------------------
| Delete Worker
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('WORKER_DELETE'),
  workerController.deleteWorker
);

export default router;