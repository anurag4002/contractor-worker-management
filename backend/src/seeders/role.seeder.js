import Role from '../models/Role.js';
import Permission from '../models/Permission.js';

import logger from '../common/logger/logger.js';

const seedRoles = async () => {
  logger.info('Seeding roles...');

  const permissions = await Permission.find({
    isDeleted: false,
    status: 'ACTIVE',
  });

  const permissionIds = permissions.map(
    (permission) => permission._id
  );

  const roleDefinitions = [
    {
      name: 'Super Admin',
      code: 'SUPER_ADMIN',
      description: 'System Super Administrator',
      permissions: permissionIds,
      isSystemRole: true,
    },

    {
      name: 'Admin',
      code: 'ADMIN',
      description: 'Application Administrator',
      permissions: permissionIds,
      isSystemRole: true,
    },

    {
      name: 'HR',
      code: 'HR',
      description: 'Human Resource',
      permissions: permissions
        .filter(
          (permission) =>
            permission.module !== 'audit-log'
        )
        .map((permission) => permission._id),
      isSystemRole: true,
    },

    {
      name: 'Supervisor',
      code: 'SUPERVISOR',
      description: 'Site Supervisor',
      permissions: permissions
        .filter((permission) =>
          [
            'worker',
            'attendance',
            'dashboard',
            'report',
          ].includes(permission.module)
        )
        .map((permission) => permission._id),
      isSystemRole: true,
    },
  ];

  for (const role of roleDefinitions) {
    await Role.findOneAndUpdate(
      {
        code: role.code,
      },
      {
        ...role,
        status: 'ACTIVE',
        isDeleted: false,
      },
      {
        upsert: true,
        returnDocument: 'after',
        setDefaultsOnInsert: true,
      }
    );
  }

  logger.info(
    `${roleDefinitions.length} roles seeded successfully.`
  );
};

export default seedRoles;
