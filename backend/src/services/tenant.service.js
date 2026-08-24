import { StatusCodes } from 'http-status-codes';

import tenantRepository from '../repositories/tenant.repository.js';
import User from '../models/User.js';
import ApiError from '../common/errors/ApiError.js';
import subscriptionService from '../services/subscription.service.js';

class TenantService {
  async createTenant(tenantData, creatorId) {
    const { companyName, owner, email, mobileNumber } = tenantData;

    const existingEmail = await tenantRepository.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists.');
    }

    const ownerUser = await User.findOne({ _id: owner, isDeleted: false });
    if (!ownerUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Owner user not found.');
    }

    const existingOwnerTenant = await tenantRepository.findByOwner(owner);
    if (existingOwnerTenant) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Owner already has an associated tenant.'
      );
    }

    const tenant = await tenantRepository.create({
      companyName,
      owner,
      email,
      mobileNumber,
      address: tenantData.address,
      city: tenantData.city,
      district: tenantData.district,
      state: tenantData.state,
      pincode: tenantData.pincode,
      status: tenantData.status || 'ACTIVE',
      createdBy: creatorId,
      updatedBy: creatorId,
    });

    const createdTenant = await tenantRepository.findById(tenant._id);

    try {
      await subscriptionService.createTrialSubscription(createdTenant._id);
    } catch (error) {
      if (error.statusCode !== StatusCodes.CONFLICT) {
        throw error;
      }
    }

    return createdTenant;
  }

  async getTenants(query, requestingUser) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter = { isDeleted: false };

    const isSuperAdmin = requestingUser.permissions?.includes('TENANT_READ_ALL')
      || requestingUser.role === 'SUPER_ADMIN';

    if (!isSuperAdmin) {
      filter.owner = requestingUser.userId;
    }

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const tenants = await tenantRepository.findAll(filter, {
      skip,
      limit: Number(limit),
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    });

    const total = await tenantRepository.count(filter);

    return {
      tenants,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getTenantById(tenantId, requestingUser) {
    const tenant = await tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tenant not found.');
    }

    const isSuperAdmin = requestingUser.permissions?.includes('TENANT_READ_ALL')
      || requestingUser.role === 'SUPER_ADMIN';

    if (!isSuperAdmin) {
      const isOwner = tenant.owner._id.toString() === requestingUser.userId;
      if (!isOwner) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          'You do not have permission to access this tenant.'
        );
      }
    }

    return tenant;
  }

  async updateTenant(tenantId, updateData, requestingUser) {
    const tenant = await tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tenant not found.');
    }

    const isSuperAdmin = requestingUser.permissions?.includes('TENANT_UPDATE_ALL')
      || requestingUser.role === 'SUPER_ADMIN';

    if (!isSuperAdmin) {
      const isOwner = tenant.owner._id.toString() === requestingUser.userId;
      if (!isOwner) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          'You do not have permission to update this tenant.'
        );
      }

      if (updateData.owner && updateData.owner !== tenant.owner.toString()) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          'Only SUPER_ADMIN can transfer tenant ownership.'
        );
      }
    }

    if (updateData.email && updateData.email !== tenant.email) {
      const existingEmail = await tenantRepository.findByEmail(updateData.email);
      if (existingEmail) {
        throw new ApiError(StatusCodes.CONFLICT, 'Email already exists.');
      }
    }

    if (updateData.owner && updateData.owner !== tenant.owner.toString()) {
      const ownerUser = await User.findOne({ _id: updateData.owner, isDeleted: false });
      if (!ownerUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Owner user not found.');
      }

      const existingOwnerTenant = await tenantRepository.findByOwner(updateData.owner);
      if (existingOwnerTenant) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          'Owner already has an associated tenant.'
        );
      }
    }

    const updatePayload = {
      ...updateData,
      updatedBy: requestingUser.userId,
    };

    return await tenantRepository.update(tenantId, updatePayload);
  }
}

export default new TenantService();
