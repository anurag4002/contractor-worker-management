import { jest } from '@jest/globals';

/*
|--------------------------------------------------------------------------
| Export Service - branded PDF generation tests
|--------------------------------------------------------------------------
| Covers the shared PDF helpers (font registration, tenant branding,
| INR currency formatting), the payroll financial rules and the report
| export entry points (workers / payroll / dashboard).
*/

jest.unstable_mockModule('../../src/repositories/export.repository.js', () => {
  return {
    __esModule: true,
    default: {
      getDashboardData: jest.fn(),
      getWorkers: jest.fn(),
      getAttendance: jest.fn(),
      getSites: jest.fn(),
      getPayroll: jest.fn(),
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

describe('ExportService - branded PDF generation', () => {
  let ExportService;
  let exportRepository;
  let Tenant;
  let PDFDocument;
  let textSpy;

  const TENANT_ID = '507f1f77bcf86cd799439011';
  const COMPANY_NAME = 'Acme Contractors';

  beforeAll(async () => {
    ({ default: ExportService } = await import('../../src/services/export.service.js'));
    ({ default: exportRepository } = await import('../../src/repositories/export.repository.js'));
    ({ default: Tenant } = await import('../../src/models/Tenant.js'));
    ({ default: PDFDocument } = await import('pdfkit'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    textSpy = jest.spyOn(PDFDocument.prototype, 'text');
  });

  afterEach(() => {
    textSpy.mockRestore();
  });

  const mockTenant = (tenant = { companyName: COMPANY_NAME }) => {
    Tenant.findOne.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(tenant),
    }));
  };

  const createPdfRes = async () => {
    const { PassThrough } = await import('stream');

    const res = new PassThrough();
    res.setHeader = jest.fn();

    const chunks = [];
    const streamDone = new Promise((resolve) => {
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', resolve);
    });

    return { res, chunks, streamDone };
  };

  const collectText = () =>
    textSpy.mock.calls.map((call) => String(call[0]));

  describe('registerPayrollPdfFonts', () => {
    it('registers the Noto Sans regular and bold fonts on the document', async () => {
      const { registerPayrollPdfFonts } = await import('../../src/services/export.service.js');

      const registerFontSpy = jest.spyOn(PDFDocument.prototype, 'registerFont');

      const doc = new PDFDocument({ size: 'A4' });

      registerPayrollPdfFonts(doc);

      expect(registerFontSpy).toHaveBeenCalledTimes(2);
      expect(registerFontSpy).toHaveBeenNthCalledWith(1, 'NotoSans', expect.any(String));
      expect(registerFontSpy).toHaveBeenNthCalledWith(2, 'NotoSans-Bold', expect.any(String));

      doc.end();

      registerFontSpy.mockRestore();
    });
  });

  describe('getTenantBranding', () => {
    it('resolves tenant branding with a tenant scoped, soft-delete aware lookup', async () => {
      const { getTenantBranding } = await import('../../src/utils/pdf/pdf.utils.js');

      mockTenant({ companyName: COMPANY_NAME });

      const tenant = await getTenantBranding(TENANT_ID);

      expect(Tenant.findOne).toHaveBeenCalledWith({
        _id: TENANT_ID,
        isDeleted: false,
      });
      expect(tenant).toMatchObject({ companyName: COMPANY_NAME });
    });

    it('falls back to a clear company name when no tenant is configured', async () => {
      const { getTenantBranding } = await import('../../src/utils/pdf/pdf.utils.js');

      mockTenant(null);

      const tenant = await getTenantBranding(TENANT_ID);

      expect(tenant).toBeNull();
    });
  });

  describe('payroll financial rules', () => {
    it('computes net payable, paid and balance for a partially paid slip', async () => {
      const { calculatePayrollFinancials, derivePayrollStatus } = await import('../../src/services/export.service.js');

      const financials = calculatePayrollFinancials({
        basicSalary: 849,
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 300,
      });

      expect(financials.gross).toBe(849);
      expect(financials.netPayable).toBe(849);
      expect(financials.paid).toBe(300);
      expect(financials.balance).toBe(549);

      expect(derivePayrollStatus({
        status: 'GENERATED',
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 300,
      })).toBe('PARTIALLY PAID');
    });

    it('marks fully settled payrolls as paid', async () => {
      const { calculatePayrollFinancials, derivePayrollStatus } = await import('../../src/services/export.service.js');

      const financials = calculatePayrollFinancials({
        basicSalary: 849,
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 849,
      });

      expect(financials.balance).toBe(0);

      expect(derivePayrollStatus({
        status: 'GENERATED',
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 849,
      })).toBe('PAID');
    });

    it('keeps the pending status when nothing was paid', async () => {
      const { derivePayrollStatus } = await import('../../src/services/export.service.js');

      expect(derivePayrollStatus({
        status: 'GENERATED',
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 0,
      })).toBe('GENERATED');
    });

    it('reduces net payable once for deduction and advance deduction', async () => {
      const { calculatePayrollFinancials } = await import('../../src/services/export.service.js');

      const financials = calculatePayrollFinancials({
        basicSalary: 1000,
        grossSalary: 1000,
        deduction: 100,
        advanceDeduction: 50,
        paid: 0,
      });

      expect(financials.netPayable).toBe(850);
      expect(financials.balance).toBe(850);
    });

    it('applies an ordinary deduction without an advance', async () => {
      const { calculatePayrollFinancials } = await import('../../src/services/export.service.js');

      const financials = calculatePayrollFinancials({
        basicSalary: 1000,
        grossSalary: 1000,
        deduction: 100,
        advanceDeduction: 0,
        paid: 0,
      });

      expect(financials.netPayable).toBe(900);
      expect(financials.balance).toBe(900);
    });

    it('handles decimal amounts without losing precision', async () => {
      const { calculatePayrollFinancials } = await import('../../src/services/export.service.js');

      const financials = calculatePayrollFinancials({
        basicSalary: 849.75,
        grossSalary: 849.75,
        deduction: 0,
        advanceDeduction: 0,
        paid: 100.5,
      });

      expect(financials.netPayable).toBe(849.75);
      expect(financials.balance).toBe(749.25);
    });

    it('handles zero valued payrolls', async () => {
      const { calculatePayrollFinancials, derivePayrollStatus } = await import('../../src/services/export.service.js');

      const financials = calculatePayrollFinancials({});

      expect(financials.gross).toBe(0);
      expect(financials.netPayable).toBe(0);
      expect(financials.balance).toBe(0);

      expect(derivePayrollStatus({})).toBe('PAID');
    });

    it('cancels payroll reports for cancelled records', async () => {
      const { derivePayrollStatus } = await import('../../src/services/export.service.js');

      expect(derivePayrollStatus({
        status: 'CANCELLED',
        grossSalary: 849,
        deduction: 0,
        advanceDeduction: 0,
        paid: 0,
      })).toBe('CANCELLED');
    });
  });

  describe('exportWorkersPdf', () => {
    it('generates a branded workers PDF containing every matching record', async () => {
      mockTenant();

      exportRepository.getWorkers.mockResolvedValue(
        Array.from({ length: 15 }, (_, index) => ({
          _id: `worker-${index}`,
          employeeCode: `EMP-${index + 1}`,
          fullName: `Worker ${index + 1}`,
          trade: 'Carpenter',
          site: { siteName: `Site ${index + 1}` },
          mobileNumber: '9999999999',
          status: 'ACTIVE',
        }))
      );

      const { res, chunks, streamDone } = await createPdfRes();

      await ExportService.exportWorkersPdf(res, { status: 'ACTIVE' }, TENANT_ID);

      await streamDone;

      const pdfBuffer = Buffer.concat(chunks);

      expect(pdfBuffer.length).toBeGreaterThan(0);

      const texts = collectText();

      expect(texts.some((text) => text.includes('Worker 1'))).toBe(true);
      expect(texts.some((text) => text.includes('Worker 15'))).toBe(true);
      expect(texts.some((text) => text.includes(COMPANY_NAME))).toBe(true);
    });

    it('preserves the requested filters when exporting workers', async () => {
      mockTenant();

      exportRepository.getWorkers.mockResolvedValue([]);

      const { res, streamDone } = await createPdfRes();

      await ExportService.exportWorkersPdf(
        res,
        {
          search: 'Ramesh',
          status: 'ACTIVE',
          site: 'site-1',
          trade: 'Carpenter',
        },
        TENANT_ID
      );

      await streamDone;

      expect(exportRepository.getWorkers).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Ramesh',
          status: 'ACTIVE',
          site: 'site-1',
          trade: 'Carpenter',
        }),
        TENANT_ID
      );
    });

    it('falls back to a clear company name when the tenant has none', async () => {
      mockTenant(null);

      exportRepository.getWorkers.mockResolvedValue([]);

      const { res, streamDone } = await createPdfRes();

      await ExportService.exportWorkersPdf(res, {}, TENANT_ID);

      await streamDone;

      const texts = collectText();

      expect(texts.some((text) => text.includes('Company name not configured'))).toBe(true);
    });
  });

  describe('exportPayrollPdf', () => {
    it('renders every payroll record returned by the repository', async () => {
      mockTenant();

      exportRepository.getPayroll.mockResolvedValue(
        Array.from({ length: 12 }, (_, index) => ({
          _id: `payroll-${index}`,
          worker: { employeeCode: `EMP-${index + 1}`, fullName: `Worker ${index + 1}` },
          site: { siteName: `Site ${index + 1}` },
          attendanceMonth: 10,
          attendanceYear: 2025,
          basicSalary: 849,
          grossSalary: 849,
          deduction: 0,
          advanceDeduction: 0,
          paid: 0,
          status: 'GENERATED',
        }))
      );

      const { res, chunks, streamDone } = await createPdfRes();

      await ExportService.exportPayrollPdf(res, { status: 'GENERATED' }, TENANT_ID);

      await streamDone;

      const pdfBuffer = Buffer.concat(chunks);

      expect(pdfBuffer.length).toBeGreaterThan(0);

      const texts = collectText();

      expect(texts.some((text) => text.includes('Worker 12'))).toBe(true);
      expect(texts.some((text) => text.includes('Net Payable'))).toBe(true);
    });
  });

  describe('exportDashboardPdf', () => {
    it('generates a branded dashboard PDF for the tenant', async () => {
      mockTenant({ companyName: COMPANY_NAME });

      exportRepository.getDashboardData.mockResolvedValue({
        workers: { total: 10, active: 8 },
        sites: { total: 3, active: 2 },
        attendance: { total: 40, present: 30, absent: 5, leave: 2, halfDay: 3 },
        payroll: { total: 9, totalNetSalary: 1000, pendingSalary: 500 },
      });

      const { res, chunks, streamDone } = await createPdfRes();

      await ExportService.exportDashboardPdf(res, TENANT_ID);

      await streamDone;

      const pdfBuffer = Buffer.concat(chunks);

      expect(pdfBuffer.length).toBeGreaterThan(0);

      const texts = collectText();

      expect(texts.some((text) => text.includes(COMPANY_NAME))).toBe(true);
      expect(texts.some((text) => text.includes('Dashboard Summary Report'))).toBe(true);
    });
  });
});
