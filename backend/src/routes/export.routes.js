import { Router } from 'express';

import exportController from '../controllers/export.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import requireActiveSubscription from '../middlewares/subscription.middleware.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard Excel Export
|--------------------------------------------------------------------------
*/

router.get(
  '/dashboard',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_EXPORT'),
  exportController.exportDashboardExcel
);

/*
|--------------------------------------------------------------------------
| Workers PDF Export
|--------------------------------------------------------------------------
*/

router.get(
  '/workers',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_EXPORT'),
  exportController.exportWorkersPdf
);

/*
|--------------------------------------------------------------------------
| Attendance PDF Export
|--------------------------------------------------------------------------
*/

router.get(
  '/attendance',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_EXPORT'),
  exportController.exportAttendancePdf
);

/*
|--------------------------------------------------------------------------
| Payroll PDF Export
|--------------------------------------------------------------------------
*/

router.get(
  '/payroll',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_EXPORT'),
  exportController.exportPayrollPdf
);

/*
|--------------------------------------------------------------------------
| Sites PDF Export
|--------------------------------------------------------------------------
*/

router.get(
  '/sites',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_EXPORT'),
  exportController.exportSitesPdf
);

/*
|--------------------------------------------------------------------------
| Dashboard PDF Export
|--------------------------------------------------------------------------
*/

router.get(
  '/dashboard/pdf',
  authMiddleware,
  requireActiveSubscription,
  authorize('REPORT_EXPORT'),
  exportController.exportDashboardPdf
);

export default router;