import User from '../models/User.js';
import Role from '../models/Role.js';

import { hashPassword } from '../common/utils/password.util.js';

import logger from '../common/logger/logger.js';

const seedAdmin = async () => {
  logger.info('Seeding Super Admin...');

  const superAdminRole = await Role.findOne({
    code: 'SUPER_ADMIN',
    isDeleted: false,
    status: 'ACTIVE',
  });

  if (!superAdminRole) {
    throw new Error(
      'SUPER_ADMIN role not found. Please seed roles first.'
    );
  }

  const existingAdmin = await User.findOne({
    email: 'admin@contractor.com',
    isDeleted: false,
  });

  if (existingAdmin) {
    logger.info('Super Admin already exists.');

    return;
  }

  const hashedPassword = await hashPassword(
    'Admin@123'
  );

  await User.create({
    fullName: 'Super Admin',

    email: 'admin@contractor.com',

    mobileNumber: '9999999999',

    username: 'superadmin',

    password: hashedPassword,

    role: superAdminRole._id,

    status: 'ACTIVE',

    isEmailVerified: true,

    isMobileVerified: true,
  });

  logger.info(
    'Super Admin created successfully.'
  );
};

export default seedAdmin;