import Permission from '../models/Permission.js';

import logger from '../common/logger/logger.js';

const permissionModules = [
  'auth',
  'user',
  'role',
  'worker',
  'site',
  'attendance',
  'payroll',
  'advance-payment',
  'dashboard',
  'report',
  'notification',
  'audit-log',
];

const permissionActions = [
  'create',
  'read',
  'update',
  'delete',
  'approve',
  'reject',
  'export',
  'import',
  'assign',
  'manage',
];

const formatLabel = (value) =>
  value
    .split('-')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');

const permissions = permissionModules.flatMap((module) =>
  permissionActions.map((action) => ({
    name: `${formatLabel(module)} ${formatLabel(action)}`,
    code: `${module}_${action}`
      .replaceAll('-', '_')
      .toUpperCase(),
    module,
    action,
    description: `Can ${action} ${module.replaceAll('-', ' ')}`,
    isSystemPermission: true,
    status: 'ACTIVE',
    isDeleted: false,
  }))
);

const seedPermissions = async () => {
  logger.info('Seeding permissions...');

  for (const permission of permissions) {
    await Permission.findOneAndUpdate(
      { code: permission.code },
      permission,
      {
        upsert: true,
        returnDocument: 'after',
      }
    );
  }

  logger.info(
    `${permissions.length} permissions seeded successfully.`
  );
};

export default seedPermissions;
