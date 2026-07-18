import workerService from '../services/worker.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

/**
 * ==========================================
 * Create Worker
 * ==========================================
 */
const createWorker = asyncHandler(async (req, res) => {
  const worker =
    await workerService.createWorker(
      req.body,
      req.user.userId
    );

  return ApiResponse.created(
    res,
    worker,
    'Worker created successfully.'
  );
});

/**
 * ==========================================
 * Get All Workers
 * ==========================================
 */
const getWorkers = asyncHandler(async (req, res) => {
  const result =
    await workerService.getWorkers(req.query);

  return ApiResponse.paginated(
    res,
    result.workers,
    result.pagination,
    'Workers fetched successfully.'
  );
});

/**
 * ==========================================
 * Get Worker By Id
 * ==========================================
 */
const getWorkerById = asyncHandler(
  async (req, res) => {
    const worker =
      await workerService.getWorkerById(
        req.params.id
      );

    return ApiResponse.success(
      res,
      worker,
      'Worker fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Update Worker
 * ==========================================
 */
const updateWorker = asyncHandler(
  async (req, res) => {
    const worker =
      await workerService.updateWorker(
        req.params.id,
        req.body,
        req.user.userId
      );

    return ApiResponse.success(
      res,
      worker,
      'Worker updated successfully.'
    );
  }
);

/**
 * ==========================================
 * Change Worker Status
 * ==========================================
 */
const changeWorkerStatus =
  asyncHandler(async (req, res) => {
    const worker =
      await workerService.changeStatus(
        req.params.id,
        req.body.status
      );

    return ApiResponse.success(
      res,
      worker,
      'Worker status updated successfully.'
    );
  });

/**
 * ==========================================
 * Delete Worker
 * ==========================================
 */
const deleteWorker = asyncHandler(
  async (req, res) => {
    const result =
      await workerService.deleteWorker(
        req.params.id
      );

    return ApiResponse.success(
      res,
      result,
      'Worker deleted successfully.'
    );
  }
);

export default {
  createWorker,
  getWorkers,
  getWorkerById,
  updateWorker,
  changeWorkerStatus,
  deleteWorker,
};