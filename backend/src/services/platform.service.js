import { StatusCodes } from 'http-status-codes';

import platformRepository from '../repositories/platform.repository.js';

import ApiError from '../common/errors/ApiError.js';

class PlatformService {
  async getPlatformDashboard() {
    const stats = await platformRepository.getDashboardStats();

    return stats;
  }

  async getTenants(query) {
    const result = await platformRepository.getTenants(query);

    return result;
  }

  async getTenantDetails(tenantId) {
    const data = await platformRepository.getTenantById(tenantId);

    if (!data) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Tenant not found.'
      );
    }

    return data;
  }

  async getTenantSubscription(tenantId) {
    const subscription = await platformRepository.getTenantSubscription(tenantId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Subscription not found for this tenant.'
      );
    }

    return subscription;
  }
}

export default new PlatformService();
