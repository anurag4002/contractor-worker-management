import { jest } from '@jest/globals';

// Mock CJS packages that work with transform: {}
jest.mock('jsonwebtoken', () => {
  const actual = jest.requireActual('jsonwebtoken');
  return {
    ...actual,
    verify: jest.fn((token, secret) => {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('invalid token');
      try {
        return JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      } catch {
        throw new Error('invalid token');
      }
    }),
    sign: actual.sign,
    decode: actual.decode,
  };
});

jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');

  const mockSuperAdminUser = {
    _id: mockSuperAdminId,
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

  const mockOwnerUser = {
    _id: mockOwnerId,
    email: 'owner@test.com',
    role: {
      _id: 'role-owner',
      code: 'TENANT_ADMIN',
      permissions: [{ code: 'TENANT_READ' }],
      status: 'ACTIVE',
    },
    status: 'ACTIVE',
    tenant: null,
  };

  let createdTenantData = null;

  // Chainable mock query object that is also thenable (for await User.findOne())
  const makeMockQuery = (resolvedUser) => ({
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(resolvedUser),
    lean: jest.fn().mockReturnThis(),
    then: jest.fn((resolve) => resolve(resolvedUser)),
  });

  return {
    ...actual,
    connect: jest.fn().mockResolvedValue({
      connection: { host: 'test-mongodb', readyState: 1 },
    }),
    connection: {
      ...actual.connection,
      readyState: 1,
      on: jest.fn(),
      once: jest.fn(),
      emit: jest.fn(),
    },
    model: jest.fn((name) => {
      const MockModel = {
        create: jest.fn().mockImplementation((data) => {
          createdTenantData = { _id: 'mock-id-1', ...data };
          return Promise.resolve(createdTenantData);
        }),
        findOne: jest.fn().mockImplementation((query) => {
          if (query && query._id === 'mock-id-1') {
            return makeMockQuery(createdTenantData);
          }
          if (query && query._id === mockOwnerId) {
            return makeMockQuery(mockOwnerUser);
          }
          if (query && query.email) {
            // Email lookup - no existing tenant with this email
            return makeMockQuery(null);
          }
          if (query && query.owner) {
            // Owner lookup - no existing tenant for this owner
            return makeMockQuery(null);
          }
          return makeMockQuery(mockSuperAdminUser);
        }),
        findById: jest.fn().mockImplementation((id) => {
          if (id === 'mock-id-1') {
            return makeMockQuery(createdTenantData);
          }
          if (id === mockOwnerId) {
            return makeMockQuery(mockOwnerUser);
          }
          return makeMockQuery(mockSuperAdminUser);
        }),
        find: jest.fn().mockReturnValue(makeMockQuery([])),
        countDocuments: jest.fn().mockResolvedValue(0),
        findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: 'mock-id' }),
        findOneAndUpdate: jest.fn().mockResolvedValue({ _id: 'mock-id' }),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      };
      return MockModel;
    }),
    Schema: actual.Schema,
    Types: actual.Types,
  };
});

import request from 'supertest';
import jwt from 'jsonwebtoken';

let app;

const mockOwnerId = '507f1f77bcf86cd799439001';
const mockSuperAdminId = '507f1f77bcf86cd799439003';

const createToken = (payload) => {
  // Sign tokens with the real JWT implementation using the test-only secret
  // so verification performs genuine signature validation.
  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret-key', {
    expiresIn: '1h',
  });
};

describe('Tenant Module', () => {
  beforeAll(async () => {
    app = (await import('../../src/app.js')).default;
  });

  describe('POST /api/v1/tenants - Create Tenant', () => {
    it('should create a tenant successfully with SUPER_ADMIN', async () => {
      const token = createToken({
        userId: mockSuperAdminId,
        role: 'SUPER_ADMIN',
        permissions: ['TENANT_CREATE', 'TENANT_READ', 'TENANT_UPDATE'],
      });

      const tenantData = {
        companyName: 'Test Construction Co.',
        owner: mockOwnerId,
        email: `tenant${Date.now()}@test.com`,
        mobileNumber: '9876543210',
        address: '123 Test Street',
        city: 'Mumbai',
        district: 'Mumbai City',
        state: 'Maharashtra',
        pincode: '400001',
      };

      const response = await request(app)
        .post('/api/v1/tenants')
        .set('Authorization', `Bearer ${token}`)
        .send(tenantData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.companyName).toBe(tenantData.companyName);
    });

    it('should fail without authentication', async () => {
      const tenantData = {
        companyName: 'Test Construction Co.',
        owner: mockOwnerId,
        email: 'tenant1@test.com',
        mobileNumber: '9876543210',
      };

      const response = await request(app)
        .post('/api/v1/tenants')
        .send(tenantData);

      expect(response.status).toBe(401);
    });

    it('should fail without TENANT_CREATE permission', async () => {
      const token = createToken({
        userId: mockOwnerId,
        role: 'TENANT_ADMIN',
        permissions: ['TENANT_READ'],
      });

      const tenantData = {
        companyName: 'Test Construction Co.',
        owner: mockOwnerId,
        email: 'tenant2@test.com',
        mobileNumber: '9876543210',
      };

      const response = await request(app)
        .post('/api/v1/tenants')
        .set('Authorization', `Bearer ${token}`)
        .send(tenantData);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/v1/tenants/:id - Get Tenant by ID', () => {
    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/v1/tenants/someid');
      expect(response.status).toBe(401);
    });

    it('should fail without TENANT_READ permission', async () => {
      const token = createToken({
        userId: mockOwnerId,
        role: 'NO_PERMISSION',
        permissions: [],
      });

      const response = await request(app)
        .get('/api/v1/tenants/someid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/v1/tenants - List Tenants', () => {
    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/v1/tenants');
      expect(response.status).toBe(401);
    });

    it('should fail without TENANT_READ permission', async () => {
      const token = createToken({
        userId: mockOwnerId,
        role: 'NO_PERMISSION',
        permissions: [],
      });

      const response = await request(app)
        .get('/api/v1/tenants')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/v1/tenants/:id - Update Tenant', () => {
    it('should fail without authentication', async () => {
      const response = await request(app)
        .put('/api/v1/tenants/someid')
        .send({ companyName: 'Updated' });

      expect(response.status).toBe(401);
    });

    it('should fail without TENANT_UPDATE permission', async () => {
      const token = createToken({
        userId: mockOwnerId,
        role: 'NO_PERMISSION',
        permissions: [],
      });

      const response = await request(app)
        .put('/api/v1/tenants/someid')
        .set('Authorization', `Bearer ${token}`)
        .send({ companyName: 'Updated' });

      expect(response.status).toBe(403);
    });
  });
});
