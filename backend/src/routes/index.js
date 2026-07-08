import { Router } from 'express';

const router = Router();

/**
 * Health Check Route
 */
router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running successfully.',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Authentication Routes
 */
import authRoutes from './auth.routes.js';
router.use('/auth', authRoutes);

/**
 * Future Routes
 */
// router.use('/users', userRoutes);
// router.use('/workers', workerRoutes);
// router.use('/sites', siteRoutes);
// router.use('/attendance', attendanceRoutes);
// router.use('/payroll', payrollRoutes);
// router.use('/dashboard', dashboardRoutes);
// router.use('/reports', reportRoutes);

export default router;