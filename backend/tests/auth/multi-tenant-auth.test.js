import { jest } from '@jest/globals';

let authService;
let MockUser;

const mockTenantData = [];
const mockUserData = [];
const mockRoleData = [];

let mockIdCounter = 1;
const generateMockId = () => {
  const hex = mockIdCounter.toString(16).padStart(24, '0');
  mockIdCounter++;
  return { toString: () => hex };
};

const mockOwnerId = '507f1f77bcf86cd799439001';
const mockSuperAdminId = '507f1f77bcf86cd799439003';

// Mock Tenant model
class MockTenant {
  constructor(data) {
    this._id = generateMockId();
    this.companyName = data.companyName;
    this.owner = data.owner || null;
    this.email = data.email;
    this.mobileNumber = data.mobileNumber;
    this.address = data.address || null;
    this.city = data.city || null;
    this.district = data.district || null;
    this.state = data.state || null;
    this.pincode = data.pincode || null;
    this.status = data.status || 'ACTIVE';
    this.isDeleted = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

jest.mock('../../src/models/Tenant.js', () => ({
  __esModule: true,
  default: MockTenant,
}));

// Mock Role model
class MockRole {
  constructor(data) {
    this._id = generateMockId();
    this.name = data.name;
    this.code = data.code;
    this.description = data.description || '';
    this.permissions = data.permissions || [];
    this.isSystemRole = data.isSystemRole || false;
    this.status = data.status || 'ACTIVE';
    this.isDeleted = false;
  }
}

jest.mock('../../src/models/Role.js', () => ({
  __esModule: true,
  default: MockRole,
}));

jest.mock('../../src/repositories/auth.repository.js', () => ({
  __esModule: true,
  default: {
    countUsers: async () => mockUserData.filter((u) => !u.isDeleted).length,
    findByEmail: async (email) => mockUserData.find((u) => u.email === email && !u.isDeleted) || null,
    findByMobileNumber: async (mobile) => mockUserData.find((u) => u.mobileNumber === mobile && !u.isDeleted) || null,
    findByUsername: async (username) => mockUserData.find((u) => u.username === username && !u.isDeleted) || null,
    findRoleByCode: async (code) => mockRoleData.find((r) => r.code === code && !r.isDeleted) || null,
    create: async (data) => {
      const user = new MockUser(data);
      mockUserData.push(user);
      return user;
    },
    findById: async (id) => mockUserData.find((u) => u._id.toString() === id.toString() && !u.isDeleted) || null,
    findUserById: async (id) => mockUserData.find((u) => u._id.toString() === id.toString() && !u.isDeleted) || null,
    findUserByIdWithPassword: async (id) => mockUserData.find((u) => u._id.toString() === id.toString() && !u.isDeleted) || null,
    findUserByEmail: async (email) => mockUserData.find((u) => u.email === email && !u.isDeleted) || null,
    findUserByPasswordResetTokenId: async () => null,
    saveRefreshToken: async (userId, hash) => {
      const user = mockUserData.find((u) => u._id.toString() === userId.toString());
      if (user) user.refreshTokenHash = hash;
    },
    removeRefreshToken: async (userId) => {
      const user = mockUserData.find((u) => u._id.toString() === userId.toString());
      if (user) user.refreshTokenHash = null;
    },
    updateLastLogin: async () => {},
    resetFailedLoginAttempts: async (userId) => {
      const user = mockUserData.find((u) => u._id.toString() === userId.toString());
      if (user) {
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
      }
    },
    unlockAccount: async (userId) => {
      const user = mockUserData.find((u) => u._id.toString() === userId.toString());
      if (user) {
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
      }
    },
    incrementFailedLoginAttempts: async (userId) => {
      const user = mockUserData.find((u) => u._id.toString() === userId.toString());
      if (user) {
        user.failedLoginAttempts += 1;
      }
      return user;
    },
    lockAccount: async (userId, lockUntil) => {
      const user = mockUserData.find((u) => u._id.toString() === userId.toString());
      if (user) user.lockUntil = lockUntil;
    },
    updateUserById: async (userId, data) => {
      const user = mockUserData.find((u) => u._id.toString() === userId.toString());
      if (user) Object.assign(user, data);
      return user;
    },
    updatePassword: async () => {},
    updatePasswordAndClearRefreshToken: async () => {},
    savePasswordResetToken: async () => {},
    clearPasswordResetToken: async () => {},
  },
}));

beforeAll(async () => {
  mockIdCounter = 1;
  mockTenantData.length = 0;
  mockUserData.length = 0;
  mockRoleData.length = 0;

  mockRoleData.push(
    { _id: generateMockId(), name: 'Super Admin', code: 'SUPER_ADMIN', permissions: [], status: 'ACTIVE', isDeleted: false },
    { _id: generateMockId(), name: 'Tenant Admin', code: 'TENANT_ADMIN', permissions: [], status: 'ACTIVE', isDeleted: false },
    { _id: generateMockId(), name: 'HR', code: 'HR', permissions: [], status: 'ACTIVE', isDeleted: false },
    { _id: generateMockId(), name: 'Supervisor', code: 'SUPERVISOR', permissions: [], status: 'ACTIVE', isDeleted: false },
  );

  const authModule = await import('../../src/services/auth.service.js');
  authService = authModule.default;
});

beforeEach(() => {
  mockIdCounter = 100;
});

describe('Multi-Tenant Authentication', () => {
  describe('Contractor Registration', () => {
    it('should always register a new TENANT_ADMIN with tenant', async () => {
      const result = await authService.register({
        fullName: 'Contractor Admin',
        email: 'contractor@test.com',
        mobileNumber: '9999999999',
        username: 'contractor',
        password: 'Admin@123',
        companyName: 'Test Construction Co.',
      });

      expect(result.user).toBeDefined();
      expect(result.user.role.code).toBe('TENANT_ADMIN');
      expect(result.user.tenant).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should fail without company name', async () => {
      await expect(
        authService.register({
          fullName: 'Contractor Admin',
          email: 'contractor2@test.com',
          mobileNumber: '9876543210',
          password: 'Admin@123',
        })
      ).rejects.toThrow('Company name is required');
    });

    it('should set tenant owner to created user', async () => {
      const result = await authService.register({
        fullName: 'Tenant Owner',
        email: 'owner@test.com',
        mobileNumber: '9876543212',
        password: 'Admin@123',
        companyName: 'Owner Corp',
      });

      const tenant = mockTenantData.find((t) => t._id.toString() === result.user.tenant.toString());
      expect(tenant).toBeDefined();
      expect(tenant.owner.toString()).toBe(result.user._id.toString());
    });
  });

  describe('Tenant Isolation', () => {
    let tenant1User;
    let tenant2User;
    let tenant1Id;
    let tenant2Id;

    beforeEach(async () => {
      const tenant1Result = await authService.register({
        fullName: 'Tenant1 Admin',
        email: 'tenant1@test.com',
        mobileNumber: '9876543210',
        password: 'Admin@123',
        companyName: 'Tenant1 Corp',
      });
      tenant1User = tenant1Result.user;
      tenant1Id = tenant1Result.tenantId;

      const tenant2Result = await authService.register({
        fullName: 'Tenant2 Admin',
        email: 'tenant2@test.com',
        mobileNumber: '9876543211',
        password: 'Admin@123',
        companyName: 'Tenant2 Corp',
      });
      tenant2User = tenant2Result.user;
      tenant2Id = tenant2Result.tenantId;
    });

    it('should have different tenant IDs for different tenants', async () => {
      expect(tenant1Id.toString()).not.toBe(tenant2Id.toString());
    });

    it('tenant user should have correct tenant reference', async () => {
      expect(tenant1User.tenant.toString()).toBe(tenant1Id.toString());
      expect(tenant2User.tenant.toString()).toBe(tenant2Id.toString());
    });
  });

  describe('Login with Tenant', () => {
    let tenant;

    beforeEach(async () => {
      const tenantResult = await authService.register({
        fullName: 'Tenant Admin',
        email: 'tenant@test.com',
        mobileNumber: '9876543210',
        username: 'tenantadmin',
        password: 'Admin@123',
        companyName: 'Test Corp',
      });
      tenant = tenantResult.tenantId;
    });

    it('should login TENANT_ADMIN with correct tenantId', async () => {
      const result = await authService.login({
        email: 'tenant@test.com',
        password: 'Admin@123',
      });

      expect(result.user).toBeDefined();
      expect(result.tenantId).toBeDefined();
      expect(result.tenantId.toString()).toBe(tenant.toString());
    });

    it('should fail login with wrong password', async () => {
      await expect(
        authService.login({
          email: 'tenant@test.com',
          password: 'WrongPassword1!',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should include tenantId in JWT payload', async () => {
      const result = await authService.login({
        email: 'tenant@test.com',
        password: 'Admin@123',
      });

      const tokenParts = result.accessToken.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64url').toString());

      expect(payload.tenantId).toBeDefined();
      expect(payload.tenantId.toString()).toBe(tenant.toString());
      expect(payload.role).toBe('TENANT_ADMIN');
    });
  });
});