import { jest } from '@jest/globals';

/*
|--------------------------------------------------------------------------
| Mock module registry for payroll salary payment regression tests
|--------------------------------------------------------------------------
| The PayrollService imports repository singletons directly. With the
| current Jest ESM setup (`transform: {}`) `jest.mock` is not hoisted, so
| the native ESM API (`jest.unstable_mockModule`) is used with dynamic
| `import()` of the service under test.
|--------------------------------------------------------------------------
*/

jest.unstable_mockModule('mongoose', () => {
    const session = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
    };

    const mongooseMock = {
        startSession: jest.fn().mockResolvedValue(session),
        connect: jest.fn(),
        disconnect: jest.fn(),
        connection: {
            readyState: 1,
        },
    };

    return {
        __esModule: true,
        default: mongooseMock,
    };
});

jest.unstable_mockModule('../../src/repositories/payroll.repository.js', () => {
    return {
        __esModule: true,
        default: {
            findById: jest.fn(),
            findByWorkerAndMonth: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
            getSummary: jest.fn(),
            findWorkerPayrolls: jest.fn(),
            softDelete: jest.fn(),
            changeStatus: jest.fn(),
        },
    };
});

jest.unstable_mockModule('../../src/repositories/payment.repository.js', () => {
    return {
        __esModule: true,
        default: {
            create: jest.fn(),
            findByPayroll: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
        },
    };
});

jest.unstable_mockModule('../../src/repositories/worker.repository.js', () => {
    return {
        __esModule: true,
        default: {
            findById: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
        },
    };
});

jest.unstable_mockModule('../../src/repositories/attendance.repository.js', () => {
    return {
        __esModule: true,
        default: {
            create: jest.fn(),
            findById: jest.fn(),
            findByWorkerAndDate: jest.fn(),
            findByWorkerAndMonth: jest.fn(),
            findByMonthAndYear: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
            findWorkerHistory: jest.fn(),
            getSummary: jest.fn(),
            update: jest.fn(),
            changeStatus: jest.fn(),
            softDelete: jest.fn(),
        },
    };
});

jest.unstable_mockModule('../../src/repositories/site.repository.js', () => {
    return {
        __esModule: true,
        default: {
            findActiveById: jest.fn(),
            findAll: jest.fn(),
        },
    };
});

let payrollService;
let payrollRepository;
let paymentRepository;
let workerRepository;

let testState = null;

beforeAll(async () => {
    const payrollModule = await import('../../src/services/payroll.service.js');
    payrollService = payrollModule.default;
    payrollRepository = (await import('../../src/repositories/payroll.repository.js')).default;
    paymentRepository = (await import('../../src/repositories/payment.repository.js')).default;
    workerRepository = (await import('../../src/repositories/worker.repository.js')).default;
});

const tenantId = '507f1f77bcf86cd799439001';
const workerId = '507f1f77bcf86cd799439002';
const payrollId = '507f1f77bcf86cd799439003';
const siteId = '507f1f77bcf86cd799439004';
const updatedBy = '507f1f77bcf86cd799439005';

const buildPayroll = (overrides = {}) => ({
    _id: payrollId,
    tenant: tenantId,
    worker: { _id: workerId },
    site: { _id: siteId },
    attendanceMonth: 10,
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
    grossSalary: 17000,
    netSalary: 17000,
    paid: 0,
    status: 'GENERATED',
    remarks: '',
    isDeleted: false,
    createdBy: updatedBy,
    updatedBy: null,
    ...overrides,
});

beforeEach(() => {
    testState = {
        payroll: buildPayroll(),
    };

    payrollRepository.findById.mockReset();
    payrollRepository.findByWorkerAndMonth.mockReset();
    payrollRepository.update.mockReset();
    payrollRepository.create.mockReset();
    paymentRepository.create.mockReset();
    workerRepository.findById.mockReset();

    jest.clearAllMocks();

    payrollRepository.findById.mockImplementation(
        async () => testState.payroll
    );
    paymentRepository.create.mockResolvedValue({
        _id: '507f1f77bcf86cd799439006',
        payroll: payrollId,
        worker: workerId,
        site: siteId,
        amount: 0,
        paymentType: 'PARTIAL',
        paymentMethod: 'CASH',
        transactionId: '',
        remark: '',
        status: 'COMPLETED',
        tenant: tenantId,
        createdBy: updatedBy,
    });
    payrollRepository.update.mockImplementation(
        async (_id, data) => {
            testState.payroll = { ...testState.payroll, ...data };
            return testState.payroll;
        }
    );
});

describe('Payroll Service - processSalaryPayment()', () => {
    it('TP-001: records a ₹100 PARTIAL payment and keeps the remaining balance payable', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 1700;
        testState.payroll.netSalary = 1700;
        testState.payroll.paid = 0;
        testState.payroll.deduction = 0;
        testState.payroll.advanceDeduction = 0;

        const result = await payrollService.processSalaryPayment(
            payrollId,
            100,
            'PARTIAL',
            'CASH',
            '',
            '',
            updatedBy,
            tenantId
        );

        expect(paymentRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                payroll: payrollId,
                amount: 100,
                paymentType: 'PARTIAL',
                status: 'COMPLETED',
                tenant: tenantId,
            }),
            expect.anything()
        );

        expect(result.payroll.paid).toBe(100);
        expect(result.payroll.netSalary).toBe(1600);
        expect(result.payroll.status).toBe('GENERATED');
    });

    it('TP-002: settles a FULL payment equal to the outstanding balance and marks payroll PAID', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 1700;
        testState.payroll.netSalary = 1700;
        testState.payroll.paid = 0;

        const result = await payrollService.processSalaryPayment(
            payrollId,
            1700,
            'FULL',
            'UPI',
            'TXN-1',
            '',
            updatedBy,
            tenantId
        );

        expect(paymentRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                payroll: payrollId,
                amount: 1700,
                paymentType: 'FULL',
                status: 'COMPLETED',
                tenant: tenantId,
            }),
            expect.anything()
        );

        expect(result.payroll.paid).toBe(1700);
        expect(result.payroll.netSalary).toBe(0);
        expect(result.payroll.status).toBe('PAID');
    });

    it('TP-003: rejects a FULL payment that does not match the outstanding balance and does not mutate anything', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 1700;
        testState.payroll.netSalary = 1700;
        testState.payroll.paid = 0;

        await expect(
            payrollService.processSalaryPayment(
                payrollId,
                100,
                'FULL',
                'CASH',
                '',
                '',
                updatedBy,
                tenantId
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Full payment amount must exactly match the outstanding salary balance.',
        });

        expect(paymentRepository.create).not.toHaveBeenCalled();
        expect(payrollRepository.update).not.toHaveBeenCalled();
    });

    it('TP-004: rejects a PARTIAL payment that exceeds the outstanding balance', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 1700;
        testState.payroll.netSalary = 1700;
        testState.payroll.paid = 0;

        await expect(
            payrollService.processSalaryPayment(
                payrollId,
                1800,
                'PARTIAL',
                'CASH',
                '',
                '',
                updatedBy,
                tenantId
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Payment cannot exceed the remaining salary balance.',
        });

        expect(paymentRepository.create).not.toHaveBeenCalled();
        expect(payrollRepository.update).not.toHaveBeenCalled();
    });

    it('TP-005: accumulates multiple partial payments correctly', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 1700;
        testState.payroll.netSalary = 1700;
        testState.payroll.paid = 0;

        const first = await payrollService.processSalaryPayment(
            payrollId, 100, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
        );
        expect(first.payroll.paid).toBe(100);
        expect(first.payroll.netSalary).toBe(1600);
        expect(first.payroll.status).toBe('GENERATED');

        const second = await payrollService.processSalaryPayment(
            payrollId, 200, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
        );
        expect(second.payroll.paid).toBe(300);
        expect(second.payroll.netSalary).toBe(1400);
        expect(second.payroll.status).toBe('GENERATED');

        const third = await payrollService.processSalaryPayment(
            payrollId, 300, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
        );
        expect(third.payroll.paid).toBe(600);
        expect(third.payroll.netSalary).toBe(1100);
        expect(third.payroll.status).toBe('GENERATED');
    });

    it('TP-006: settles a partially paid salary with a FULL payment for the exact remaining balance', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 1700;
        testState.payroll.netSalary = 1600;
        testState.payroll.paid = 100;

        const second = await payrollService.processSalaryPayment(
            payrollId, 1600, 'FULL', 'CASH', '', '', updatedBy, tenantId
        );

        expect(paymentRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                payroll: payrollId,
                amount: 1600,
                paymentType: 'FULL',
                status: 'COMPLETED',
                tenant: tenantId,
            }),
            expect.anything()
        );

        expect(second.payroll.paid).toBe(1700);
        expect(second.payroll.netSalary).toBe(0);
        expect(second.payroll.status).toBe('PAID');
    });

    it('TP-007: does not subtract the advance deduction twice when recording a partial salary payment', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 1700;
        testState.payroll.netSalary = 1400;
        testState.payroll.paid = 200;
        testState.payroll.advanceDeduction = 100;

        const result = await payrollService.processSalaryPayment(
            payrollId, 100, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
        );

        expect(result.payroll.paid).toBe(300);
        expect(result.payroll.advanceDeduction).toBe(100);
        expect(result.payroll.netSalary).toBe(1300);
        expect(result.payroll.status).toBe('GENERATED');
    });

    it('TP-008: preserves cumulative paid history when recording an additional partial payment', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 1700;
        testState.payroll.netSalary = 1100;
        testState.payroll.paid = 600;

        const result = await payrollService.processSalaryPayment(
            payrollId, 300, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
        );

        expect(result.payroll.paid).toBe(900);
        expect(result.payroll.netSalary).toBe(800);
        expect(result.payroll.status).toBe('GENERATED');
    });

    it('TP-009: handles decimal currency amounts accurately', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 199.98;
        testState.payroll.netSalary = 199.98;
        testState.payroll.paid = 0;

        const partial = await payrollService.processSalaryPayment(
            payrollId, 0.02, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
        );

        expect(partial.payroll.paid).toBe(0.02);
        expect(partial.payroll.netSalary).toBe(199.96);
        expect(partial.payroll.status).toBe('GENERATED');

        const full = await payrollService.processSalaryPayment(
            payrollId, 199.96, 'FULL', 'CASH', '', '', updatedBy, tenantId
        );

        expect(full.payroll.paid).toBe(199.98);
        expect(full.payroll.netSalary).toBe(0);
        expect(full.payroll.status).toBe('PAID');
    });

    it('TP-010: rejects invalid amounts and already settled/cancelled payrolls', async () => {
        await expect(
            payrollService.processSalaryPayment(
                payrollId, 0, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Please enter a valid payment amount.',
        });

        testState.payroll.status = 'PAID';
        await expect(
            payrollService.processSalaryPayment(
                payrollId, 100, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Payroll has already been paid and cannot be modified.',
        });

        testState.payroll.status = 'CANCELLED';
        await expect(
            payrollService.processSalaryPayment(
                payrollId, 100, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Payroll has already been cancelled.',
        });
    });

    it('TP-011: rolls back the payment and payroll update together when the payroll update fails', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 1700;
        testState.payroll.netSalary = 1700;
        testState.payroll.paid = 0;

        payrollRepository.update.mockRejectedValue(new Error('Payroll update failed'));

        await expect(
            payrollService.processSalaryPayment(
                payrollId, 100, 'PARTIAL', 'CASH', '', '', updatedBy, tenantId
            )
        ).rejects.toThrow('Payroll update failed');

        const session = await (await import('mongoose')).default.startSession();
        expect(session.commitTransaction).not.toHaveBeenCalled();
        expect(session.abortTransaction).toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalled();
    });
});
