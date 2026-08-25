import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositories/user.repository.js';

import Role from '../models/Role.js';

import ApiError from '../common/errors/ApiError.js';

import { hashPassword } from '../common/utils/password.util.js';

class UserService {
  /**
   * =====================================
   * Create User
   * =====================================
   */
  async createUser(userData, tenantId) {
    const {
      fullName,
      email,
      mobileNumber,
      password,
      role,
    } = userData;

    const existingEmail =
      await userRepository.findByEmail(
        email,
        tenantId
      );

    if (existingEmail) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Email already exists.'
      );
    }

    const existingMobile =
      await userRepository.findByMobileNumber(
        mobileNumber,
        tenantId
      );

    if (existingMobile) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Mobile number already exists.'
      );
    }

    const roleExists = await Role.findById(role);

    if (!roleExists) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Role not found.'
      );
    }

    const hashedPassword =
      await hashPassword(password);

    const user = await userRepository.create({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      role,
      tenant: tenantId,
    });

    return await userRepository.findById(
      user._id,
      tenantId
    );
  }

  /**
   * =====================================
   * Get Users
   * =====================================
   */
  async getUsers(query, tenantId) {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter = {
      isDeleted: false,
    };

    if (tenantId) {
      filter.tenant = tenantId;
    }

    if (search) {
      filter.$or = [
        {
          fullName: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          mobileNumber: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    const skip =
      (Number(page) - 1) * Number(limit);

    const users =
      await userRepository.findAll(
        filter,
        {
          skip,
          limit: Number(limit),
          sort: {
            [sortBy]:
              sortOrder === 'asc' ? 1 : -1,
          },
        },
        tenantId
      );

    const total =
      await userRepository.count(
        filter,
        tenantId
      );

    return {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(
          total / Number(limit)
        ),
      },
    };
  }

  /**
   * =====================================
   * Get User By Id
   * =====================================
   */
  async getUserById(userId, tenantId) {
    const user =
      await userRepository.findById(
        userId,
        tenantId
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'User not found.'
      );
    }

    return user;
  }

  /**
   * =====================================
   * Update User
   * =====================================
   */
  async updateUser(userId, updateData, tenantId) {
    const user =
      await userRepository.findById(
        userId,
        tenantId
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'User not found.'
      );
    }

    if (
      updateData.email &&
      updateData.email !== user.email
    ) {
      const existingEmail =
        await userRepository.findByEmail(
          updateData.email,
          tenantId
        );

      if (existingEmail) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          'Email already exists.'
        );
      }
    }

    if (
      updateData.mobileNumber &&
      updateData.mobileNumber !==
        user.mobileNumber
    ) {
      const existingMobile =
        await userRepository.findByMobileNumber(
          updateData.mobileNumber,
          tenantId
        );

      if (existingMobile) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          'Mobile number already exists.'
        );
      }
    }

    if (updateData.role) {
      const roleExists =
        await Role.findById(updateData.role);

      if (!roleExists) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          'Role not found.'
        );
      }
    }

    return await userRepository.update(
      userId,
      updateData,
      tenantId
    );
  }

  /**
   * =====================================
   * Change User Status
   * =====================================
   */
  async changeStatus(userId, status, tenantId) {
    const user =
      await userRepository.findById(
        userId,
        tenantId
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'User not found.'
      );
    }

    return await userRepository.updateStatus(
      userId,
      status,
      tenantId
    );
  }

  /**
   * =====================================
   * Soft Delete User
   * =====================================
   */
  async deleteUser(userId, tenantId) {
    const user =
      await userRepository.findById(
        userId,
        tenantId
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'User not found.'
      );
    }

    await userRepository.softDelete(
      userId,
      tenantId
    );

    return {
      message: 'User deleted successfully.',
    };
  }
}

export default new UserService();
