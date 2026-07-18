import { Router } from 'express';

import authRoutes from './auth.routes.js';

import userRoutes from './user.routes.js';

import roleRoutes from './role.routes.js';

import workerRoutes from './worker.routes.js';

import siteRoutes from './site.routes.js';

import attendanceRoutes from './attendance.routes.js';

import payrollRoutes from './payroll.routes.js';

import dashboardRoutes from './dashboard.routes.js';

import reportRoutes from './report.routes.js';

import exportRoutes from './export.routes.js';

import notificationRoutes from './notification.routes.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| API Health Check
|--------------------------------------------------------------------------
*/

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Contractor Worker Management API is running.',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);

router.use('/users', userRoutes);

router.use('/roles', roleRoutes);

router.use('/workers', workerRoutes);

router.use('/sites', siteRoutes);

router.use('/attendance', attendanceRoutes);

router.use('/payroll', payrollRoutes);

router.use('/dashboard', dashboardRoutes);

router.use('/reports', reportRoutes);

router.use('/export', exportRoutes);

router.use('/notifications',notificationRoutes);

/*
|--------------------------------------------------------------------------
| Future Modules
|--------------------------------------------------------------------------
*/

// router.use('/workers', workerRoutes);

// router.use('/sites', siteRoutes);

// router.use('/attendance', attendanceRoutes);

// router.use('/payroll', payrollRoutes);

// router.use('/dashboard', dashboardRoutes);

// router.use('/reports', reportRoutes);

export default router;