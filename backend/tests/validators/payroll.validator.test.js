import { updatePayrollSchema } from '../../src/validators/payroll.validator.js';

describe('Payroll Validator - updatePayrollSchema', () => {
  it('should allow a valid partial update with at least one field', () => {
    const update = {
      bonus: 100,
    };

    const { error } = updatePayrollSchema.validate(update, {
      abortEarly: false,
    });

    expect(error).toBeUndefined();
  });

  it('should allow a valid full update payload', () => {
    const update = {
      dailyWage: 800,
      overtimeRate: 100,
      bonus: 0,
      deduction: 0,
      advanceDeduction: 0,
      remarks: 'updated',
    };

    const { error } = updatePayrollSchema.validate(update, {
      abortEarly: false,
    });

    expect(error).toBeUndefined();
  });

  it('should fail when no fields are provided', () => {
    const { error } = updatePayrollSchema.validate({}, {
      abortEarly: false,
    });

    expect(error).toBeDefined();
    expect(error.details.length).toBeGreaterThan(0);
  });

  it('should fail with negative dailyWage', () => {
    const { error } = updatePayrollSchema.validate({ dailyWage: -100 }, {
      abortEarly: false,
    });

    expect(error).toBeDefined();
    expect(error.details.some((detail) => detail.path[0] === 'dailyWage')).toBe(true);
  });

  it('should fail with negative overtimeRate', () => {
    const { error } = updatePayrollSchema.validate({ overtimeRate: -1 }, {
      abortEarly: false,
    });

    expect(error).toBeDefined();
    expect(error.details.some((detail) => detail.path[0] === 'overtimeRate')).toBe(true);
  });

  it('should fail with negative bonus', () => {
    const { error } = updatePayrollSchema.validate({ bonus: -50 }, {
      abortEarly: false,
    });

    expect(error).toBeDefined();
    expect(error.details.some((detail) => detail.path[0] === 'bonus')).toBe(true);
  });

  it('should fail with negative deduction', () => {
    const { error } = updatePayrollSchema.validate({ deduction: -25 }, {
      abortEarly: false,
    });

    expect(error).toBeDefined();
    expect(error.details.some((detail) => detail.path[0] === 'deduction')).toBe(true);
  });

  it('should fail with negative advanceDeduction', () => {
    const { error } = updatePayrollSchema.validate({ advanceDeduction: -25 }, {
      abortEarly: false,
    });

    expect(error).toBeDefined();
    expect(error.details.some((detail) => detail.path[0] === 'advanceDeduction')).toBe(true);
  });

  it('should allow empty remarks string', () => {
    const { error } = updatePayrollSchema.validate(
      { remarks: '' },
      { abortEarly: false }
    );

    expect(error).toBeUndefined();
  });

  it('should fail with remarks longer than 500 characters', () => {
    const { error } = updatePayrollSchema.validate(
      { remarks: 'a'.repeat(501) },
      { abortEarly: false }
    );

    expect(error).toBeDefined();
    expect(error.details.some((detail) => detail.path[0] === 'remarks')).toBe(true);
  });
});
