import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';

import logger from '../common/logger/logger.js';

import { faker } from '@faker-js/faker';

const NOTIFICATION_TITLES = [
  'Worker Added', 'Salary Generated', 'Site Created', 'Attendance Marked',
  'Payroll Processed', 'Worker Updated', 'Worker Deleted', 'Site Updated',
  'Site Completed', 'Payment Released', 'Advance Approved', 'Leave Approved',
  'Overtime Approved', 'Contractor Assigned', 'Worker Assigned to Site',
  'Worker Removed from Site', 'Salary Pending', 'Payroll Cancelled',
  'New User Registered', 'Role Updated', 'Permission Changed',
  'Report Generated', 'Export Completed', 'Backup Created',
  'System Alert', 'Database Optimized', 'Cache Cleared', 'Server Restarted',
  'Worker Onboarded', 'Worker Terminated', 'Worker Transferred',
  'Site Inspection Done', 'Safety Audit Completed', 'Material Ordered',
  'Invoice Generated', 'Payment Received', 'Deduction Applied',
  'Bonus Credited', 'OT Approved', 'Shift Changed', 'Worker Promoted',
  'Contractor Changed', 'Document Verified', 'Aadhaar Verified',
  'PAN Verified', 'Bank Details Updated', 'Emergency Contact Updated',
  'Skill Assessment Done', 'Training Completed', 'Certificate Issued',
];

const NOTIFICATION_MESSAGES = [
  'A new worker has been added to the system.',
  'Salary has been generated for the current month.',
  'A new site has been created and is now active.',
  'Attendance has been marked for all workers.',
  'Payroll processing has been completed successfully.',
  'Worker details have been updated in the system.',
  'A worker has been marked as inactive.',
  'Site details have been updated.',
  'A site project has been completed successfully.',
  'Payment has been released for the payroll cycle.',
  'An advance payment has been approved.',
  'Leave request has been approved.',
  'Overtime hours have been approved.',
  'A contractor has been assigned to the project.',
  'A worker has been assigned to a site.',
  'A worker has been removed from the site.',
  'Salary payment is pending for the current month.',
  'Payroll has been cancelled and needs reprocessing.',
  'A new user has registered on the platform.',
  'A role has been updated with new permissions.',
  'Permissions have been changed for the role.',
  'A new report has been generated.',
  'Data export has been completed successfully.',
  'Database backup has been created.',
  'System alert: Please review pending items.',
  'Database optimization has been completed.',
  'Cache has been cleared successfully.',
  'Server has been restarted.',
  'A worker has been onboarded successfully.',
  'A worker has been terminated from the project.',
  'A worker has been transferred to another site.',
  'Site inspection has been completed.',
  'Safety audit has been completed successfully.',
  'Materials have been ordered for the project.',
  'An invoice has been generated.',
  'Payment has been received from the client.',
  'Deduction has been applied to the payroll.',
  'Bonus has been credited to the worker.',
  'Overtime has been approved for the worker.',
  'Shift has been changed for the worker.',
  'A worker has been promoted.',
  'Contractor has been changed for the worker.',
  'Documents have been verified.',
  'Aadhaar number has been verified.',
  'PAN number has been verified.',
  'Bank details have been updated.',
  'Emergency contact has been updated.',
  'Skill assessment has been completed.',
  'Training has been completed successfully.',
  'Certificate has been issued to the worker.',
];

const NOTIFICATION_TYPES = ['INFO', 'SUCCESS', 'WARNING', 'ERROR'];

const seedNotifications = async () => {
  logger.info('Seeding notifications...');

  const users = await User.find({ isDeleted: false });
  const adminUser = users.find((u) => u.email === 'admin@contractor.com');
  const adminTenant = await Tenant.findOne({ owner: adminUser?._id, isDeleted: false });
  const recipientPool = users.length > 0 ? users : [adminUser];

  const totalNotifications = 120;
  const records = [];

  for (let i = 0; i < totalNotifications; i++) {
    const title = NOTIFICATION_TITLES[i % NOTIFICATION_TITLES.length];
    const message = NOTIFICATION_MESSAGES[i % NOTIFICATION_MESSAGES.length];
    const type = NOTIFICATION_TYPES[Math.floor(Math.random() * NOTIFICATION_TYPES.length)];
    const recipient = recipientPool[Math.floor(Math.random() * recipientPool.length)];

    records.push({
      title,
      message,
      type,
      tenant: adminTenant?._id || null,
      recipient: recipient._id,
      isRead: Math.random() > 0.5,
      status: 'ACTIVE',
      createdBy: adminUser ? adminUser._id : null,
    });
  }

  if (records.length > 0) {
    await Notification.insertMany(records, { ordered: false });
  }

  logger.info(`Notifications created: ${records.length}`);
  return { count: records.length };
};

export default seedNotifications;