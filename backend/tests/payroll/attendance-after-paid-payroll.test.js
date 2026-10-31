import { jest } from '@jest/globals';

/*
|--------------------------------------------------------------------------
| Mock module registry for attendance <-> payroll regression tests
|--------------------------------------------------------------------------
| The services under test (AttendanceService + PayrollService) import
| repository singletons directly. With the current Jest ESM setup
| (`transform: {}`) `jest.mock` is not hoisted, so the native ESM APIs
| (`jest.unstable_mockModule`) are used with dynamic `import()` of the
| services under test.
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
let attendanceService;

let payrollRepository;
let paymentRepository;
let attendanceRepository;
let workerRepository;
let siteRepository;

let testState = null;

beforeAll(async () => {
    const payrollModule = await import('../../src/services/payroll.service.js');
    const attendanceModule = await import('../../src/services/attendance.service.js');

    payrollService = payrollModule.default;
    attendanceService = attendanceModule.default;

    payrollRepository = (await import('../../src/repositories/payroll.repository.js')).default;
    paymentRepository = (await import('../../src/repositories/payment.repository.js')).default;
    attendanceRepository = (await import('../../src/repositories/attendance.repository.js')).default;
    workerRepository = (await import('../../src/repositories/worker.repository.js')).default;
    siteRepository = (await import('../../src/repositories/site.repository.js')).default;
});

const tenantId = '507f1f77bcf86cd799439001';
const otherTenantId = '507f1f77bcf86cd799439005';
const workerId = '507f1f77bcf86cd799439002';
const payrollId = '507f1f77bcf86cd799439003';
const siteId = '507f1f77bcf86cd799439004';
const attendanceId = '507f1f77bcf86cd799439009';
const updatedBy = '507f1f77bcf86cd799439004';
const createdBy = '507f1f77bcf86cd799439007';

const PAID_ERROR_MESSAGE =
    'Payroll is already paid. Attendance changes cannot be recalculated automatically. Please raise an adjustment.';

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

const buildPayroll = (overrides = {}) => ({
    _id: payrollId,
    tenant: tenantId,
    worker: { _id: workerId },
    site: { _id: siteId },
    attendanceMonth: 10,
    attendanceYear: 2026,
    workingDays: 2,
    presentDays: 2,
    halfDays: 0,
    absentDays: 0,
    leaveDays: 0,
    regularHours: 16,
    overtimeHours: 0,
    dailyWage: 800,
    overtimeRate: 100,
    basicSalary: 1600,
    overtimeAmount: 0,
    bonus: 0,
    deduction: 0,
    advanceDeduction: 0,
    grossSalary: 1600,
    netSalary: 1600,
    paid: 1600,
    status: 'PAID',
    remarks: '',
    isDeleted: false,
    createdBy: updatedBy,
    updatedBy: null,
    ...overrides,
});

beforeEach(() => {
    testState = {
        payroll: buildPayroll(),
        attendance: [
            {
                _id: '507f1f77bcf86cd799439010',
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 28, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
                tenant: tenantId,
            },
            {
                _id: '507f1f77bcf86cd799439011',
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 29, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
                tenant: tenantId,
            },
        ],
    };

    payrollRepository.findById.mockReset();
    payrollRepository.findByWorkerAndMonth.mockReset();
    payrollRepository.update.mockReset();
    payrollRepository.create.mockReset();
    paymentRepository.create.mockReset();
    attendanceRepository.create.mockReset();
    attendanceRepository.findById.mockReset();
    attendanceRepository.findByWorkerAndDate.mockReset();
    attendanceRepository.findByWorkerAndMonth.mockReset();
    attendanceRepository.update.mockReset();
    attendanceRepository.changeStatus.mockReset();
    attendanceRepository.softDelete.mockReset();
    workerRepository.findById.mockReset();
    siteRepository.findActiveById.mockReset();

    payrollRepository.findById.mockResolvedValue(testState.payroll);
    payrollRepository.findByWorkerAndMonth.mockImplementation(
        async () => testState.payroll
    );

    payrollRepository.update.mockImplementation(
        async (_id, data) => {
            testState.payroll = { ...testState.payroll, ...data };
            return testState.payroll;
        }
    );

    attendanceRepository.findByWorkerAndMonth.mockImplementation(
        async () => testState.attendance || []
    );
});

describe('Payroll Service - recalculatePayroll()', () => {
    it('TP-101: allows recalculation for genuinely new attendance on a PAID payroll and reopens it for the additional balance', async () => {
        testState.payroll = {
            ...testState.payroll,
            status: 'PAID',
            presentDays: 2,
            basicSalary: 1600,
            grossSalary: 1600,
            netSalary: 1600,
            paid: 1600,
        };
        testState.attendance = [
            {
                _id: '507f1f77bcf86cd799439010',
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 28, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
            },
            {
                _id: '507f1f77bcf86cd799439011',
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 29, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
            },
            {
                _id: '507f1f77bcf86cd799439012',
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
            },
        ];

        const result = await payrollService.recalculatePayroll(
            10,
            2026,
            workerId,
            tenantId,
            updatedBy,
            null,
            { source: 'NEW_ATTENDANCE' }
        );

        expect(result.action).toBe('RECALCULATED');
        expect(result.payroll.status).toBe('GENERATED');
        expect(result.payroll.presentDays).toBe(3);
        expect(result.payroll.basicSalary).toBe(2400);
        expect(result.payroll.grossSalary).toBe(2400);
        expect(result.payroll.netSalary).toBe(2400);
        expect(result.payroll.paid).toBe(1600);
        expect(result.payroll.netSalary - result.payroll.paid).toBe(800);

        expect(payrollRepository.update).toHaveBeenCalledWith(
            payrollId,
            expect.objectContaining({
                status: 'GENERATED',
                grossSalary: 2400,
                netSalary: 2400,
                updatedBy,
            }),
            tenantId,
            null
        );
    });

    it('TP-102: keeps a previously paid payroll paid when newly added attendance creates no additional payable balance', async () => {
        testState.payroll = {
            ...testState.payroll,
            status: 'PAID',
            salaryType: 'MONTHLY',
            worker: { _id: workerId },
            presentDays: 22,
            halfDays: 0,
            basicSalary: 30000,
            grossSalary: 30000,
            netSalary: 30000,
            paid: 30000,
            overtimeHours: 0,
            overtimeAmount: 0,
        };
        testState.attendance = [
            {
                _id: '507f1f77bcf86cd799439010',
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 28, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
            },
        ];
        workerRepository.findById.mockResolvedValue(
            buildWorker({ salaryType: 'MONTHLY', monthlySalary: 30000, dailyWage: 800 })
        );

        const result = await payrollService.recalculatePayroll(
            10,
            2026,
            workerId,
            tenantId,
            updatedBy,
            null,
            { source: 'NEW_ATTENDANCE' }
        );

        expect(result.payroll.status).toBe('PAID');
        expect(result.payroll.basicSalary).toBe(30000);
        expect(result.payroll.grossSalary).toBe(30000);
        expect(result.payroll.netSalary).toBe(30000);
        expect(result.payroll.paid).toBe(30000);
    });

    it('TP-103: does not duplicate the monthly base salary for a MONTHLY worker and recalculates overtime', async () => {
        testState.payroll = {
            ...testState.payroll,
            status: 'PAID',
            salaryType: 'MONTHLY',
            worker: { _id: workerId },
            presentDays: 22,
            halfDays: 0,
            basicSalary: 30000,
            grossSalary: 30120,
            netSalary: 30120,
            paid: 30000,
            overtimeHours: 4,
            overtimeAmount: 400,
        };
        testState.attendance = [
            {
                _id: '507f1f77bcf86cd799439010',
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 28, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 4,
            },
        ];
        workerRepository.findById.mockResolvedValue(
            buildWorker({ salaryType: 'MONTHLY', monthlySalary: 30000, dailyWage: 800 })
        );

        const result = await payrollService.recalculatePayroll(
            10,
            2026,
            workerId,
            tenantId,
            updatedBy,
            null,
            { source: 'NEW_ATTENDANCE' }
        );

        expect(result.payroll.basicSalary).toBe(30000);
        expect(result.payroll.overtimeAmount).toBe(400);
        expect(result.payroll.grossSalary).toBe(30400);
        expect(result.payroll.netSalary).toBe(30400);
        expect(result.payroll.paid).toBe(30000);
        expect(result.payroll.netSalary - result.payroll.paid).toBe(400);
        expect(result.payroll.status).toBe('GENERATED');
    });

    it('TP-104: rejects recalculation for historical attendance mutations on a PAID payroll', async () => {
        testState.payroll = {
            ...testState.payroll,
            status: 'PAID',
        };

        await expect(
            payrollService.recalculatePayroll(
                10,
                2026,
                workerId,
                tenantId,
                updatedBy,
                null,
                { source: 'ATTENDANCE_MUTATION' }
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message: PAID_ERROR_MESSAGE,
        });

        expect(payrollRepository.update).not.toHaveBeenCalled();
    });

    it('TP-105: returns NO_RECORD action when no payroll exists', async () => {
        testState.payroll = null;

        const result = await payrollService.recalculatePayroll(
            10,
            2026,
            workerId,
            tenantId,
            updatedBy,
            null,
            { source: 'NEW_ATTENDANCE' }
        );

        expect(result).toEqual({
            payroll: null,
            action: 'NO_RECORD',
        });
    });

    it('TP-106: skips recalculation for a CANCELLED payroll', async () => {
        testState.payroll = {
            ...testState.payroll,
            status: 'CANCELLED',
        };

        const result = await payrollService.recalculatePayroll(
            10,
            2026,
            workerId,
            tenantId,
            updatedBy,
            null,
            { source: 'NEW_ATTENDANCE' }
        );

        expect(result.action).toBe('SKIPPED');
        expect(payrollRepository.update).not.toHaveBeenCalled();
    });

    it('TP-107: throws reconciliation error when recalculated salary is below the paid amount', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.presentDays = 22;
        testState.payroll.basicSalary = 1600;
        testState.payroll.grossSalary = 1600;
        testState.payroll.netSalary = 1100;
        testState.payroll.paid = 1600;
        testState.payroll.deduction = 500;

        await expect(
            payrollService.recalculatePayroll(
                10,
                2026,
                workerId,
                tenantId,
                updatedBy,
                null,
                { source: 'NEW_ATTENDANCE' }
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Corrected salary is less than the amount already paid. Please raise an adjustment.',
        });

        expect(payrollRepository.update).not.toHaveBeenCalled();
    });

    it('TP-108: keeps payroll recalculation tenant-scoped when new attendance is recorded', async () => {
        testState.payroll = {
            ...testState.payroll,
            status: 'PAID',
        };

        const result = await payrollService.recalculatePayroll(
            10,
            2026,
            workerId,
            otherTenantId,
            updatedBy,
            null,
            { source: 'NEW_ATTENDANCE' }
        );

        expect(result.action).toBe('RECALCULATED');
        expect(payrollRepository.findByWorkerAndMonth).toHaveBeenCalledWith(
            workerId,
            10,
            2026,
            otherTenantId
        );
    });
});

describe('Payroll Service - salary and advance payments after new attendance', () => {
    it('TP-201: settles the outstanding balance with a FULL payment and returns payroll to PAID', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 3200;
        testState.payroll.netSalary = 3200;
        testState.payroll.paid = 1600;

        const result = await payrollService.processSalaryPayment(
            payrollId,
            1600,
            'FULL',
            'CASH',
            '',
            '',
            updatedBy,
            tenantId
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

        expect(result.payroll.status).toBe('PAID');
        expect(result.payroll.paid).toBe(3200);
        expect(result.payroll.netSalary).toBe(0);
    });

    it('TP-202: records a PARTIAL payment and keeps the remaining balance payable', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 3200;
        testState.payroll.netSalary = 3200;
        testState.payroll.paid = 1600;

        const result = await payrollService.processSalaryPayment(
            payrollId,
            800,
            'PARTIAL',
            'UPI',
            'TXN-1',
            'partial settlement',
            updatedBy,
            tenantId
        );

        expect(paymentRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                payroll: payrollId,
                amount: 800,
                paymentType: 'PARTIAL',
                status: 'COMPLETED',
            }),
            expect.anything()
        );

        expect(result.payroll.status).toBe('GENERATED');
        expect(result.payroll.paid).toBe(2400);
        expect(result.payroll.netSalary).toBe(800);
    });

    it('TP-203: allows an advance against a reopened payroll with additional outstanding balance', async () => {
        testState.payroll.status = 'GENERATED';
        testState.payroll.grossSalary = 3200;
        testState.payroll.netSalary = 3200;
        testState.payroll.paid = 1600;
        testState.payroll.advanceDeduction = 0;

        const result = await payrollService.processAdvancePayment(
            payrollId,
            200,
            'CASH',
            'TXN-ADV',
            'advance for overtime',
            updatedBy,
            tenantId
        );

        expect(paymentRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                payroll: payrollId,
                amount: 200,
                paymentType: 'ADVANCE',
                status: 'COMPLETED',
            }),
            expect.anything()
        );

        expect(result.payroll.status).toBe('GENERATED');
        expect(result.payroll.advanceDeduction).toBe(200);
        // netSalary = gross - deduction - newAdvance - paid = 3200 - 0 - 200 - 1600
        expect(result.payroll.netSalary).toBe(1400);
    });
});

describe('Attendance Service - createAttendance flows', () => {
    it('AS-101: allows marking new attendance after the monthly payroll was fully paid', async () => {
        testState.payroll = {
            ...testState.payroll,
            status: 'PAID',
            presentDays: 2,
            basicSalary: 1600,
            grossSalary: 1600,
            netSalary: 1600,
            paid: 1600,
        };
        testState.attendance = [
            ...testState.attendance,
            {
                _id: '507f1f77bcf86cd799439012',
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
                tenant: tenantId,
            },
        ];

        workerRepository.findById.mockResolvedValue(buildWorker());
        siteRepository.findActiveById.mockResolvedValue({
            _id: siteId,
            siteCode: 'SITE01',
            siteName: 'Test Site',
            isDeleted: false,
        });
        attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);
        attendanceRepository.create.mockResolvedValue({
            _id: '507f1f77bcf86cd799439013',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
            status: 'PRESENT',
            regularHours: 8,
            overtimeHours: 0,
            tenant: tenantId,
        });
        attendanceRepository.findById.mockResolvedValue({
            _id: '507f1f77bcf86cd799439013',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
            status: 'PRESENT',
            regularHours: 8,
            overtimeHours: 0,
            tenant: tenantId,
        });

        const result = await attendanceService.createAttendance(
            {
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
            },
            createdBy,
            tenantId
        );

        expect(result._id).toBe('507f1f77bcf86cd799439013');
        expect(attendanceRepository.create).toHaveBeenCalled();
        // The paid payroll guard must not block genuinely new attendance;
        // instead the payroll is recalculated and reopened.
        expect(payrollRepository.update).toHaveBeenCalledWith(
            payrollId,
            expect.objectContaining({
                status: 'GENERATED',
            }),
            tenantId,
            expect.anything()
        );
    });

    it('AS-102: allows marking attendance when no payroll exists yet', async () => {
        testState.payroll = null;

        workerRepository.findById.mockResolvedValue(buildWorker());
        siteRepository.findActiveById.mockResolvedValue({
            _id: siteId,
            siteCode: 'SITE01',
            siteName: 'Test Site',
            isDeleted: false,
        });
        attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);
        attendanceRepository.create.mockResolvedValue({
            _id: '507f1f77bcf86cd799439014',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
            status: 'PRESENT',
            tenant: tenantId,
        });
        attendanceRepository.findById.mockResolvedValue({
            _id: '507f1f77bcf86cd799439014',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
            status: 'PRESENT',
            tenant: tenantId,
        });

        const result = await attendanceService.createAttendance(
            {
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
                status: 'PRESENT',
            },
            createdBy,
            tenantId
        );

        expect(result._id).toBe('507f1f77bcf86cd799439014');
        expect(attendanceRepository.create).toHaveBeenCalled();
        expect(payrollRepository.findByWorkerAndMonth).toHaveBeenCalledWith(
            workerId,
            10,
            2026,
            tenantId
        );
    });

    it('AS-103: rejects duplicate attendance for the same worker and date', async () => {
        workerRepository.findById.mockResolvedValue(buildWorker());
        siteRepository.findActiveById.mockResolvedValue({
            _id: siteId,
            siteCode: 'SITE01',
            siteName: 'Test Site',
            isDeleted: false,
        });
        attendanceRepository.findByWorkerAndDate.mockResolvedValue({
            _id: '507f1f77bcf86cd799439010',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 28, 9, 0, 0),
            status: 'PRESENT',
            tenant: tenantId,
        });

        await expect(
            attendanceService.createAttendance(
                {
                    worker: workerId,
                    site: siteId,
                    attendanceDate: new Date(2026, 9, 28, 9, 0, 0),
                    status: 'PRESENT',
                },
                createdBy,
                tenantId
            )
        ).rejects.toMatchObject({
            statusCode: 409,
            message: 'Attendance has already been marked for this worker on the selected date.',
        });

        expect(attendanceRepository.create).not.toHaveBeenCalled();
    });

    it('AS-104: scopes payroll recalculation to the attendance month and tenant', async () => {
        testState.payroll = null;

        workerRepository.findById.mockResolvedValue(buildWorker());
        siteRepository.findActiveById.mockResolvedValue({
            _id: siteId,
            siteCode: 'SITE01',
            siteName: 'Test Site',
            isDeleted: false,
        });
        attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);
        attendanceRepository.create.mockResolvedValue({
            _id: '507f1f77bcf86cd799439015',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 10, 1, 9, 0, 0),
            status: 'PRESENT',
            tenant: tenantId,
        });
        attendanceRepository.findById.mockResolvedValue({
            _id: '507f1f77bcf86cd799439015',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 10, 1, 9, 0, 0),
            status: 'PRESENT',
            tenant: tenantId,
        });

        await attendanceService.createAttendance(
            {
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 10, 1, 9, 0, 0),
                status: 'PRESENT',
            },
            createdBy,
            tenantId
        );

        expect(attendanceRepository.create).toHaveBeenCalled();
        expect(payrollRepository.findByWorkerAndMonth).toHaveBeenCalledWith(
            workerId,
            11,
            2026,
            tenantId
        );
    });

    it('AS-105: accumulates additional attendance earnings across multiple new attendance records', async () => {
        testState.payroll = {
            ...testState.payroll,
            status: 'PAID',
            presentDays: 2,
            basicSalary: 1600,
            grossSalary: 1600,
            netSalary: 1600,
            paid: 1600,
        };
        testState.attendance = [
            ...testState.attendance,
            {
                _id: '507f1f77bcf86cd799439012',
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
                tenant: tenantId,
            },
        ];

        workerRepository.findById.mockResolvedValue(buildWorker());
        siteRepository.findActiveById.mockResolvedValue({
            _id: siteId,
            siteCode: 'SITE01',
            siteName: 'Test Site',
            isDeleted: false,
        });
        attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);
        attendanceRepository.create.mockResolvedValue({
            _id: '507f1f77bcf86cd799439013',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
            status: 'PRESENT',
            regularHours: 8,
            overtimeHours: 0,
            tenant: tenantId,
        });
        attendanceRepository.findById.mockResolvedValue({
            _id: '507f1f77bcf86cd799439013',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
            status: 'PRESENT',
            regularHours: 8,
            overtimeHours: 0,
            tenant: tenantId,
        });

        await attendanceService.createAttendance(
            {
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 30, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
            },
            createdBy,
            tenantId
        );

        // Second new attendance day in the same month.
        testState.attendance.push({
            _id: '507f1f77bcf86cd799439016',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 31, 9, 0, 0),
            status: 'PRESENT',
            regularHours: 8,
            overtimeHours: 0,
            tenant: tenantId,
        });
        attendanceRepository.findByWorkerAndDate.mockResolvedValue(null);
        attendanceRepository.create.mockResolvedValue({
            _id: '507f1f77bcf86cd799439017',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 31, 9, 0, 0),
            status: 'PRESENT',
            regularHours: 8,
            overtimeHours: 0,
            tenant: tenantId,
        });
        attendanceRepository.findById.mockResolvedValue({
            _id: '507f1f77bcf86cd799439017',
            worker: workerId,
            site: siteId,
            attendanceDate: new Date(2026, 9, 31, 9, 0, 0),
            status: 'PRESENT',
            regularHours: 8,
            overtimeHours: 0,
            tenant: tenantId,
        });

        await attendanceService.createAttendance(
            {
                worker: workerId,
                site: siteId,
                attendanceDate: new Date(2026, 9, 31, 9, 0, 0),
                status: 'PRESENT',
                regularHours: 8,
                overtimeHours: 0,
            },
            createdBy,
            tenantId
        );

        // Earnings now cover all four eligible attendance days; previously
        // paid amount is never counted twice.
        expect(payrollRepository.update).toHaveBeenLastCalledWith(
            payrollId,
            expect.objectContaining({
                grossSalary: 3200,
                netSalary: 3200,
                status: 'GENERATED',
            }),
            tenantId,
            expect.anything()
        );
        expect(testState.payroll.paid).toBe(1600);
        expect(testState.payroll.netSalary - testState.payroll.paid).toBe(1600);
    });
});

describe('Attendance Service - historical mutations stay protected after paid payroll', () => {
    const settledAttendance = () => ({
        _id: attendanceId,
        worker: { _id: workerId },
        site: { _id: siteId },
        attendanceDate: new Date(2026, 9, 28, 9, 0, 0),
        status: 'PRESENT',
        regularHours: 8,
        overtimeHours: 0,
        tenant: tenantId,
    });

    beforeEach(() => {
        testState.payroll = {
            ...testState.payroll,
            status: 'PAID',
        };
    });

    it('AS-201: rejects updating attendance that was included in a paid payroll', async () => {
        attendanceRepository.findById.mockResolvedValue(settledAttendance());
        attendanceRepository.update.mockResolvedValue(settledAttendance());

        await expect(
            attendanceService.updateAttendance(
                attendanceId,
                { status: 'ABSENT' },
                updatedBy,
                tenantId
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message: PAID_ERROR_MESSAGE,
        });
    });

    it('AS-202: rejects deleting attendance that was included in a paid payroll', async () => {
        attendanceRepository.findById.mockResolvedValue(settledAttendance());
        attendanceRepository.softDelete.mockResolvedValue(settledAttendance());

        await expect(
            attendanceService.deleteAttendance(attendanceId, tenantId)
        ).rejects.toMatchObject({
            statusCode: 400,
            message: PAID_ERROR_MESSAGE,
        });
    });

    it('AS-203: rejects changing status of attendance that was included in a paid payroll', async () => {
        attendanceRepository.findById.mockResolvedValue(settledAttendance());
        attendanceRepository.changeStatus.mockResolvedValue(settledAttendance());

        await expect(
            attendanceService.changeStatus(attendanceId, 'ABSENT', tenantId)
        ).rejects.toMatchObject({
            statusCode: 400,
            message: PAID_ERROR_MESSAGE,
        });
    });
});
