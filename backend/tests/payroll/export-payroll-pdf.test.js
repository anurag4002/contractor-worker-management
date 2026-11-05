import { jest } from '@jest/globals';

/*
|--------------------------------------------------------------------------
| Payroll Export PDF regression tests
|--------------------------------------------------------------------------
| Covers the financial breakdown (Net Payable / Paid / Balance), the derived
| report status and the shared rupee currency formatter used by the payroll
| export PDF redesign.
*/

jest.unstable_mockModule('../../src/repositories/export.repository.js', () => {
  return {
    __esModule: true,
    default: {
      getPayroll: jest.fn(),
      getWorkers: jest.fn(),
      getAttendance: jest.fn(),
      getSites: jest.fn(),
      getDashboardData: jest.fn(),
    },
  };
});

jest.unstable_mockModule('../../src/models/Tenant.js', () => {
  return {
    __esModule: true,
    default: {
      findOne: jest.fn(),
    },
  };
});

describe('ExportService - Payroll PDF', () => {
  let ExportService;
  let exportRepository;
  let Tenant;

  beforeAll(async () => {
    ({ default: ExportService } = await import('../../src/services/export.service.js'));
    ({ default: exportRepository } = await import('../../src/repositories/export.repository.js'));
    ({ default: Tenant } = await import('../../src/models/Tenant.js'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatCurrency', () => {
    it('formats rupee amounts with the Indian digit grouping', async () => {
      const { formatCurrency } = await import('../../src/services/export.service.js');

      expect(formatCurrency(849)).toBe('₹849');
      expect(formatCurrency(123456)).toBe('₹1,23,456');
      expect(formatCurrency(0)).toBe('₹0');
    });
  });

  describe('calculatePayrollFinancials', () => {
    it('computes net payable as gross minus deduction and advance', async () => {
      const { calculatePayrollFinancials } = await import('../../src/services/export.service.js');

      const result = calculatePayrollFinancials({
        basicSalary: 849,
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 0,
      });

      expect(result.basic).toBe(849);
      expect(result.gross).toBe(849);
      expect(result.netPayable).toBe(849);
      expect(result.paid).toBe(0);
      expect(result.balance).toBe(849);
    });

    it('uses persisted paid amount as the actual cash paid', async () => {
      const { calculatePayrollFinancials } = await import('../../src/services/export.service.js');

      const result = calculatePayrollFinancials({
        basicSalary: 849,
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 300,
      });

      expect(result.netPayable).toBe(849);
      expect(result.paid).toBe(300);
      expect(result.balance).toBe(549);
    });

    it('applies deduction and advance deduction exactly once', async () => {
      const { calculatePayrollFinancials } = await import('../../src/services/export.service.js');

      const result = calculatePayrollFinancials({
        basicSalary: 1000,
        grossSalary: 1000,
        deduction: 100,
        advanceDeduction: 50,
        paid: 0,
      });

      expect(result.netPayable).toBe(850);
      expect(result.balance).toBe(850);
    });
  });

  describe('derivePayrollStatus', () => {
    it('marks fully settled payrolls as paid', async () => {
      const { derivePayrollStatus } = await import('../../src/services/export.service.js');

      const status = derivePayrollStatus({
        status: 'GENERATED',
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 849,
      });

      expect(status).toBe('PAID');
    });

    it('marks partially paid payrolls correctly', async () => {
      const { derivePayrollStatus } = await import('../../src/services/export.service.js');

      const status = derivePayrollStatus({
        status: 'GENERATED',
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 300,
      });

      expect(status).toBe('PARTIALLY PAID');
    });

    it('preserves pending status when nothing was paid', async () => {
      const { derivePayrollStatus } = await import('../../src/services/export.service.js');

      const status = derivePayrollStatus({
        status: 'GENERATED',
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 0,
      });

      expect(status).toBe('GENERATED');
    });

    it('cancels payroll reports for cancelled records', async () => {
      const { derivePayrollStatus } = await import('../../src/services/export.service.js');

      const status = derivePayrollStatus({
        status: 'CANCELLED',
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 0,
      });

      expect(status).toBe('CANCELLED');
    });
  });

  describe('exportPayrollPdf', () => {
    it('generates a payroll PDF branded with the tenant company name', async () => {
      const tenantId = '507f1f77bcf86cd799439011';

      Tenant.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({
          companyName: 'Acme Contractors',
          address: '12 Park Street',
          city: 'Mumbai',
          district: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          email: 'finance@acmecontractors.com',
          mobileNumber: '9876543210',
        }),
      }));

      exportRepository.getPayroll.mockResolvedValue([
        {
          worker: { employeeCode: 'EMP-001', fullName: 'Ramesh Kumar' },
          site: { siteCode: 'SITE-01', siteName: 'Construction Site A' },
          attendanceMonth: 10,
          attendanceYear: 2025,
          basicSalary: 849,
          grossSalary: 849,
          deduction: 0,
          advanceDeduction: 0,
          paid: 300,
          status: 'GENERATED',
        },
      ]);

      const { PassThrough } = await import('stream');
      const res = new PassThrough();
      res.setHeader = jest.fn();

      const chunks = [];
      const streamDone = new Promise((resolve) => {
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', resolve);
      });

      await ExportService.exportPayrollPdf(res, { status: 'PAID' }, tenantId);

      await streamDone;
      const pdfBuffer = Buffer.concat(chunks);

      const fs = await import('fs');
      fs.writeFileSync('/tmp/opencode/payroll-report-sample.pdf', pdfBuffer);

      expect(Tenant.findOne).toHaveBeenCalledWith({
        _id: tenantId,
        isDeleted: false,
      });

      expect(exportRepository.getPayroll).toHaveBeenCalledWith({ status: 'PAID' }, tenantId);

      expect(pdfBuffer.length).toBeGreaterThan(0);
    });

    it('generates a payroll PDF for an empty result set', async () => {
      Tenant.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));
      exportRepository.getPayroll.mockResolvedValue([]);

      const { PassThrough } = await import('stream');
      const res = new PassThrough();
      res.setHeader = jest.fn();

      const chunks = [];
      const streamDone = new Promise((resolve) => {
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', resolve);
      });

      await ExportService.exportPayrollPdf(res, {}, 'tenant-2');

      await streamDone;
      const pdfBuffer = Buffer.concat(chunks);

      expect(pdfBuffer.length).toBeGreaterThan(0);
    });
  });
});
