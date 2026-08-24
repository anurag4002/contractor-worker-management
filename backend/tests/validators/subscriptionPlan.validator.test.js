import { jest } from '@jest/globals';

import {
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema,
  getSubscriptionPlansQuerySchema,
} from '../../src/validators/subscriptionPlan.validator.js';

describe('Subscription Plan Validator', () => {
  describe('createSubscriptionPlanSchema', () => {
    it('should validate a valid Contractor Pro plan', () => {
      const validPlan = {
        name: 'Contractor Pro',
        code: 'CONTRACTOR_PRO',
        description: 'Complete workforce management solution',
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
      };

      const { error } = createSubscriptionPlanSchema.validate(validPlan, {
        abortEarly: false,
      });

      expect(error).toBeUndefined();
    });

    it('should validate valid monthly price 2499', () => {
      const plan = {
        name: 'Contractor Pro',
        code: 'CONTRACTOR_PRO',
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeUndefined();
    });

    it('should validate valid annual price 24999', () => {
      const plan = {
        name: 'Contractor Pro',
        code: 'CONTRACTOR_PRO',
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeUndefined();
    });

    it('should validate unlimited limits represented by null', () => {
      const plan = {
        name: 'Contractor Pro',
        code: 'CONTRACTOR_PRO',
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
        limits: {
          maxWorkers: null,
          maxSites: null,
          maxAdmins: null,
        },
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeUndefined();
    });

    it('should validate feature flags array', () => {
      const plan = {
        name: 'Contractor Pro',
        code: 'CONTRACTOR_PRO',
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
        features: ['Attendance', 'Payroll', 'Reports'],
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeUndefined();
    });

    it('should fail with invalid string values', () => {
      const plan = {
        name: 123,
        code: 'CONTRACTOR_PRO',
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
      expect(error.details.some((detail) => detail.path[0] === 'name')).toBe(true);
    });

    it('should fail with invalid price values (negative)', () => {
      const plan = {
        name: 'Contractor Pro',
        code: 'CONTRACTOR_PRO',
        pricing: {
          monthly: -100,
          annual: 24999,
        },
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
      expect(error.details.some((detail) => detail.path.includes('monthly'))).toBe(true);
    });

    it('should fail with invalid negative values for limits', () => {
      const plan = {
        name: 'Contractor Pro',
        code: 'CONTRACTOR_PRO',
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
        limits: {
          maxWorkers: -10,
        },
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
    });

    it('should fail with invalid plan name (too short)', () => {
      const plan = {
        name: 'A',
        code: 'CONTRACTOR_PRO',
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
      expect(error.details.some((detail) => detail.path[0] === 'name')).toBe(true);
    });

    it('should fail with invalid code length (too short)', () => {
      const plan = {
        name: 'Contractor Pro',
        code: 'AB',
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
      expect(error.details.some((detail) => detail.path[0] === 'code')).toBe(true);
    });

    it('should fail with invalid code length (too long)', () => {
      const plan = {
        name: 'Contractor Pro',
        code: 'A'.repeat(51),
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
      expect(error.details.some((detail) => detail.path[0] === 'code')).toBe(true);
    });

    it('should fail with invalid currency length', () => {
      const plan = {
        name: 'Contractor Pro',
        code: 'CONTRACTOR_PRO',
        pricing: {
          monthly: 2499,
          annual: 24999,
        },
        currency: 'IN',
      };

      const { error } = createSubscriptionPlanSchema.validate(plan, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
      expect(error.details.some((detail) => detail.path[0] === 'currency')).toBe(true);
    });

    it('should fail with missing required fields', () => {
      const { error } = createSubscriptionPlanSchema.validate({}, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
      expect(error.details.length).toBeGreaterThan(0);
    });
  });

  describe('updateSubscriptionPlanSchema', () => {
    it('should validate partial update with at least one field', () => {
      const update = {
        name: 'Contractor Pro Updated',
      };

      const { error } = updateSubscriptionPlanSchema.validate(update, {
        abortEarly: false,
      });

      expect(error).toBeUndefined();
    });

    it('should fail when no fields are provided', () => {
      const { error } = updateSubscriptionPlanSchema.validate({}, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('At least one field is required');
    });

    it('should validate valid code update', () => {
      const update = {
        code: 'NEW_CODE',
      };

      const { error } = updateSubscriptionPlanSchema.validate(update, {
        abortEarly: false,
      });

      expect(error).toBeUndefined();
    });
  });

  describe('getSubscriptionPlansQuerySchema', () => {
    it('should validate default query parameters', () => {
      const query = {};

      const { error, value } = getSubscriptionPlansQuerySchema.validate(query, {
        abortEarly: false,
        allowUnknown: true,
      });

      expect(error).toBeUndefined();
      expect(value.page).toBe(1);
      expect(value.limit).toBe(10);
      expect(value.sortBy).toBe('createdAt');
      expect(value.sortOrder).toBe('desc');
    });

    it('should validate custom query parameters', () => {
      const query = {
        page: 2,
        limit: 20,
        search: 'Contractor',
        status: 'ACTIVE',
        sortBy: 'name',
        sortOrder: 'asc',
      };

      const { error } = getSubscriptionPlansQuerySchema.validate(query, {
        abortEarly: false,
      });

      expect(error).toBeUndefined();
    });

    it('should fail with invalid sortBy', () => {
      const query = {
        sortBy: 'invalid_field',
      };

      const { error } = getSubscriptionPlansQuerySchema.validate(query, {
        abortEarly: false,
      });

      expect(error).toBeDefined();
    });
  });
});
