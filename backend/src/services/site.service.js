import { StatusCodes } from 'http-status-codes';

import siteRepository from '../repositories/site.repository.js';

import ApiError from '../common/errors/ApiError.js';

import SITE_MESSAGES from '../common/constants/site.messages.js';

/**
 * ==========================================
 * Generate Site Code
 * ==========================================
 *
 * Format:
 * SITE00001
 * SITE00002
 * SITE00003
 *
 */
const generateSiteCode = async () => {
  const latestSite =
    await siteRepository.findLatestSite();

  if (!latestSite) {
    return 'SITE00001';
  }

  const lastNumber = Number(
    latestSite.siteCode.replace(
      'SITE',
      ''
    )
  );

  return `SITE${String(lastNumber + 1).padStart(
    5,
    '0'
  )}`;
};

class SiteService {
    /**
 * ==========================================
 * Create Site
 * ==========================================
 */
async createSite(siteData, createdBy) {
   console.log('siteData:', siteData);

  // Generate Site Code
  const siteCode =
    await generateSiteCode();

  // Duplicate Site Name
  const existingSiteName =
    await siteRepository.findBySiteName(
      siteData.siteName
    );

  if (existingSiteName) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      SITE_MESSAGES.SITE_NAME_ALREADY_EXISTS
    );
  }

  // Duplicate Contact Number
  const existingContactNumber =
    await siteRepository.findByContactNumber(
      siteData.contactNumber
    );

  if (existingContactNumber) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      SITE_MESSAGES.CONTACT_NUMBER_ALREADY_EXISTS
    );
  }

  // Duplicate Email
  if (siteData.email) {
    const existingEmail =
      await siteRepository.findByEmail(
        siteData.email
      );

    if (existingEmail) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        SITE_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    }
  }

  // Validate Dates
  if (
    siteData.endDate &&
    new Date(siteData.endDate) <
      new Date(siteData.startDate)
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      SITE_MESSAGES.INVALID_END_DATE
    );
  }

  // Create Site
  const site =
    await siteRepository.create({
      ...siteData,
      siteCode,
      createdBy,
    });

  return await siteRepository.findById(
    site._id
  );
}
/**
 * ==========================================
 * Get Sites
 * ==========================================
 */
async getSites(query) {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    city,
    state,
    clientName,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const filter = {
    isDeleted: false,
  };

  // Search
  if (search) {
    filter.$or = [
      {
        siteName: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        siteCode: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        clientName: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        projectName: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  // Status Filter
  if (status) {
    filter.status = status;
  }

  // City Filter
  if (city) {
    filter.city = city;
  }

  // State Filter
  if (state) {
    filter.state = state;
  }

  // Client Filter
  if (clientName) {
    filter.clientName = {
      $regex: clientName,
      $options: 'i',
    };
  }

  const skip = (page - 1) * limit;

  const options = {
    skip,
    limit: Number(limit),
    sort: {
      [sortBy]:
        sortOrder === 'asc' ? 1 : -1,
    },
  };

  const sites =
    await siteRepository.findAll(
      filter,
      options
    );

  const total =
    await siteRepository.count(filter);

  return {
    sites,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}
    /**
 * ==========================================
 * Get Site By Id
 * ==========================================
 */
async getSiteById(siteId) {
  const site =
    await siteRepository.findById(siteId);

  if (!site) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      SITE_MESSAGES.NOT_FOUND
    );
  }

  return site;
}
/**
 * ==========================================
 * Update Site
 * ==========================================
 */
async updateSite(siteId, updateData, updatedBy) {
  // Check Site Exists
  const site =
    await siteRepository.findById(siteId);

  if (!site) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      SITE_MESSAGES.NOT_FOUND
    );
  }

  // Duplicate Site Name
  if (
    updateData.siteName &&
    updateData.siteName !== site.siteName
  ) {
    const existingSiteName =
      await siteRepository.findBySiteName(
        updateData.siteName
      );

    if (
      existingSiteName &&
      existingSiteName._id.toString() !== siteId
    ) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        SITE_MESSAGES.SITE_NAME_ALREADY_EXISTS
      );
    }
  }

  // Duplicate Contact Number
  if (
    updateData.contactNumber &&
    updateData.contactNumber !==
      site.contactNumber
  ) {
    const existingContactNumber =
      await siteRepository.findByContactNumber(
        updateData.contactNumber
      );

    if (
      existingContactNumber &&
      existingContactNumber._id.toString() !==
        siteId
    ) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        SITE_MESSAGES.CONTACT_NUMBER_ALREADY_EXISTS
      );
    }
  }

  // Duplicate Email
  if (
    updateData.email &&
    updateData.email !== site.email
  ) {
    const existingEmail =
      await siteRepository.findByEmail(
        updateData.email
      );

    if (
      existingEmail &&
      existingEmail._id.toString() !== siteId
    ) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        SITE_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    }
  }

  // Validate Dates
  const startDate =
    updateData.startDate || site.startDate;

  const endDate =
    updateData.endDate || site.endDate;

  if (
    endDate &&
    new Date(endDate) < new Date(startDate)
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      SITE_MESSAGES.INVALID_END_DATE
    );
  }

  // Update Site
  const updatedSite =
    await siteRepository.update(
      siteId,
      {
        ...updateData,
        updatedBy,
      }
    );

  return updatedSite;
}
/**
 * ==========================================
 * Change Site Status
 * ==========================================
 */
async changeStatus(siteId, status) {
  // Check Site Exists
  const site =
    await siteRepository.findById(siteId);

  if (!site) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      SITE_MESSAGES.NOT_FOUND
    );
  }

  // Change Status
  return await siteRepository.changeStatus(
    siteId,
    status
  );
}
/**
 * ==========================================
 * Delete Site
 * ==========================================
 */
async deleteSite(siteId) {
  // Check Site Exists
  const site =
    await siteRepository.findById(siteId);

  if (!site) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      SITE_MESSAGES.NOT_FOUND
    );
  }

  // Soft Delete Site
  await siteRepository.softDelete(
    siteId
  );

  return {
    message:
      SITE_MESSAGES.DELETED_SUCCESS,
  };
}

}
export default new SiteService();