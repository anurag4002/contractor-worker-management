import { StatusCodes } from 'http-status-codes';

import workerRepository from '../repositories/worker.repository.js';

import ApiError from '../common/errors/ApiError.js';

import WORKER_MESSAGES from '../common/constants/worker.messages.js';

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
 async createWorker(workerData, createdBy, tenantId) {
  // Generate Employee Code
  const employeeCode =
    await generateEmployeeCode();

  // Duplicate Mobile Number
  const existingMobile =
    await workerRepository.findByMobileNumber(
      workerData.mobileNumber,
      tenantId
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
      workerData.aadhaarNumber,
      tenantId
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
        workerData.panNumber,
        tenantId
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
    const site =
      await siteRepository.findActiveById(
        workerData.site,
        tenantId
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
      tenant: tenantId,
    });

  return await workerRepository.findById(
    worker._id,
    tenantId
  );
}
/**
 * ==========================================
 * Get Workers
 * ==========================================
 */
async getWorkers(query, tenantId) {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    trade,
    salaryType,
    site,
    available,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const filter = {
    isDeleted: false,
  };

  if (tenantId) {
    filter.tenant = tenantId;
  }

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

  // Available Filter (unassigned workers)
  if (available === 'true') {
    filter.site = null;
    filter.status = 'ACTIVE';
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
      options,
      null
    );

  const total =
    await workerRepository.count(filter, null);

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
async getWorkerById(workerId, tenantId) {
  const worker =
    await workerRepository.findById(workerId, tenantId);

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
async updateWorker(workerId, updateData, updatedBy, tenantId) {
  // Check Worker Exists
  const worker =
    await workerRepository.findById(workerId, tenantId);

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
        updateData.mobileNumber,
        tenantId
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
        updateData.aadhaarNumber,
        tenantId
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
        updateData.panNumber,
        tenantId
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
    const site =
      await siteRepository.findActiveById(
        updateData.site,
        tenantId
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
       },
       tenantId
     );

   return updatedWorker;
}
/**
 * ==========================================
 * Change Worker Status
 * ==========================================
 */
async changeStatus(workerId, status, tenantId) {
  const worker =
    await workerRepository.findById(workerId, tenantId);

  if (!worker) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.NOT_FOUND
    );
  }

  return await workerRepository.changeStatus(
    workerId,
    status,
    tenantId
  );
}
/**
 * ==========================================
 * Delete Worker
 * ==========================================
 */
async deleteWorker(workerId, tenantId) {
  const worker =
    await workerRepository.findById(workerId, tenantId);

  if (!worker) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      WORKER_MESSAGES.NOT_FOUND
    );
  }

  await workerRepository.softDelete(
    workerId,
    tenantId
  );

  return {
    message:
      WORKER_MESSAGES.DELETED_SUCCESS,
  };
}
}


export default new WorkerService();