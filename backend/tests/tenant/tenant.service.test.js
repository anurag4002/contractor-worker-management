import { jest } from '@jest/globals';

let tenantService;

jest.mock('../../src/repositories/tenant.repository.js', () => {
  const mockTenantData = [];
  let mockIdCounter = 1;

  const generateMockId = () => {
    const hex = mockIdCounter.toString(16).padStart(24, '0');
    mockIdCounter++;
    return { toString: () => hex };
  };

  return {
    __esModule: true,
    default: {
      create: async (data) => {
        const tenant = {
          _id: generateMockId(),
          ...data,
          status: data.status || 'ACTIVE',
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockTenantData.push(tenant);
        return tenant;
      },
      findById: async (id) => {
        return mockTenantData.find(
          (t) => t._id.toString() === id.toString() && !t.isDeleted
        ) || null;
      },
      findByEmail: async (email) => {
        return mockTenantData.find(
          (t) => t.email === email && !t.isDeleted
        ) || null;
      },
      findByOwner: async (ownerId) => {
        return mockTenantData.find(
          (t) => t.owner.toString() === ownerId.toString() && !t.isDeleted
        ) || null;
      },
      findAll: async (filter, _options) => {
        let results = mockTenantData.filter((t) => !t.isDeleted);
        if (filter.status) {
          results = results.filter((t) => t.status === filter.status);
        }
        return results;
      },
      count: async (filter) => {
        let results = mockTenantData.filter((t) => !t.isDeleted);
        if (filter.status) {
          results = results.filter((t) => t.status === filter.status);
        }
        return results.length;
      },
      update: async (id, updateData) => {
        const index = mockTenantData.findIndex(
          (t) => t._id.toString() === id.toString()
        );
        if (index === -1) return null;
        mockTenantData[index] = { ...mockTenantData[index], ...updateData };
        return mockTenantData[index];
      },
    },
  };
});

jest.mock('../../src/models/User.js', () => {
  return {
    __esModule: true,
    default: {
      findOne: async (query) => {
        const { _id } = query;
        if (_id && _id.toString() === '507f1f77bcf86cd799439001') {
          return { _id, status: 'ACTIVE' };
        }
        return null;
      },
    },
  };
});

jest.mock('../../src/services/subscription.service.js', () => {
  return {
    __esModule: true,
    default: {
      createTrialSubscription: async () => ({}),
    },
  };
});

beforeAll(async () => {
  const module = await import('../../src/services/tenant.service.js');
  tenantService = module.default;
});

const mockOwnerId = '507f1f77bcf86cd799439001';
const mockAnotherOwnerId = '507f1f77bcf86cd799439002';
const mockSuperAdminId = '507f1f77bcf86cd799439003';

const superAdminUser = {
  userId: mockSuperAdminId,
  email: 'superadmin@test.com',
  role: 'SUPER_ADMIN',
  permissions: ['TENANT_CREATE', 'TENANT_READ', 'TENANT_UPDATE'],
};

const tenantAdminUser = {
  userId: mockOwnerId,
  email: 'tenantadmin@test.com',
  role: 'TENANT_ADMIN',
  permissions: ['TENANT_READ', 'TENANT_UPDATE'],
};

const anotherTenantUser = {
  userId: mockAnotherOwnerId,
  email: 'another@test.com',
  role: 'TENANT_ADMIN',
  permissions: ['TENANT_READ', 'TENANT_UPDATE'],
};

describe('Tenant Service', () => {
  describe('createTenant', () => {
    it('should create a tenant successfully', async () => {
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

      const result = await tenantService.createTenant(tenantData, mockSuperAdminId);

      expect(result).toBeDefined();
      expect(result.companyName).toBe(tenantData.companyName);
      expect(result.email).toBe(tenantData.email);
      expect(result.status).toBe('ACTIVE');
    });

    it('should fail with duplicate email', async () => {
      const email = `duplicate${Date.now()}test.com`;
      const tenantData = {
        companyName: 'First Company',
        owner: mockOwnerId,
        email,
        mobileNumber: '9876543210',
      };

      await tenantService.createTenant(tenantData, mockSuperAdminId);

      const duplicateData = {
        companyName: 'Second Company',
        owner: mockAnotherOwnerId,
        email,
        mobileNumber: '9876543211',
      };

      await expect(
        tenantService.createTenant(duplicateData, mockSuperAdminId)
      ).rejects.toThrow('Email already exists');
    });

    it('should fail when owner already has a tenant', async () => {
      const tenantData = {
        companyName: 'First Company',
        owner: mockOwnerId,
        email: `owner1${Date.now()}test.com`,
        mobileNumber: '9876543210',
      };

      await tenantService.createTenant(tenantData, mockSuperAdminId);

      const duplicateOwnerData = {
        companyName: 'Second Company',
        owner: mockOwnerId,
        email: `owner2${Date.now()}test.com`,
        mobileNumber: '9876543211',
      };

      await expect(
        tenantService.createTenant(duplicateOwnerData, mockSuperAdminId)
      ).rejects.toThrow('Owner already has an associated tenant');
    });
  });

  describe('getTenantById', () => {
    it('should get tenant by ID as SUPER_ADMIN', async () => {
      const tenantData = {
        companyName: 'Test Company',
        owner: mockOwnerId,
        email: `get${Date.now()}test.com`,
        mobileNumber: '9876543210',
      };

      const created = await tenantService.createTenant(tenantData, mockSuperAdminId);
      const result = await tenantService.getTenantById(created._id, superAdminUser);

      expect(result).toBeDefined();
      expect(result._id.toString()).toBe(created._id.toString());
    });

    it('should get tenant by ID as owner', async () => {
      const tenantData = {
        companyName: 'Owner Company',
        owner: mockOwnerId,
        email: `owner${Date.now()}test.com`,
        mobileNumber: '9876543210',
      };

      const created = await tenantService.createTenant(tenantData, mockSuperAdminId);
      const result = await tenantService.getTenantById(created._id, tenantAdminUser);

      expect(result).toBeDefined();
      expect(result._id.toString()).toBe(created._id.toString());
    });

    it('should fail when non-owner tries to access tenant', async () => {
      const tenantData = {
        companyName: 'Private Company',
        owner: mockOwnerId,
        email: `private${Date.now()}test.com`,
        mobileNumber: '9876543210',
      };

      const created = await tenantService.createTenant(tenantData, mockSuperAdminId);

      await expect(
        tenantService.getTenantById(created._id, anotherTenantUser)
      ).rejects.toThrow('You do not have permission to access this tenant');
    });

    it('should return 404 for non-existent tenant', async () => {
      const fakeId = '507f1f77bcf86cd799439099';

      await expect(
        tenantService.getTenantById(fakeId, superAdminUser)
      ).rejects.toThrow('Tenant not found');
    });
  });

  describe('getTenants', () => {
    it('should list all tenants as SUPER_ADMIN', async () => {
      const result = await tenantService.getTenants({}, superAdminUser);

      expect(result).toBeDefined();
      expect(result.tenants).toBeDefined();
      expect(result.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const result = await tenantService.getTenants(
        { page: 1, limit: 10 },
        superAdminUser
      );

      expect(result).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });
  });

  describe('updateTenant', () => {
    it('should update tenant as SUPER_ADMIN', async () => {
      const tenantData = {
        companyName: 'Update Test',
        owner: mockOwnerId,
        email: `update${Date.now()}test.com`,
        mobileNumber: '9876543210',
      };

      const created = await tenantService.createTenant(tenantData, mockSuperAdminId);
      const updateData = { companyName: 'Updated Company Name' };

      const result = await tenantService.updateTenant(
        created._id,
        updateData,
        superAdminUser
      );

      expect(result).toBeDefined();
      expect(result.companyName).toBe('Updated Company Name');
    });

    it('should update tenant as owner', async () => {
      const tenantData = {
        companyName: 'Owner Update Test',
        owner: mockOwnerId,
        email: `ownerupdate${Date.now()}test.com`,
        mobileNumber: '9876543210',
      };

      const created = await tenantService.createTenant(tenantData, mockSuperAdminId);
      const updateData = { address: 'New Address 456' };

      const result = await tenantService.updateTenant(
        created._id,
        updateData,
        tenantAdminUser
      );

      expect(result).toBeDefined();
      expect(result.address).toBe('New Address 456');
    });

    it('should fail when non-owner tries to update tenant', async () => {
      const tenantData = {
        companyName: 'Protected Company',
        owner: mockOwnerId,
        email: `protected${Date.now()}test.com`,
        mobileNumber: '9876543210',
      };

      const created = await tenantService.createTenant(tenantData, mockSuperAdminId);
      const updateData = { companyName: 'Hacked Name' };

      await expect(
        tenantService.updateTenant(created._id, updateData, anotherTenantUser)
      ).rejects.toThrow('You do not have permission to update this tenant');
    });

    it('should fail with duplicate email on update', async () => {
      const email1 = `email1${Date.now()}test.com`;
      const email2 = `email2${Date.now()}test.com`;

      await tenantService.createTenant(
        {
          companyName: 'First',
          owner: mockOwnerId,
          email: email1,
          mobileNumber: '9876543210',
        },
        mockSuperAdminId
      );

      const second = await tenantService.createTenant(
        {
          companyName: 'Second',
          owner: mockAnotherOwnerId,
          email: email2,
          mobileNumber: '9876543211',
        },
        mockSuperAdminId
      );

      await expect(
        tenantService.updateTenant(second._id, { email: email1 }, superAdminUser)
      ).rejects.toThrow('Email already exists');
    });

    it('should return 404 for non-existent tenant', async () => {
      const fakeId = '507f1f77bcf86cd799439099';

      await expect(
        tenantService.updateTenant(fakeId, { companyName: 'New' }, superAdminUser)
      ).rejects.toThrow('Tenant not found');
    });
  });
});
