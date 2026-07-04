import User from '../models/User.js';
import Role from '../models/Role.js';

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
        refreshToken,
      },
      {
        new: true,
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
        new: true,
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
  async findUserByPasswordResetToken() {
    return await User.findOne({
      passwordResetToken: {
        $ne: null,
      },
      passwordResetTokenExpires: {
        $gt: new Date(),
      },
    }).select('+passwordResetToken');
  }
}

export default new AuthRepository();