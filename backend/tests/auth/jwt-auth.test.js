import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');

  const mockUserId = '507f1f77bcf86cd799439001';
  const mockSuperAdminUser = {
    _id: mockUserId,
    email: 'superadmin@test.com',
    role: {
      _id: 'role-1',
      code: 'SUPER_ADMIN',
      permissions: [
        { code: 'TENANT_CREATE' },
        { code: 'TENANT_READ' },
        { code: 'TENANT_UPDATE' },
        { code: 'TENANT_DELETE' },
      ],
      status: 'ACTIVE',
    },
    status: 'ACTIVE',
    tenant: null,
  };

  const makeMockQuery = (resolvedUser) => ({
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(resolvedUser),
    lean: jest.fn().mockReturnThis(),
    then: jest.fn((resolve) => Promise.resolve(resolvedUser).then(resolve)),
  });

  const UserModel = {
    create: jest.fn().mockImplementation((docs) => Promise.resolve(docs)),
    findOne: jest.fn().mockImplementation((query) => {
      const user = Object.values(mockSuperAdminUser).length ? mockSuperAdminUser : null;
      return makeMockQuery(user);
    }),
    findById: jest.fn().mockImplementation((id) => {
      const user = id === mockUserId ? mockSuperAdminUser : null;
      return makeMockQuery(user);
    }),
    find: jest.fn().mockReturnValue(makeMockQuery([])),
    countDocuments: jest.fn().mockResolvedValue(0),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockSuperAdminUser),
    findOneAndUpdate: jest.fn().mockResolvedValue(mockSuperAdminUser),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
  };

  const TenantModel = {
    create: jest.fn().mockImplementation((docs) => Promise.resolve(docs)),
    findOne: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockReturnValue(makeMockQuery([])),
    countDocuments: jest.fn().mockResolvedValue(0),
    findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    findOneAndUpdate: jest.fn().mockResolvedValue(null),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
  };

  return {
    ...actual,
    connect: jest.fn().mockResolvedValue({ connection: { host: 'test-mongodb', readyState: 1 } }),
    connection: {
      ...actual.connection,
      readyState: 1,
      on: jest.fn(),
      once: jest.fn(),
      emit: jest.fn(),
    },
    model: jest.fn((name) => {
      if (name === 'User') return UserModel;
      if (name === 'Tenant') return TenantModel;
      return UserModel;
    }),
    Schema: actual.Schema,
    Types: actual.Types,
  };
});

let app;

beforeAll(async () => {
  app = (await import('../../src/app.js')).default;
});

const signToken = (payload, options = { expiresIn: '1h' }) =>
  jwt.sign(payload, process.env.JWT_SECRET || 'test-secret-key', options);

describe('JWT authentication (real auth middleware + real signature verification)', () => {
  it('returns 401 when token is missing', async () => {
    const res = await request(app).get('/api/v1/tenants');
    expect(res.status).toBe(401);
  });

  it('returns 401 when token is malformed', async () => {
    const res = await request(app)
      .get('/api/v1/tenants')
      .set('Authorization', 'Bearer not-a-valid-jwt');
    expect(res.status).toBe(401);
  });

  it('returns 401 when token signature is invalid', async () => {
    const token = jwt.sign(
      { userId: '507f1f77bcf86cd799439001', email: 'superadmin@test.com', role: 'SUPER_ADMIN', permissions: ['TENANT_READ'] },
      'definitely-wrong-secret',
      { expiresIn: '1h' }
    );
    const res = await request(app)
      .get('/api/v1/tenants')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it('returns 401 when token is expired', async () => {
    const token = jwt.sign(
      {
        userId: '507f1f77bcf86cd799439001',
        email: 'superadmin@test.com',
        role: 'SUPER_ADMIN',
        permissions: ['TENANT_READ'],
        exp: Math.floor(Date.now() / 1000) - 10,
      },
      process.env.JWT_SECRET || 'test-secret-key'
    );
    const res = await request(app)
      .get('/api/v1/tenants')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it('accepts a validly signed token and proceeds past authentication', async () => {
    const token = signToken({
      userId: '507f1f77bcf86cd799439001',
      email: 'superadmin@test.com',
      role: 'SUPER_ADMIN',
      permissions: ['TENANT_CREATE', 'TENANT_READ', 'TENANT_UPDATE', 'TENANT_DELETE'],
    });
    const res = await request(app)
      .get('/api/v1/tenants')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).not.toBe(401);
  });
});
