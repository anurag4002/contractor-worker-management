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
      req.user.userId
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
    await siteService.getSites(req.query);

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
        req.params.id
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
        req.user.userId
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
        req.body.status
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
        req.params.id
      );

    return ApiResponse.success(
      res,
      result,
      'Site deleted successfully.'
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
};