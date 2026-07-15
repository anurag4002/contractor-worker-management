import { Router } from 'express';

import payrollController from '../controllers/payroll.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';

import {
  createPayrollSchema,
  updatePayrollSchema,
  changePayrollStatusSchema,
  getPayrollQuerySchema,
} from '../validators/payroll.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Payroll Summary
|--------------------------------------------------------------------------
*/

router.get(
  '/summary',
  authMiddleware,
  authorize('PAYROLL_READ'),
  payrollController.getSummary
);

/*
|--------------------------------------------------------------------------
| Worker Payroll History
|--------------------------------------------------------------------------
*/

router.get(
  '/worker/:workerId',
  authMiddleware,
  authorize('PAYROLL_READ'),
  payrollController.getWorkerPayrollHistory
);

/*
|--------------------------------------------------------------------------
| Create Payroll
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  authMiddleware,
  authorize('PAYROLL_CREATE'),
  validate(createPayrollSchema),
  payrollController.createPayroll
);

/*
|--------------------------------------------------------------------------
| Get All Payrolls
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  authorize('PAYROLL_READ'),
  validate(getPayrollQuerySchema, 'query'),
  payrollController.getPayrolls
);

/*
|--------------------------------------------------------------------------
| Get Payroll By Id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  authorize('PAYROLL_READ'),
  payrollController.getPayrollById
);

/*
|--------------------------------------------------------------------------
| Update Payroll
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  authMiddleware,
  authorize('PAYROLL_UPDATE'),
  validate(updatePayrollSchema),
  payrollController.updatePayroll
);

/*
|--------------------------------------------------------------------------
| Change Payroll Status
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/status',
  authMiddleware,
  authorize('PAYROLL_UPDATE'),
  validate(changePayrollStatusSchema),
  payrollController.changePayrollStatus
);

/*
|--------------------------------------------------------------------------
| Delete Payroll
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  authMiddleware,
  authorize('PAYROLL_DELETE'),
  payrollController.deletePayroll
);

export default router;