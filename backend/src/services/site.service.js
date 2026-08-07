import { StatusCodes } from 'http-status-codes';

import mongoose from 'mongoose';

import siteRepository from '../repositories/site.repository.js';

import workerRepository from '../repositories/worker.repository.js';

import ApiError from '../common/errors/ApiError.js';

import SITE_MESSAGES from '../common/constants/site.messages.js';

import dashboardRepository from '../repositories/dashboard.repository.js';

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setHours(24, 0, 0, 0);

  const presentBySite =
    await dashboardRepository.getTodayPresentBySite();

  const presentMap = new Map();
  presentBySite.forEach((item) => {
    presentMap.set(
      item._id.toString(),
      item.present
    );
  });

  const sitesWithPresent = sites.map((site) => ({
    ...site.toObject(),
    present: presentMap.get(site._id.toString()) || 0,
  }));

  return {
    sites: sitesWithPresent,
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
/**
 * ==========================================
 * Assign Workers to Site
 * ==========================================
 */
async assignWorkers(siteId, workerIds, assignedBy) {
  // Check Site Exists
  const site =
    await siteRepository.findActiveById(siteId);

  if (!site) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      SITE_MESSAGES.NOT_FOUND
    );
  }

  if (!Array.isArray(workerIds) || workerIds.length === 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'No workers provided for assignment.'
    );
  }

  // Validate Workers
  const workers =
    await workerRepository.findManyByIds(
      workerIds
    );

  if (workers.length !== workerIds.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'One or more workers do not exist.'
    );
  }

  // Check for deleted or inactive workers
  const invalidWorkers = workers.filter(
    (w) => w.isDeleted || w.status !== 'ACTIVE'
  );

  if (invalidWorkers.length > 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'One or more workers are inactive or deleted.'
    );
  }

  // Check for already assigned workers
  const alreadyAssigned = workers.filter(
    (w) => w.site && w.site.toString() !== siteId
  );

  if (alreadyAssigned.length > 0) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      'One or more workers are already assigned to another site.'
    );
  }

  // Remove duplicates
  const uniqueWorkerIds = [
    ...new Set(workerIds.map((id) => id.toString())),
  ];

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Update workers site field
    await workerRepository.assignToSite(
      siteId,
      uniqueWorkerIds,
      assignedBy,
      session
    );

    // Update site workers array
    await siteRepository.addWorkers(
      siteId,
      uniqueWorkerIds,
      session
    );

    await session.commitTransaction();

    return {
      message: `${uniqueWorkerIds.length} worker(s) assigned successfully.`,
      assignedCount: uniqueWorkerIds.length,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

}
export default new SiteService();