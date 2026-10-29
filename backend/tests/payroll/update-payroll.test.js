import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';

import ApiError from '../../src/common/errors/ApiError.js';

/*
|--------------------------------------------------------------------------
| Mock repository singletons for PayrollService.updatePayroll()
|--------------------------------------------------------------------------
| PayrollService imports repository singletons directly and holds references
| to them. With Jest `transform: {}`, `jest.mock` is NOT hoisted, so we
| cannot rely on it. Instead we import the real repository singletons and
| overwrite their methods with jest.fn() in beforeEach. Importing the
| repository/service modules does NOT connect to MongoDB -- only calling
| model methods does -- so this stays DB-free.
|--------------------------------------------------------------------------
*/

import payrollRepository from '../../src/repositories/payroll.repository.js';
import workerRepository from '../../src/repositories/worker.repository.js';
import attendanceRepository from '../../src/repositories/attendance.repository.js';

let payrollService;

beforeAll(async () => {
  const serviceModule = await import('../../src/services/payroll.service.js');
  payrollService = serviceModule.default;
});

const tenantId = '507f1f77bcf86cd799439001';
const workerId = '507f1f77bcf86cd799439002';
const payrollId = '507f1f77bcf86cd799439003';
const updatedBy = '507f1f77bcf86cd799439004';

beforeEach(() => {
  // Return the data object passed to `update` so the service's calculated
  // fields (basicSalary, grossSalary, netSalary, ...) are observable.
  payrollRepository.update = jest.fn().mockImplementation(async (_id, data) => data);
  // Default: payroll not found. Individual tests override as needed.
  payrollRepository.findById = jest.fn().mockResolvedValue(null);
  payrollRepository.findByWorkerAndMonth = jest.fn().mockResolvedValue(null);
  workerRepository.findById = jest.fn().mockResolvedValue(null);
  attendanceRepository.findByWorkerAndMonth = jest.fn().mockResolvedValue([]);
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const buildPayroll = (overrides = {}) => ({
  _id: payrollId,
  tenant: tenantId,
  worker: workerId,
  site: '507f1f77bcf86cd799439005',
  attendanceMonth: 6,
  attendanceYear: 2026,
  workingDays: 22,
  presentDays: 22,
  halfDays: 0,
  absentDays: 0,
  leaveDays: 0,
  regularHours: 176,
  overtimeHours: 0,
  dailyWage: 800,
  overtimeRate: 100,
  basicSalary: 17600,
  overtimeAmount: 0,
  bonus: 0,
  deduction: 0,
  advanceDeduction: 0,
  grossSalary: 17600,
  netSalary: 17600,
  paid: 0,
  status: 'GENERATED',
  remarks: '',
  isDeleted: false,
  createdBy: updatedBy,
  updatedBy: null,
  ...overrides,
});

const buildWorker = (overrides = {}) => ({
  _id: workerId,
  tenant: tenantId,
  fullName: 'Test Worker',
  employeeCode: 'EMP001',
  trade: 'MASON',
  salaryType: 'DAILY',
  monthlySalary: 0,
  dailyWage: 800,
  status: 'ACTIVE',
  isDeleted: false,
  ...overrides,
});

/*
|--------------------------------------------------------------------------
| Service-level tests: payrollService.updatePayroll()
|--------------------------------------------------------------------------
| These tests exercise the calculation logic directly. They assert the
| CORRECT behavior (matching calculatePayrollFromAttendance). Against the
| current (unfixed) implementation, TP-002 and TP-003 are expected to fail
| because updatePayroll() ignores salaryType and halfDays.
|--------------------------------------------------------------------------
*/

describe('Payroll Service - updatePayroll()', () => {
  it('TP-001: preserves basicSalary when only remarks are updated (DAILY worker, no half days)', async () => {
    const payroll = buildPayroll({
      presentDays: 22,
      halfDays: 0,
      dailyWage: 800,
      basicSalary: 17600,
    });
    payrollRepository.findById.mockResolvedValue(payroll);

    const result = await payrollService.updatePayroll(
      payrollId,
      { remarks: 'updated note' },
      updatedBy,
      tenantId
    );

    // basicSalary = presentDays * dailyWage = 22 * 800 = 17600 (unchanged)
    expect(result.basicSalary).toBe(17600);
    expect(payrollRepository.update).toHaveBeenCalledWith(
      payrollId,
      expect.objectContaining({
        basicSalary: 17600,
        remarks: 'updated note',
      }),
      tenantId
    );
  });

  it('TP-002: includes half days in basicSalary for a DAILY worker', async () => {
    // DAILY worker: presentDays=20, halfDays=4, dailyWage=800
    // Correct basicSalary = 800 * (20 + 4/2) = 800 * 22 = 17600
    const payroll = buildPayroll({
      presentDays: 20,
      halfDays: 4,
      dailyWage: 800,
      basicSalary: 16000,
    });
    workerRepository.findById.mockResolvedValue(
      buildWorker({ salaryType: 'DAILY', monthlySalary: 0, dailyWage: 800 })
    );
    payrollRepository.findById.mockResolvedValue(payroll);

    const result = await payrollService.updatePayroll(
      payrollId,
      { bonus: 500 },
      updatedBy,
      tenantId
    );

    // Expected (correct): 17600 (half days included)
    // Current (defective): 16000 (20 * 800, half days dropped)
    expect(result.basicSalary).toBe(17600);
  });

  it('TP-003: uses monthlySalary for basicSalary for a MONTHLY worker', async () => {
    // MONTHLY worker: monthlySalary=30000, presentDays=22, dailyWage=800
    // Correct basicSalary = 30000 (monthlySalary)
    const payroll = buildPayroll({
      presentDays: 22,
      halfDays: 0,
      dailyWage: 800,
      basicSalary: 17600,
    });
    workerRepository.findById.mockResolvedValue(
      buildWorker({ salaryType: 'MONTHLY', monthlySalary: 30000, dailyWage: 800 })
    );
    payrollRepository.findById.mockResolvedValue(payroll);

    const result = await payrollService.updatePayroll(
      payrollId,
      { deduction: 1000 },
      updatedBy,
      tenantId
    );

    // Expected (correct): 30000 (monthlySalary)
    // Current (defective): 17600 (22 * 800, ignores monthlySalary)
    expect(result.basicSalary).toBe(30000);
  });

  it('TP-004: recalculates basicSalary when dailyWage is updated (DAILY worker, no half days)', async () => {
    const payroll = buildPayroll({
      presentDays: 22,
      halfDays: 0,
      dailyWage: 800,
      basicSalary: 17600,
    });
    payrollRepository.findById.mockResolvedValue(payroll);

    const result = await payrollService.updatePayroll(
      payrollId,
      { dailyWage: 900 },
      updatedBy,
      tenantId
    );

    // basicSalary = presentDays * newDailyWage = 22 * 900 = 19800
    expect(result.basicSalary).toBe(19800);
  });

  it('TP-005: rejects update when payroll status is PAID', async () => {
    const payroll = buildPayroll({ status: 'PAID' });
    payrollRepository.findById.mockResolvedValue(payroll);

    await expect(
      payrollService.updatePayroll(payrollId, { remarks: 'x' }, updatedBy, tenantId)
    ).rejects.toMatchObject({
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Payroll has already been paid and cannot be modified.',
    });
  });

  it('TP-006: rejects update when payroll status is CANCELLED', async () => {
    const payroll = buildPayroll({ status: 'CANCELLED' });
    payrollRepository.findById.mockResolvedValue(payroll);

    await expect(
      payrollService.updatePayroll(payrollId, { remarks: 'x' }, updatedBy, tenantId)
    ).rejects.toMatchObject({
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Payroll has already been cancelled.',
    });
  });

  it('TP-007: throws 404 when payroll does not exist', async () => {
    payrollRepository.findById.mockResolvedValue(null);

    await expect(
      payrollService.updatePayroll(payrollId, { remarks: 'x' }, updatedBy, tenantId)
    ).rejects.toMatchObject({
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Payroll record not found.',
    });
  });

  it('does not call update repository when payroll is not found', async () => {
    payrollRepository.findById.mockResolvedValue(null);

    await expect(
      payrollService.updatePayroll(payrollId, { remarks: 'x' }, updatedBy, tenantId)
    ).rejects.toBeInstanceOf(ApiError);

    expect(payrollRepository.update).not.toHaveBeenCalled();
  });

  it('TP-013: recalculatePayroll and updatePayroll produce consistent basicSalary for a MONTHLY worker', async () => {
    const payroll = buildPayroll({
      status: 'GENERATED',
      presentDays: 22,
      halfDays: 0,
      basicSalary: 17600,
      bonus: 0,
      deduction: 0,
      advanceDeduction: 0,
      overtimeHours: 0,
      paid: 0,
    });

    // updatePayroll path (fixed): resolves worker salary context and recalculates.
    payrollRepository.findById.mockResolvedValue(payroll);
    workerRepository.findById.mockResolvedValue(
      buildWorker({ salaryType: 'MONTHLY', monthlySalary: 30000, dailyWage: 800 })
    );

    const updatedResult = await payrollService.updatePayroll(
      payrollId,
      { bonus: 100 },
      updatedBy,
      tenantId
    );

    // MONTHLY worker: basicSalary must come from monthlySalary, not day-rate math.
    expect(updatedResult.basicSalary).toBe(30000);

    // recalculatePayroll path: same worker context via calculatePayrollFromAttendance.
    payrollRepository.findByWorkerAndMonth.mockResolvedValue(payroll);
    attendanceRepository.findByWorkerAndMonth.mockResolvedValue([
      { status: 'PRESENT', regularHours: 8, overtimeHours: 0 },
    ]);
    workerRepository.findById.mockResolvedValue(
      buildWorker({ salaryType: 'MONTHLY', monthlySalary: 30000, dailyWage: 800 })
    );

    const recalculated = await payrollService.recalculatePayroll(
      6,
      2026,
      workerId,
      tenantId,
      updatedBy
    );

    expect(recalculated.payroll.basicSalary).toBe(30000);
  });
});
