import { Router } from 'express';

import payrollController from '../controllers/payroll.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import requireActiveSubscription from '../middlewares/subscription.middleware.js';

import {
  createPayrollSchema,
  updatePayrollSchema,
  changePayrollStatusSchema,
  getPayrollQuerySchema,
  advancePaymentSchema,
  salaryPaymentSchema,
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
  requireActiveSubscription,
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
  requireActiveSubscription,
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
  requireActiveSubscription,
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
   requireActiveSubscription,
   authorize('PAYROLL_READ'),
   validate(getPayrollQuerySchema, 'query'),
   payrollController.getPayrolls
 );

 /*
 |--------------------------------------------------------------------------
 | Generate Salary from Attendance
 |--------------------------------------------------------------------------
 */

 router.post(
   '/generate-salary',
   authMiddleware,
   requireActiveSubscription,
   authorize('PAYROLL_CREATE'),
   payrollController.generateSalaryFromAttendance
 );

 /*
 |--------------------------------------------------------------------------
 | Process Advance Payment
 |--------------------------------------------------------------------------
 */

  router.patch(
    '/:payrollId/advance',
    authMiddleware,
    requireActiveSubscription,
    authorize('PAYROLL_UPDATE'),
    validate(advancePaymentSchema),
    payrollController.processAdvancePayment
  );

  /*
  |--------------------------------------------------------------------------
  | Process Salary Payment (Full / Partial)
  |--------------------------------------------------------------------------
  */

  router.patch(
    '/:payrollId/payment',
    authMiddleware,
    requireActiveSubscription,
    authorize('PAYROLL_UPDATE'),
    validate(salaryPaymentSchema),
    payrollController.processSalaryPayment
  );

/*
|--------------------------------------------------------------------------
| Get Payroll By Id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
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
  requireActiveSubscription,
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
  requireActiveSubscription,
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
  requireActiveSubscription,
  authorize('PAYROLL_DELETE'),
  payrollController.deletePayroll
);

export default router;