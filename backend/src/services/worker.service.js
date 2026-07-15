import { StatusCodes } from 'http-status-codes';

import workerRepository from '../repositories/worker.repository.js';

import ApiError from '../common/errors/ApiError.js';

import WORKER_MESSAGES from '../common/constants/worker.messages.js';

import Site from '../models/Site.js';

import siteRepository from '../repositories/site.repository.js';

import {
  generateEmployeeCode,
} from '../common/utils/worker.util.js';

class WorkerService {
    /**
 * ==========================================
 * Create Worker
 * ==========================================
 */
async createWorker(workerData, createdBy) {
  // Generate Employee Code
  const employeeCode =
    await generateEmployeeCode();

  // Duplicate Mobile Number
  const existingMobile =
    await workerRepository.findByMobileNumber(
      workerData.mobileNumber
    );

  if (existingMobile) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      WORKER_MESSAGES.MOBILE_ALREADY_EXISTS
    );
  }

  // Duplicate Aadhaar Number
  const existingAadhaar =
    await workerRepository.findByAadhaarNumber(
      workerData.aadhaarNumber
    );

  if (existingAadhaar) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      WORKER_MESSAGES.AADHAAR_ALREADY_EXISTS
    );
  }

  // Duplicate PAN Number
  if (workerData.panNumber) {
    const existingPan =
      await workerRepository.findByPanNumber(
        workerData.panNumber
      );

    if (existingPan) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        WORKER_MESSAGES.PAN_ALREADY_EXISTS
      );
    }
  }

 // Validate Site
if (workerData.site) {
  const site = await Site.findOne({
    _id: workerData.site,
    isDeleted: false,
    status: 'ACTIVE',
  });

  if (!site) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.SITE_NOT_FOUND
    );
  }
}
//findActiveById

if (workerData.site) {
  const site =
    await siteRepository.findActiveById(
      workerData.site
    );

  if (!site) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.SITE_NOT_FOUND
    );
  }
}
  /*
  |--------------------------------------------------------------------------
  | TODO: Contractor Validation
  |--------------------------------------------------------------------------
  |
  | Uncomment after Contractor module implementation.
  |
  | const contractor =
  |   await userRepository.findById(
  |     workerData.contractor
  |   );
  |
  | if (!contractor) {
  |   throw new ApiError(
  |     StatusCodes.NOT_FOUND,
  |     WORKER_MESSAGES.CONTRACTOR_NOT_FOUND
  |   );
  | }
  |
  |--------------------------------------------------------------------------
  */

  const worker =
    await workerRepository.create({
      ...workerData,
      employeeCode,
      createdBy,
    });

  return await workerRepository.findById(
    worker._id
  );
}
/**
 * ==========================================
 * Get Workers
 * ==========================================
 */
async getWorkers(query) {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    trade,
    salaryType,
    site,
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
        fullName: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        employeeCode: {
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

  // Status Filter
  if (status) {
    filter.status = status;
  }

  // Trade Filter
  if (trade) {
    filter.trade = trade;
  }

  // Salary Type Filter
  if (salaryType) {
    filter.salaryType = salaryType;
  }

  // Site Filter
  if (site) {
    filter.site = site;
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

  const workers =
    await workerRepository.findAll(
      filter,
      options
    );

  const total =
    await workerRepository.count(filter);

  return {
    workers,
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
 * Get Worker By Id
 * ==========================================
 */
async getWorkerById(workerId) {
  const worker =
    await workerRepository.findById(workerId);

  if (!worker) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.NOT_FOUND
    );
  }

  return worker;
}
/**
 * ==========================================
 * Update Worker
 * ==========================================
 */
async updateWorker(workerId, updateData, updatedBy) {
  // Check Worker Exists
  const worker =
    await workerRepository.findById(workerId);

  if (!worker) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.NOT_FOUND
    );
  }

  // Duplicate Mobile Number
  if (
    updateData.mobileNumber &&
    updateData.mobileNumber !==
      worker.mobileNumber
  ) {
    const existingMobile =
      await workerRepository.findByMobileNumber(
        updateData.mobileNumber
      );

    if (
      existingMobile &&
      existingMobile._id.toString() !==
        workerId
    ) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        WORKER_MESSAGES.MOBILE_ALREADY_EXISTS
      );
    }
  }

  // Duplicate Aadhaar Number
  if (
    updateData.aadhaarNumber &&
    updateData.aadhaarNumber !==
      worker.aadhaarNumber
  ) {
    const existingAadhaar =
      await workerRepository.findByAadhaarNumber(
        updateData.aadhaarNumber
      );

    if (
      existingAadhaar &&
      existingAadhaar._id.toString() !==
        workerId
    ) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        WORKER_MESSAGES.AADHAAR_ALREADY_EXISTS
      );
    }
  }

  // Duplicate PAN Number
  if (
    updateData.panNumber &&
    updateData.panNumber !==
      worker.panNumber
  ) {
    const existingPan =
      await workerRepository.findByPanNumber(
        updateData.panNumber
      );

    if (
      existingPan &&
      existingPan._id.toString() !==
        workerId
    ) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        WORKER_MESSAGES.PAN_ALREADY_EXISTS
      );
    }
  }

 // Validate Site
if (updateData.site) {
  const site = await Site.findOne({
    _id: updateData.site,
    isDeleted: false,
    status: 'ACTIVE',
  });

  if (!site) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.SITE_NOT_FOUND
    );
  }
}
//findActiveById

if (updateData.site) {
  const site =
    await siteRepository.findActiveById(
      updateData.site
    );

  if (!site) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.SITE_NOT_FOUND
    );
  }
}
  /*
  |--------------------------------------------------------------------------
  | TODO: Contractor Validation
  |--------------------------------------------------------------------------
  |
  | Uncomment after Contractor Module implementation.
  |
  | const contractor =
  |   await userRepository.findById(
  |     updateData.contractor
  |   );
  |
  | if (!contractor) {
  |   throw new ApiError(
  |     StatusCodes.NOT_FOUND,
  |     WORKER_MESSAGES.CONTRACTOR_NOT_FOUND
  |   );
  | }
  |
  |--------------------------------------------------------------------------
  */

  const updatedWorker =
    await workerRepository.update(
      workerId,
      {
        ...updateData,
        updatedBy,
      }
    );

  return updatedWorker;
}
/**
 * ==========================================
 * Change Worker Status
 * ==========================================
 */
async changeStatus(workerId, status) {
  const worker =
    await workerRepository.findById(workerId);

  if (!worker) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.NOT_FOUND
    );
  }

  return await workerRepository.changeStatus(
    workerId,
    status
  );
}
/**
 * ==========================================
 * Delete Worker
 * ==========================================
 */
async deleteWorker(workerId) {
  const worker =
    await workerRepository.findById(workerId);

  if (!worker) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.NOT_FOUND
    );
  }

  await workerRepository.softDelete(
    workerId
  );

  return {
    message:
      WORKER_MESSAGES.DELETED_SUCCESS,
  };
}
}


export default new WorkerService();