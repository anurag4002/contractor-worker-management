import { faker } from '@faker-js/faker';

import User from '../models/User.js';
import Role from '../models/Role.js';

import { hashPassword } from '../common/utils/password.util.js';

import logger from '../common/logger/logger.js';

import Tenant from '../models/Tenant.js';

const ROLE_CONFIGS = [
  {
    name: 'Administrator',
    code: 'ADMIN',
    description: 'Application Administrator',
    count: 2,
  },
  {
    name: 'Manager',
    code: 'MANAGER',
    description: 'Project Manager',
    count: 2,
  },
  {
    name: 'Supervisor',
    code: 'SUPERVISOR',
    description: 'Site Supervisor',
    count: 2,
  },
  {
    name: 'HR',
    code: 'HR',
    description: 'Human Resource',
    count: 2,
  },
  {
    name: 'Accountant',
    code: 'ACCOUNTANT',
    description: 'Accountant',
    count: 2,
  },
];

const INDIAN_FIRST_NAMES = [
  'Amit', 'Rahul', 'Priya', 'Sunita', 'Rajesh', 'Meena', 'Suresh', 'Kavita',
  'Anil', 'Rekha', 'Vikram', 'Deepa', 'Manoj', 'Lakshmi', 'Arun', 'Shalini',
  'Sandeep', 'Pooja', 'Ravi', 'Anita', 'Kumar', 'Neha', 'Ajay', 'Meera',
  'Sanjay', 'Roshni', 'Mukesh', 'Divya', 'Nikhil', 'Shruti', 'Rohit', 'Pooja',
  'Akshay', 'Tanvi', 'Varun', 'Kriti', 'Saurabh', 'Pari', 'Abhishek', 'Shreya',
  'Naveen', 'Archana', 'Pradeep', 'Kavya', 'Rakesh', 'Swati', 'Harish', 'Geeta',
  'Srinivas', 'Lata', 'Gopal', 'Usha', 'Mahesh', 'Rani', 'Karthik', 'Amrita',
  'Vijay', 'Shweta', 'Manoj', 'Pooja', 'Ravi', 'Sita', 'Ganesh', 'Lakshmi',
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Jain', 'Reddy', 'Nair',
  'Das', 'Mukherjee', 'Iyer', 'Menon', 'Nair', 'Pillai', 'Nair', 'Shah',
  'Patel', 'Sharma', 'Singh', 'Yadav', 'Kumar', 'Verma', 'Das', 'Gupta',
  'Jain', 'Shah', 'Mehta', 'Bhatia', 'Chandra', 'Rao', 'Nair', 'Menon',
  'Iyer', 'Pillai', 'Reddy', 'Patel', 'Sharma', 'Singh', 'Kumar', 'Gupta',
];

const generateIndianName = () => {
  const first = INDIAN_FIRST_NAMES[Math.floor(Math.random() * INDIAN_FIRST_NAMES.length)];
  const last = INDIAN_LAST_NAMES[Math.floor(Math.random() * INDIAN_LAST_NAMES.length)];
  return `${first} ${last}`;
};

const generateUniqueMobile = async () => {
  let mobile;
  const used = await User.distinct('mobileNumber', { isDeleted: false });
  do {
    mobile = `9${String(Math.floor(Math.random() * 900000000) + 100000000)}`;
  } while (used.includes(mobile));
  return mobile;
};

const generateUniqueEmail = async () => {
  let email;
  const used = await User.distinct('email', { isDeleted: false });
  do {
    const username = faker.internet.username().replace(/[^a-zA-Z0-9]/g, '');
    const domain = faker.internet.domainName();
    email = `${username}@${domain}`.toLowerCase();
  } while (used.includes(email));
  return email;
};

const generateUniqueUsername = async () => {
  let username;
  const used = await User.distinct('username', { isDeleted: false });
  do {
    username = faker.internet.username().replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  } while (used.includes(username));
  return username;
};

const seedUsers = async () => {
  logger.info('Seeding users...');

  let createdCount = 0;
  const createdUsers = [];

  const superAdmin = await User.findOne({ email: 'admin@contractor.com', isDeleted: false });
  const adminTenant = await Tenant.findOne({ owner: superAdmin?._id, isDeleted: false });

  for (const config of ROLE_CONFIGS) {
    let role = await Role.findOne({ code: config.code, isDeleted: false, status: 'ACTIVE' });

    if (!role) {
      role = await Role.create({
        name: config.name,
        code: config.code,
        description: config.description,
        isSystemRole: true,
        status: 'ACTIVE',
        isDeleted: false,
      });
      logger.info(`Created missing role: ${config.code}`);
    }

    for (let i = 0; i < config.count; i++) {
      const fullName = generateIndianName();
      const hashedPassword = await hashPassword('Password@123');
      const mobileNumber = await generateUniqueMobile();
      const email = await generateUniqueEmail();
      const username = await generateUniqueUsername();

      const user = await User.create({
        fullName,
        email,
        mobileNumber,
        username,
        password: hashedPassword,
        role: role._id,
        tenant: adminTenant?._id || null,
        status: 'ACTIVE',
        isEmailVerified: true,
        isMobileVerified: true,
        createdBy: superAdmin ? superAdmin._id : null,
      });

      createdUsers.push(user);
      createdCount++;
    }
  }

  logger.info(`Users created: ${createdCount}`);
  return { count: createdCount, users: createdUsers };
};

export default seedUsers;