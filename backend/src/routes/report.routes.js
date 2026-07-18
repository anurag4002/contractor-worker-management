import { Router } from 'express';

import reportController from '../controllers/report.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Worker Report
|--------------------------------------------------------------------------
*/

router.get(
  '/workers',
  authMiddleware,
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
  authorize('REPORT_READ'),
  reportController.getDashboardReport
);

export default router;