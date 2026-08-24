import { Router } from 'express';

import dashboardController from '../controllers/dashboard.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import requireActiveSubscription from '../middlewares/subscription.middleware.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('DASHBOARD_READ'),
  dashboardController.getDashboard
);

/*
|--------------------------------------------------------------------------
| Recent Workers
|--------------------------------------------------------------------------
*/

router.get(
  '/recent-workers',
  authMiddleware,
  requireActiveSubscription,
  authorize('DASHBOARD_READ'),
  dashboardController.getRecentWorkers
);

/*
|--------------------------------------------------------------------------
| Recent Attendance
|--------------------------------------------------------------------------
*/

router.get(
  '/recent-attendance',
  authMiddleware,
  requireActiveSubscription,
  authorize('DASHBOARD_READ'),
  dashboardController.getRecentAttendance
);

/*
|--------------------------------------------------------------------------
| Recent Payroll
|--------------------------------------------------------------------------
*/

router.get(
  '/recent-payroll',
  authMiddleware,
  requireActiveSubscription,
  authorize('DASHBOARD_READ'),
  dashboardController.getRecentPayroll
);

/*
|--------------------------------------------------------------------------
| Dashboard Charts
|--------------------------------------------------------------------------
*/

router.get(
  '/charts',
  authMiddleware,
  requireActiveSubscription,
  authorize('DASHBOARD_READ'),
  dashboardController.getCharts
);

export default router;