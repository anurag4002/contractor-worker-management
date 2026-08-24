import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import Role from '../../src/models/Role.js';
import Permission from '../../src/models/Permission.js';
import User from '../../src/models/User.js';

let mongoServer;

export const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};

export const closeTestDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

export const createPermissions = async (codes) => {
  const permissions = await Permission.create(
    codes.map((code) => ({
      name: code,
      code,
      module: 'tenant',
      action: code.split('_')[1].toLowerCase(),
    }))
  );
  return permissions;
};

export const createRole = async (code, permissions = []) => {
  const role = await Role.create({
    name: code,
    code,
    permissions: permissions.map((p) => p._id || p),
  });
  return role;
};

export const createUser = async (overrides = {}) => {
  const defaults = {
    fullName: 'Test User',
    email: 'test@example.com',
    mobileNumber: '9876543210',
    password: 'hashedPassword123!',
    role: null,
    status: 'ACTIVE',
  };
  const userData = { ...defaults, ...overrides };
  const user = await User.create(userData);
  return user;
};

export const generateTestToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'test-secret-key';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const getAuthHeaders = (user) => {
  const token = generateTestToken({ userId: user._id.toString() });
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const SUPER_ADMIN_PERMISSIONS = [
  'TENANT_CREATE',
  'TENANT_READ',
  'TENANT_UPDATE',
  'TENANT_DELETE',
];
