import connectDatabase, {
  disconnectDatabase,
} from '../src/database/mongodb.js';

import logger from '../src/common/logger/logger.js';

import mongoose from 'mongoose';

import seedPermissions from '../src/seeders/permission.seeder.js';
import seedRoles from '../src/seeders/role.seeder.js';
import seedAdmin from '../src/seeders/admin.seeder.js';
import seedUsers from '../src/seeders/user.seeder.js';
import seedSites from '../src/seeders/site.seeder.js';
import seedWorkers from '../src/seeders/worker.seeder.js';
import seedAttendance from '../src/seeders/attendance.seeder.js';
import seedPayroll from '../src/seeders/payroll.seeder.js';
import seedNotifications from '../src/seeders/notification.seeder.js';
import seedSubscriptionPlans from '../src/seeders/subscriptionPlan.seeder.js';

const clearDemoData = async () => {
  logger.info('Clearing existing demo data...');

  const collections = [
    'notifications',
    'payrolls',
    'attendances',
    'workers',
    'sites',
  ];

  for (const col of collections) {
    await mongoose.connection.db.collection(col).deleteMany({});
    logger.info(`Cleared collection: ${col}`);
  }

  const User = mongoose.model('User');
  const systemEmails = ['admin@contractor.com'];
  await User.deleteMany({
    isDeleted: false,
    email: { $nin: systemEmails },
  });
  logger.info('Cleared non-system users');

  logger.info('Demo data cleared successfully.');
};

const runSeeder = async () => {
  let totalUsers = 0;
  let totalWorkers = 0;
  let totalSites = 0;
  let totalAttendance = 0;
  let totalPayroll = 0;
  let totalNotifications = 0;

  try {
    logger.info('====================================');
    logger.info('Starting Database Seeder...');
    logger.info('====================================');

    await connectDatabase();

    await clearDemoData();

    await seedPermissions();

    await seedRoles();

    await seedAdmin();

    const userResult = await seedUsers();
    totalUsers = userResult.count;

    const siteResult = await seedSites();
    totalSites = siteResult.count;

    const workerResult = await seedWorkers();
    totalWorkers = workerResult.count;

    const attendanceResult = await seedAttendance();
    totalAttendance = attendanceResult.count;

    const payrollResult = await seedPayroll();
    totalPayroll = payrollResult.count;

    const notificationResult = await seedNotifications();
    totalNotifications = notificationResult.count;

    await seedSubscriptionPlans();

    logger.info('====================================');
    logger.info('Seeding Summary Report');
    logger.info('====================================');
    logger.info(`Users Created: ${totalUsers}`);
    logger.info(`Sites Created: ${totalSites}`);
    logger.info(`Workers Created: ${totalWorkers}`);
    logger.info(`Attendance Records: ${totalAttendance}`);
    logger.info(`Payroll Records: ${totalPayroll}`);
    logger.info(`Notifications Created: ${totalNotifications}`);
    logger.info('====================================');
    logger.info('Database Seeding Completed Successfully');
    logger.info('====================================');

    await disconnectDatabase();

    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    logger.error(error.stack);

    await disconnectDatabase();

    process.exit(1);
  }
};

runSeeder();