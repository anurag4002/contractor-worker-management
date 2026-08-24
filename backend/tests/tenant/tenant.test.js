import request from 'supertest';

let app;

beforeAll(async () => {
  app = (await import('../../src/app.js')).default;
});

const createToken = (payload) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = 'mock-signature';
  return `${header}.${base64Payload}.${signature}`;
};

const mockOwnerId = '507f1f77bcf86cd799439001';
const mockSuperAdminId = '507f1f77bcf86cd799439003';

describe('Tenant Module', () => {
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
        email: `tenant${Date.now()}test.com`,
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
