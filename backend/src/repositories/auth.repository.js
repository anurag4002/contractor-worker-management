import User from '../models/User.js';
import Role from '../models/Role.js';
import { v4 as uuidv4 } from 'uuid';

import { generateRandomToken } from '../common/utils/token.util.js';

import Permission from '../models/Permission.js';

import { hashPassword } from '../common/utils/password.util.js';
class AuthRepository {
  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await User.findOne({
      email,
      isDeleted: false,
    })
      .select('+password +refreshToken')
      .populate({
        path: 'role',
        match: {
          isDeleted: false,
          status: 'ACTIVE',
        },
        populate: {
          path: 'permissions',
          match: {
            isDeleted: false,
            status: 'ACTIVE',
          },
        },
      });
  }

  /**
 * Find user by email without password
 */
  async findUserByEmail(email) {
    return await User.findOne({
      email,
      isDeleted: false,
    }).populate({
      path: 'role',
      match: {
        isDeleted: false,
        status: 'ACTIVE',
      },
      populate: {
        path: 'permissions',
        match: {
          isDeleted: false,
          status: 'ACTIVE',
        },
      },
    });
  }

  /**
   * Find user by mobile number
   */
  async findByMobileNumber(mobileNumber) {
    return await User.findOne({
      mobileNumber,
      isDeleted: false,
    }).populate('role');
  }

  /**
   * Find user by username
   */
  async findByUsername(username) {
    return await User.findOne({
      username,
      isDeleted: false,
    }).populate('role');
  }

  /**
   * Count active users
   */
  async countUsers() {
    return await User.countDocuments({
      isDeleted: false,
    });
  }

  /**
   * Find user by id
   */
  async findUserById(userId) {
    return await User.findOne({
      _id: userId,
      isDeleted: false,
    })
      .select('+refreshTokenHash')
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      });
  }

  /**
   * Find user by id
   */
  async findById(userId) {
    return await this.findUserById(userId);
  }

  /**
   * Create new user
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    return await User.create(userData);
  }

  /**
   * Update user
   */
  async updateUserById(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        lastLogin: new Date(),
        failedLoginAttempts: 0,
        lockUntil: null,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Save refresh token
   */
  async saveRefreshToken(userId, refreshTokenHash) {
  return await User.findByIdAndUpdate(
    userId,
    {
      refreshTokenHash,
    },
    {
      returnDocument: 'after',
    }
  );
}

  /**
   * Remove refresh token
   */
  async removeRefreshToken(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        refreshTokenHash: null,
        lockUntil: null,
        failedLoginAttempts: 0,
      },
      {
         returnDocument: 'after',
      }
    );
  }

  /**
   * Increment failed login attempts
   */
  async incrementFailedLoginAttempts(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          failedLoginAttempts: 1,
        },
      },
      {
        new: true,
      }
    );
  }

  /**
   * Lock account
   */
  async lockAccount(userId, lockUntil) {
    return await User.findByIdAndUpdate(
      userId,
      {
        lockUntil,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Update password
   */
  async updatePassword(userId, hashedPassword) {
    return await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
      {
        new: true,
      }
    );
  }

  /**
   * Find role by code
   */
  async findRoleByCode(code) {
    return await Role.findOne({
      code,
      isDeleted: false,
      status: 'ACTIVE',
    }).populate({
      path: 'permissions',
      match: {
        isDeleted: false,
        status: 'ACTIVE',
      },
    });
  }

  /**
   * Find role
   */
  async findRoleById(roleId) {
    return await Role.findOne({
      _id: roleId,
      isDeleted: false,
      status: 'ACTIVE',
    }).populate('permissions');
  }
  /**
   * Reset failed login attempts
   */
  async resetFailedLoginAttempts(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        failedLoginAttempts: 0,
        lockUntil: null,
      },
      {
        new: true,
      }
    );
  }

  /**
 * Find User By Password Reset Token Id
 */
  async findUserByPasswordResetTokenId(
    passwordResetTokenId
  ) {
    return await User.findOne({
      passwordResetTokenId,
      isDeleted: false,
    })
      .select('+passwordResetTokenHash')
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      });
  }
  /** 
   * Unlock account
  */
  async unlockAccount(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        lockUntil: null,
        failedLoginAttempts: 0,
      },
      {
        new: true,
      }
    );
  }

  // /**
  //  * Find user by refresh token
  //  */
  // async findByRefreshToken(refreshToken) {
  //   return await User.findOne({
  //     refreshToken,
  //     isDeleted: false,
  //   }).populate({
  //     path: 'role',
  //     populate: {
  //       path: 'permissions',
  //     },
  //   });
  // }

  /**
* Logout User
*/
  async logout(userId) {
    // Find User
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        AUTH_MESSAGES.USER.NOT_FOUND
      );
    }

    // Remove Refresh Token
    await authRepository.removeRefreshToken(userId);

    return {
      message: AUTH_MESSAGES.LOGOUT.SUCCESS,
    };
  }
  /**
 * Find User By Password Reset Token
 */
  // async findUserByPasswordResetToken() {
  //   return await User.findOne({
  //     passwordResetToken: {
  //       $ne: null,
  //     },
  //     passwordResetTokenExpires: {
  //       $gt: new Date(),
  //     },
  //   }).select('+passwordResetToken');
  // }

  /**
 * Save Password Reset Token
 */
  async savePasswordResetToken(
    userId,
    passwordResetTokenId,
    passwordResetTokenHash,
    passwordResetTokenExpires
  ) {
    return await User.findByIdAndUpdate(
      userId,
      {
        passwordResetTokenId,
        passwordResetTokenHash,
        passwordResetTokenExpires,
      },
      {
        new: true,
      }
    );
  }
  /**
 * Clear Password Reset Token
 */
  async clearPasswordResetToken(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        passwordResetTokenId: null,
        passwordResetTokenHash: null,
        passwordResetTokenExpires: null,
        refreshTokenHash: null,
      },
      {
        new: true,
      }
    );
  }
  /**
 * Update Password And Clear Refresh Token
 */
  async updatePasswordAndClearRefreshToken(
    userId,
    hashedPassword
  ) {
    return await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        refreshTokenHash: null,
        passwordResetTokenId: null,
        passwordResetTokenHash: null,
        passwordResetTokenExpires: null,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /**
 * Find User By Id With Password
 */
async findUserByIdWithPassword(userId) {
  return await User.findOne({
    _id: userId,
    isDeleted: false,
  }).select('+password');
}
}

export default new AuthRepository();
