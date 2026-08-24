import siteService from '../services/site.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

/**
 * ==========================================
 * Create Site
 * ==========================================
 */
const createSite = asyncHandler(async (req, res) => {
  const site =
    await siteService.createSite(
      req.body,
      req.user.userId,
      req.user.tenantId
    );

  return ApiResponse.created(
    res,
    site,
    'Site created successfully.'
  );
});

/**
 * ==========================================
 * Get All Sites
 * ==========================================
 */
const getSites = asyncHandler(async (req, res) => {
  const result =
    await siteService.getSites(req.query, req.user.tenantId);

  return ApiResponse.paginated(
    res,
    result.sites,
    result.pagination,
    'Sites fetched successfully.'
  );
});

/**
 * ==========================================
 * Get Site By Id
 * ==========================================
 */
const getSiteById = asyncHandler(
  async (req, res) => {
    const site =
      await siteService.getSiteById(
        req.params.id,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      site,
      'Site fetched successfully.'
    );
  }
);

/**
 * ==========================================
 * Update Site
 * ==========================================
 */
const updateSite = asyncHandler(
  async (req, res) => {
    const site =
      await siteService.updateSite(
        req.params.id,
        req.body,
        req.user.userId,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      site,
      'Site updated successfully.'
    );
  }
);

/**
 * ==========================================
 * Change Site Status
 * ==========================================
 */
const changeSiteStatus =
  asyncHandler(async (req, res) => {
    const site =
      await siteService.changeStatus(
        req.params.id,
        req.body.status,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      site,
      'Site status updated successfully.'
    );
  });

/**
 * ==========================================
 * Delete Site
 * ==========================================
 */
const deleteSite = asyncHandler(
  async (req, res) => {
    const result =
      await siteService.deleteSite(
        req.params.id,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      result,
      'Site deleted successfully.'
    );
  }
);

/**
 * ==========================================
 * Assign Workers to Site
 * ==========================================
 */
const assignWorkers = asyncHandler(
  async (req, res) => {
    const result =
      await siteService.assignWorkers(
        req.params.id,
        req.body.workerIds,
        req.user.userId,
        req.user.tenantId
      );

    return ApiResponse.success(
      res,
      result,
      result.message
    );
  }
);

export default {
  createSite,
  getSites,
  getSiteById,
  updateSite,
  changeSiteStatus,
  deleteSite,
  assignWorkers,
};