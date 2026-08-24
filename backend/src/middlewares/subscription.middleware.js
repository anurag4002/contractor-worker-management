import { StatusCodes } from 'http-status-codes';

import subscriptionService from '../services/subscription.service.js';

import ApiError from '../common/errors/ApiError.js';

import SUBSCRIPTION_MESSAGES from '../common/constants/subscription.messages.js';

import { isSuperAdmin } from '../common/utils/tenant.util.js';

const requireActiveSubscription = async (req, res, next) => {
  try {
    if (isSuperAdmin(req)) {
      return next();
    }

    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Tenant context is required.'));
    }

    const isActive = await subscriptionService.isSubscriptionActive(tenantId);

    if (!isActive) {
      return next(new ApiError(StatusCodes.FORBIDDEN, SUBSCRIPTION_MESSAGES.SUBSCRIPTION_EXPIRED));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default requireActiveSubscription;
