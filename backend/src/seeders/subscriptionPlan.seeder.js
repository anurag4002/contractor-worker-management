import logger from '../common/logger/logger.js';

import SubscriptionPlan from '../models/SubscriptionPlan.js';

const seedSubscriptionPlans = async () => {
  logger.info('Seeding subscription plans...');

  const contractorProPlan = {
    name: 'Contractor Pro',
    code: 'CONTRACTOR_PRO',
    description: 'Complete workforce management solution for contractors with unlimited access.',
    pricing: {
      monthly: 2499,
      annual: 24999,
    },
    currency: 'INR',
    features: [
      'Unlimited Workers',
      'Unlimited Sites',
      'Unlimited Admins',
      'Attendance',
      'Payroll',
      'Reports',
      'Advanced Reports',
      'Priority Support',
    ],
    limits: {
      maxWorkers: null,
      maxSites: null,
      maxAdmins: null,
    },
    status: 'ACTIVE',
    isDeleted: false,
  };

  await SubscriptionPlan.findOneAndUpdate(
    { code: 'CONTRACTOR_PRO' },
    contractorProPlan,
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    }
  );

  logger.info('Subscription plan seeded successfully.');
};

export default seedSubscriptionPlans;
