import { Router } from 'express';

import exportController from '../controllers/export.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard Excel Export
|--------------------------------------------------------------------------
*/

router.get(
  '/dashboard',
  authMiddleware,
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
  authorize('REPORT_EXPORT'),
  exportController.exportDashboardPdf
);

export default router;