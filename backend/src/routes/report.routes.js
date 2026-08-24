import { Router } from 'express';

import reportController from '../controllers/report.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import requireActiveSubscription from '../middlewares/subscription.middleware.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Worker Report
|--------------------------------------------------------------------------
*/

router.get(
  '/workers',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_READ'),
  reportController.getWorkerReport
);

/*
|--------------------------------------------------------------------------
| Attendance Report
|--------------------------------------------------------------------------
*/

router.get(
  '/attendance',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_READ'),
  reportController.getAttendanceReport
);

/*
|--------------------------------------------------------------------------
| Payroll Report
|--------------------------------------------------------------------------
*/

router.get(
  '/payroll',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_READ'),
  reportController.getPayrollReport
);

/*
|--------------------------------------------------------------------------
| Site Report
|--------------------------------------------------------------------------
*/

router.get(
  '/sites',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_READ'),
  reportController.getSiteReport
);

/*
|--------------------------------------------------------------------------
| Dashboard Report
|--------------------------------------------------------------------------
*/

router.get(
  '/dashboard',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_READ'),
  reportController.getDashboardReport
);

export default router;