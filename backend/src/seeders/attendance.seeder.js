import Attendance from '../models/Attendance.js';
import Worker from '../models/Worker.js';
import Site from '../models/Site.js';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';

import logger from '../common/logger/logger.js';

import { faker } from '@faker-js/faker';

const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE', 'HOLIDAY'];

const seedAttendance = async () => {
  logger.info('Seeding attendance...');

  const workers = await Worker.find({ isDeleted: false });
  const sites = await Site.find({ isDeleted: false, status: 'ACTIVE' });
  const adminUser = await User.findOne({ email: 'admin@contractor.com', isDeleted: false });
  const adminTenant = await Tenant.findOne({ owner: adminUser?._id, isDeleted: false });

  const daysToGenerate = 60;
  const endDate = new Date('2026-08-06');
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - daysToGenerate);

  const records = [];
  let skippedNoAttendance = 0;

  const workersWithAttendance = workers.filter(() => Math.random() > 0.03);
  const workersWithoutAttendance = workers.filter(
    (w) => !workersWithAttendance.includes(w),
  );

  logger.info(
    `Workers with attendance: ${workersWithAttendance.length}, without: ${workersWithoutAttendance.length}`,
  );

  for (const worker of workersWithAttendance) {
    const workerSites = worker.site
      ? [worker.site]
      : sites.length > 0
        ? [sites[Math.floor(Math.random() * sites.length)]._id]
        : [];

    const siteId =
      workerSites.length > 0
        ? workerSites[0]
        : sites.length > 0
          ? sites[Math.floor(Math.random() * sites.length)]._id
          : null;

    if (!siteId) {
      skippedNoAttendance++;
      continue;
    }

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const status = ATTENDANCE_STATUSES[Math.floor(Math.random() * ATTENDANCE_STATUSES.length)];

      const isPresent = status === 'PRESENT' || status === 'HALF_DAY';
      const checkIn = isPresent
        ? faker.date.between({
            from: new Date(`${dateStr}T06:00:00`),
            to: new Date(`${dateStr}T10:00:00`),
          })
        : null;
      const checkOut = isPresent
        ? faker.date.between({
            from: new Date(`${dateStr}T14:00:00`),
            to: new Date(`${dateStr}T18:00:00`),
          })
        : null;

      const regularHours = isPresent ? Math.floor(Math.random() * 8) + 4 : 0;
      const overtimeHours =
        status === 'PRESENT' && Math.random() > 0.7
          ? Math.floor(Math.random() * 4) + 1
          : 0;

      records.push({
        worker: worker._id,
        site: siteId,
        tenant: adminTenant?._id || worker.tenant || null,
        attendanceDate: new Date(dateStr),
        status,
        checkIn,
        checkOut,
        regularHours,
        overtimeHours,
        remarks: status === 'LEAVE' ? 'Leave approved' : '',
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  if (records.length > 0) {
    await Attendance.insertMany(records, { ordered: false });
  }

  logger.info(`Attendance records created: ${records.length}`);
  logger.info(`Workers skipped (no attendance): ${workersWithoutAttendance.length + skippedNoAttendance}`);

  return { count: records.length, skipped: workersWithoutAttendance.length + skippedNoAttendance };
};

export default seedAttendance;