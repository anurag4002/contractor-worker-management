import Payroll from '../models/Payroll.js';
import Worker from '../models/Worker.js';
import Site from '../models/Site.js';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';

import logger from '../common/logger/logger.js';

import { faker } from '@faker-js/faker';

const PAYROLL_STATUSES = ['PAID', 'PAID', 'PAID', 'PENDING', 'PENDING', 'GENERATED', 'CANCELLED'];

const seedPayroll = async () => {
  logger.info('Seeding payroll...');

  const workers = await Worker.find({ isDeleted: false });
  const sites = await Site.find({ isDeleted: false });
  const adminUser = await User.findOne({ email: 'admin@contractor.com', isDeleted: false });
  const adminTenant = await Tenant.findOne({ owner: adminUser?._id, isDeleted: false });

  const monthsToGenerate = 6;
  const endMonth = 8;
  const endYear = 2026;

  const records = [];

  for (const worker of workers) {
    const workerSite = worker.site
      ? worker.site
      : sites.length > 0
        ? sites[Math.floor(Math.random() * sites.length)]._id
        : null;

    if (!workerSite) {
      continue;
    }

    for (let m = 0; m < monthsToGenerate; m++) {
      const month = ((endMonth - m - 1) % 12) + 1;
      const year = month > endMonth ? endYear - 1 : endYear;

      const workingDays = Math.floor(Math.random() * 10) + 20;
      const presentDays = Math.floor(Math.random() * (workingDays + 1));
      const absentDays = Math.floor(Math.random() * (workingDays - presentDays + 1));
      const halfDays = Math.floor(Math.random() * 3);
      const leaveDays = Math.max(0, workingDays - presentDays - absentDays - halfDays);

      const dailyWage = worker.dailyWage || 800;
      const overtimeHours = Math.floor(Math.random() * 20);
      const overtimeRate = dailyWage / 8;
      const overtimeAmount = overtimeHours * overtimeRate;
      const bonus = Math.random() > 0.6 ? Math.floor(Math.random() * 5000) + 500 : 0;
      const deduction = Math.random() > 0.7 ? Math.floor(Math.random() * 2000) + 500 : 0;
      const advanceDeduction = Math.random() > 0.8 ? Math.floor(Math.random() * 3000) + 1000 : 0;

      let basicSalary = 0;
      if (worker.salaryType === 'MONTHLY') {
        basicSalary = worker.monthlySalary || 30000;
      } else {
        basicSalary = dailyWage * workingDays;
      }

      const grossSalary = basicSalary + overtimeAmount + bonus;
      const netSalary = grossSalary - deduction - advanceDeduction;

      const status = PAYROLL_STATUSES[Math.floor(Math.random() * PAYROLL_STATUSES.length)];

      records.push({
        worker: worker._id,
        site: workerSite,
        tenant: adminTenant?._id || worker.tenant || null,
        attendanceMonth: month,
        attendanceYear: year,
        workingDays,
        presentDays,
        absentDays,
        halfDays,
        leaveDays,
        regularHours: presentDays * 8,
        overtimeHours,
        dailyWage,
        overtimeRate,
        basicSalary,
        overtimeAmount,
        bonus,
        deduction,
        advanceDeduction,
        grossSalary,
        netSalary: Math.max(0, netSalary),
        status,
        remarks: status === 'PENDING' ? 'Awaiting payment approval' : '',
        createdBy: worker.createdBy,
        updatedBy: worker.createdBy,
      });
    }
  }

  if (records.length > 0) {
    await Payroll.insertMany(records, { ordered: false });
  }

  logger.info(`Payroll records created: ${records.length}`);
  return { count: records.length };
};

export default seedPayroll;