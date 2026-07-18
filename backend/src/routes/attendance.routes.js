import { Router } from 'express';

import attendanceController from '../controllers/attendance.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';

import {
  createAttendanceSchema,
  updateAttendanceSchema,
  changeAttendanceStatusSchema,
  getAttendanceQuerySchema,
} from '../validators/attendance.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Attendance Summary
|--------------------------------------------------------------------------
*/

router.get(
  '/summary',
  authMiddleware,
  authorize('ATTENDANCE_READ'),
  attendanceController.getSummary
);

/*
|--------------------------------------------------------------------------
| Worker Attendance History
|--------------------------------------------------------------------------
*/

router.get(
  '/history/:workerId',
  authMiddleware,
  authorize('ATTENDANCE_READ'),
  attendanceController.getWorkerHistory
);

/*
|--------------------------------------------------------------------------
| Create Attendance
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  authMiddleware,
  authorize('ATTENDANCE_CREATE'),
  validate(createAttendanceSchema),
  attendanceController.createAttendance
);

/*
|--------------------------------------------------------------------------
| Get All Attendance
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  authorize('ATTENDANCE_READ'),
  validate(getAttendanceQuerySchema, 'query'),
  attendanceController.getAttendance
);

/*
|--------------------------------------------------------------------------
| Get Attendance By Id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  authorize('ATTENDANCE_READ'),
  attendanceController.getAttendanceById
);

/*
|--------------------------------------------------------------------------
| Update Attendance
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  authMiddleware,
  authorize('ATTENDANCE_UPDATE'),
  validate(updateAttendanceSchema),
  attendanceController.updateAttendance
);

/*
|--------------------------------------------------------------------------
| Change Attendance Status
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/status',
  authMiddleware,
  authorize('ATTENDANCE_UPDATE'),
  validate(changeAttendanceStatusSchema),
  attendanceController.changeAttendanceStatus
);

/*
|--------------------------------------------------------------------------
| Delete Attendance
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  authMiddleware,
  authorize('ATTENDANCE_DELETE'),
  attendanceController.deleteAttendance
);

export default router;