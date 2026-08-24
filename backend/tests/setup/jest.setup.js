import { jest } from '@jest/globals';

jest.mock('../../src/middlewares/auth.middleware.js', () => {
  return function(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Invalid token.');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      const base64Payload = parts[1];
      const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString());

      req.user = {
        userId: payload.userId,
        email: payload.email || 'test@test.com',
        role: payload.role || 'TENANT_ADMIN',
        permissions: payload.permissions || [],
      };

      next();
    } catch {
      const error = new Error('Invalid token.');
      error.statusCode = 401;
      return next(error);
    }
  };
});

jest.mock('../../src/middlewares/authorize.middleware.js', () => {
  return (...requiredPermissions) => {
    return (req, res, next) => {
      if (!req.user) {
        const error = new Error('Authentication is required.');
        error.statusCode = 401;
        return next(error);
      }

      const userPermissions = req.user.permissions || [];
      const hasPermission = requiredPermissions.every((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasPermission) {
        const error = new Error('You do not have permission to perform this action.');
        error.statusCode = 403;
        return next(error);
      }

      next();
    };
  };
});

jest.mock('../../src/models/Tenant.js', () => {
  const mockTenantData = [];
  let mockIdCounter = 1;

  const generateMockId = () => {
    const hex = mockIdCounter.toString(16).padStart(24, '0');
    mockIdCounter++;
    return { toString: () => hex };
  };

  class MockTenantModel {
    constructor(data) {
      this._id = generateMockId();
      this.companyName = data.companyName;
      this.owner = data.owner;
      this.email = data.email;
      this.mobileNumber = data.mobileNumber;
      this.address = data.address || null;
      this.city = data.city || null;
      this.district = data.district || null;
      this.state = data.state || null;
      this.pincode = data.pincode || null;
      this.status = data.status || 'ACTIVE';
      this.createdBy = data.createdBy || null;
      this.updatedBy = data.updatedBy || null;
      this.isDeleted = false;
      this.deletedAt = null;
      this.createdAt = new Date();
      this.updatedAt = new Date();
      mockTenantData.push(this);
    }
  }

  MockTenantModel.create = async (data) => {
    const doc = new MockTenantModel(data);
    return doc;
  };

  MockTenantModel.findOne = async (query) => {
    const { _id, email, owner, isDeleted = false } = query;
    if (_id) {
      return mockTenantData.find(
        (t) => t._id.toString() === _id.toString() && !t.isDeleted
      ) || null;
    }
    if (email) {
      return mockTenantData.find(
        (t) => t.email === email && !t.isDeleted
      ) || null;
    }
    if (owner) {
      return mockTenantData.find(
        (t) => t.owner.toString() === owner.toString() && !t.isDeleted
      ) || null;
    }
    return mockTenantData.find((t) => !t.isDeleted === isDeleted) || null;
  };

  MockTenantModel.findById = async (id) => {
    return mockTenantData.find(
      (t) => t._id.toString() === id.toString() && !t.isDeleted
    ) || null;
  };

  MockTenantModel.find = async (query = {}) => {
    let results = mockTenantData.filter((t) => !t.isDeleted);
    if (query.status) {
      results = results.filter((t) => t.status === query.status);
    }
    return results;
  };

  MockTenantModel.countDocuments = async (query = {}) => {
    let results = mockTenantData.filter((t) => !t.isDeleted);
    if (query.status) {
      results = results.filter((t) => t.status === query.status);
    }
    return results.length;
  };

  MockTenantModel.findByIdAndUpdate = async (id, updateData) => {
    const index = mockTenantData.findIndex(
      (t) => t._id.toString() === id.toString()
    );
    if (index === -1) return null;
    mockTenantData[index] = { ...mockTenantData[index], ...updateData, updatedAt: new Date() };
    return mockTenantData[index];
  };

  return {
    __esModule: true,
    default: MockTenantModel,
  };
});

jest.mock('../../src/models/User.js', () => {
  const mockUserData = [];

  class MockUserModel {
    constructor(data) {
      this._id = data._id || '507f1f77bcf86cd799439001';
      this.fullName = data.fullName || 'Test User';
      this.email = data.email;
      this.mobileNumber = data.mobileNumber;
      this.password = data.password;
      this.role = data.role;
      this.status = data.status || 'ACTIVE';
      this.isDeleted = false;
      mockUserData.push(this);
    }
  }

  MockUserModel.findOne = async (query) => {
    const { _id, email } = query;
    if (_id) {
      return mockUserData.find(
        (u) => u._id.toString() === _id.toString() && !u.isDeleted
      ) || null;
    }
    if (email) {
      return mockUserData.find(
        (u) => u.email === email && !u.isDeleted
      ) || null;
    }
    return null;
  };

  return {
    __esModule: true,
    default: MockUserModel,
  };
});
