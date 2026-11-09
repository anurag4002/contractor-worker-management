import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

import exportRepository from '../repositories/export.repository.js';

import {
    addPdfPage,
    formatCurrency,
    formatDateTime,
    getTenantBranding,
    PDF_BRANDING_COLOR,
    PDF_FONT_FAMILY,
    PDF_FONT_FAMILY_BOLD,
    PDF_REPORT_META_SIZE,
    PDF_SECTION_TITLE_SIZE,
    PDF_TABLE_HEADER_SIZE,
    PDF_TABLE_ROW_SIZE,
    renderPdfFooter,
    renderPdfHeader,
    registerPdfFonts,
} from '../utils/pdf/pdf.utils.js';

export { formatCurrency } from '../utils/pdf/pdf.utils.js';

export const registerPayrollPdfFonts = (doc) => registerPdfFonts(doc);

export const calculatePayrollFinancials = (payroll = {}) => {
    const grossSalary = Number(payroll?.grossSalary || 0);

    const deduction = Number(payroll?.deduction || 0);

    const advanceDeduction = Number(payroll?.advanceDeduction || 0);

    const paid = Number(payroll?.paid || 0);

    const netPayable = Math.max(
        0,
        grossSalary - deduction - advanceDeduction
    );

    const balance = Math.max(0, netPayable - paid);

    return {
        basic: Number(payroll?.basicSalary || 0),
        gross: grossSalary,
        netPayable,
        paid,
        balance,
    };
};

export const derivePayrollStatus = (payroll = {}) => {
    if (payroll?.status === 'CANCELLED') {
        return 'CANCELLED';
    }

    const { paid, balance } = calculatePayrollFinancials(payroll);

    if (balance <= 0) {
        return 'PAID';
    }

    if (paid > 0) {
        return 'PARTIALLY PAID';
    }

    return payroll?.status || 'PENDING';
};

class ExportService {
    /**
 * ==========================================
 * Export Dashboard Excel
 * ==========================================
 */
    async exportDashboardExcel(res, tenantId) {
        /**
         * ------------------------------------------
         * Fetch Dashboard Data
         * ------------------------------------------
         */
        const dashboard =
            await exportRepository.getDashboardData(tenantId);

        /**
         * ------------------------------------------
         * Create Workbook
         * ------------------------------------------
         */
        const workbook = new ExcelJS.Workbook();

        workbook.creator =
            'Contractor Worker Management';

        workbook.company =
            'Contractor Worker Management';

        workbook.created = new Date();

        workbook.modified = new Date();
        /**
       * ------------------------------------------
       * Create Worksheet
       * ------------------------------------------
       */
        const worksheet =
            workbook.addWorksheet(
                'Dashboard Report'
            );

        // Title
        worksheet.mergeCells('A1:C3');

        const titleCell =
            worksheet.getCell('A1');

        titleCell.value =
            'Dashboard Summary Report';

        titleCell.font = {
            bold: true,
            size: 18,
        };

        titleCell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
        };

        // Leave 3 rows for title
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);

        // Define Columns
        worksheet.columns = [
            {
                header: 'Category',
                key: 'category',
                width: 30,
            },
            {
                header: 'Metric',
                key: 'metric',
                width: 30,
            },
            {
                header: 'Value',
                key: 'value',
                width: 20,
            },
        ];
        /**
       * ------------------------------------------
       * Add Dashboard Summary
       * ------------------------------------------
       */
        worksheet.addRow({
            category: 'Workers',
            metric: 'Total Workers',
            value: dashboard.workers.total,
        });

        worksheet.addRow({
            category: 'Workers',
            metric: 'Active Workers',
            value: dashboard.workers.active,
        });

        worksheet.addRow({
            category: 'Sites',
            metric: 'Total Sites',
            value: dashboard.sites.total,
        });

        worksheet.addRow({
            category: 'Sites',
            metric: 'Active Sites',
            value: dashboard.sites.active,
        });

        worksheet.addRow({
            category: 'Attendance',
            metric: 'Total Attendance',
            value: dashboard.attendance.total,
        });

        worksheet.addRow({
            category: 'Attendance',
            metric: 'Present',
            value: dashboard.attendance.present,
        });

        worksheet.addRow({
            category: 'Attendance',
            metric: 'Absent',
            value: dashboard.attendance.absent,
        });

        worksheet.addRow({
            category: 'Attendance',
            metric: 'Leave',
            value: dashboard.attendance.leave,
        });

        worksheet.addRow({
            category: 'Attendance',
            metric: 'Half Day',
            value: dashboard.attendance.halfDay,
        });

        worksheet.addRow({
            category: 'Payroll',
            metric: 'Total Payroll',
            value: dashboard.payroll.total,
        });

        worksheet.addRow({
            category: 'Payroll',
            metric: 'Total Net Salary',
            value:
                dashboard.payroll.totalNetSalary,
        });
        /**
       * ------------------------------------------
       * Style Worksheet
       * ------------------------------------------
       */

        // Header Row
        const headerRow = worksheet.getRow(4);

        headerRow.font = {
            bold: true,
            color: {
                argb: 'FFFFFFFF',
            },
        };

        headerRow.alignment = {
            horizontal: 'center',
            vertical: 'middle',
        };

        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF1F4E78',
            },
        };

        // Borders & Alignment
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber < 4) return;

            row.eachCell((cell) => {
                cell.border = {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                    right: {
                        style: 'thin',
                    },
                };

                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'left',
                };
            });
        });

        // Highlight Category Column
        worksheet.getColumn(1).eachCell(
            (cell, rowNumber) => {
                if (rowNumber < 5) return;

                cell.font = {
                    bold: true,
                };

                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: 'FFEAF2F8',
                    },
                };
            }
        );

        // Number Formatting
        worksheet.getColumn(3).numFmt =
            '#,##0';

        // Auto Filter
        worksheet.autoFilter = {
            from: {
                row: 4,
                column: 1,
            },
            to: {
                row: worksheet.rowCount,
                column: 3,
            },
        };

        // Freeze Header Row
        worksheet.views = [
            {
                state: 'frozen',
                ySplit: 4,
            },
        ];
        /**
         * ------------------------------------------
         * Stream Excel Response
         * ------------------------------------------
         */
        const fileName = `dashboard-report-${Date.now()}.xlsx`;

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
        );

        await workbook.xlsx.write(res);

        res.end();
    }
/**
 * ==========================================
 * Export Workers PDF
 * ==========================================
 */
async exportWorkersPdf(res, query = {}, tenantId = null) {
  const workers = await exportRepository.getWorkers(query, tenantId);

  const tenant = await getTenantBranding(tenantId);

  const companyName = tenant?.companyName || 'Company name not configured';

  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
  });

  const fileName = `workers-report-${Date.now()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  doc.pipe(res);

  doc.info.Title = 'Workers Report';
  doc.info.Author = companyName;
  doc.info.Subject = 'Workers Report';
  doc.info.Creator = companyName;

  registerPdfFonts(doc);

  const pageContext = { pageNumber: 1 };

  renderPdfHeader(doc, {
    tenant,
    title: 'Workers Report',
    generatedOn: formatDateTime(),
  });

  doc.moveDown(1.5);

  doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_SECTION_TITLE_SIZE).fillColor(PDF_BRANDING_COLOR);
  doc.text('WORKER SUMMARY', { align: 'center' });

  doc.font(PDF_FONT_FAMILY).fontSize(PDF_REPORT_META_SIZE).fillColor('#333333');
  doc.text(`Total Workers : ${workers.length}`, { align: 'right' });

  doc.moveDown(1);

  if (workers.length === 0) {
    doc.font(PDF_FONT_FAMILY).fontSize(12).fillColor('#666666');
    doc.text('No worker records found for the selected filters', { align: 'center' });
    renderPdfFooter(doc, companyName, pageContext);
    doc.end();
    return;
  }

  const startX = 40;
  let startY = doc.y;

  const columns = [
    { label: 'Emp Code', x: startX, width: 60, align: 'left' },
    { label: 'Worker Name', x: 100, width: 110, align: 'left' },
    { label: 'Trade', x: 210, width: 90, align: 'left' },
    { label: 'Site', x: 300, width: 110, align: 'left' },
    { label: 'Mobile', x: 410, width: 60, align: 'right' },
    { label: 'Status', x: 470, width: 85, align: 'left' },
  ];

  const rowHeight = 22;

  const drawTableHeader = () => {
    doc.rect(startX, startY - 5, doc.page.width - startX * 2, 18).fill('#1F4E78');
    doc.fillColor('white');
    columns.forEach((column) => {
      doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_TABLE_HEADER_SIZE).text(column.label, column.x, startY, { width: column.width, align: column.align || 'left' });
    });
    doc.fillColor('black');
    startY += 18;
  };

  drawTableHeader();

  const statusColors = {
    ACTIVE: '#15803D',
    INACTIVE: '#6B7280',
  };

  workers.forEach((worker, index) => {
    if (startY > doc.page.height - 70) {
      addPdfPage(doc, pageContext, () => {
        startY = 50;
        drawTableHeader();
      });
      renderPdfFooter(doc, companyName, pageContext);
    }

    const rowFill = index % 2 === 0 ? '#FFFFFF' : '#F4F7FA';

    doc.rect(startX, startY - 4, doc.page.width - startX * 2, rowHeight).fill(rowFill);
    doc.rect(startX, startY - 4, doc.page.width - startX * 2, rowHeight).stroke('#D9D9D9');

    const renderRow = (cells) => {
      cells.forEach(({ text, column, color }) => {
        doc.font(PDF_FONT_FAMILY).fontSize(PDF_TABLE_ROW_SIZE);
        doc.fillColor(color || 'black');
        doc.text(String(text ?? '-'), column.x, startY, { width: column.width, align: column.align || 'left' });
      });
    };

    renderRow([
      { text: worker.employeeCode || '-', column: columns[0] },
      { text: worker.fullName || '-', column: columns[1] },
      { text: worker.trade || '-', column: columns[2] },
      { text: worker.site?.siteName || '-', column: columns[3] },
      { text: worker.mobileNumber || '-', column: columns[4] },
      { text: worker.status || '-', column: columns[5], color: statusColors[worker.status] || 'black' },
    ]);

    startY += rowHeight;
  });

  doc.moveDown(2);

  doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_REPORT_META_SIZE).fillColor('#333333');
  doc.text(`Total Workers : ${workers.length}`, { align: 'right' });

  doc.moveDown(1.2);

  renderPdfFooter(doc, companyName, pageContext);

  doc.end();
}

/**
 * ==========================================
 * Export Attendance PDF
 * ==========================================
 */
async exportAttendancePdf(res, query = {}, tenantId = null) {
  const attendance = await exportRepository.getAttendance(query, tenantId);

  const tenant = await getTenantBranding(tenantId);

  const companyName = tenant?.companyName || 'Company name not configured';

  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 40,
  });

  const fileName = `attendance-report-${Date.now()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  doc.pipe(res);

  doc.info.Title = 'Attendance Report';
  doc.info.Author = companyName;
  doc.info.Subject = 'Attendance Report';
  doc.info.Creator = companyName;

  registerPdfFonts(doc);

  const pageContext = { pageNumber: 1 };

  const statusCounts = {};
  attendance.forEach((record) => {
    const status = record.status || 'UNKNOWN';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  renderPdfHeader(doc, {
    tenant,
    title: 'Attendance Report',
    generatedOn: formatDateTime(),
  });

  doc.moveDown(1.5);

  doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_SECTION_TITLE_SIZE).fillColor(PDF_BRANDING_COLOR);
  doc.text('ATTENDANCE SUMMARY', { align: 'center' });

  doc.font(PDF_FONT_FAMILY).fontSize(PDF_REPORT_META_SIZE).fillColor('#333333');
  doc.text(`Total Attendance Records : ${attendance.length}`, { align: 'right' });
  doc.text(`Present : ${statusCounts['PRESENT'] || 0}`, { align: 'right' });
  doc.text(`Absent : ${statusCounts['ABSENT'] || 0}`, { align: 'right' });
  doc.text(`Leave : ${statusCounts['LEAVE'] || 0}`, { align: 'right' });
  doc.text(`Half Day : ${statusCounts['HALF_DAY'] || 0}`, { align: 'right' });

  doc.moveDown(1);

  if (attendance.length === 0) {
    doc.font(PDF_FONT_FAMILY).fontSize(12).fillColor('#666666');
    doc.text('No attendance records found for the selected filters', { align: 'center' });
    renderPdfFooter(doc, companyName, pageContext);
    doc.end();
    return;
  }

  const startX = 40;
  let startY = doc.y;

  const columns = [
    { label: 'Worker', x: startX, width: 120, align: 'left' },
    { label: 'Site', x: 160, width: 110, align: 'left' },
    { label: 'Date', x: 270, width: 70, align: 'left' },
    { label: 'Status', x: 340, width: 70, align: 'left' },
    { label: 'Reg Hrs', x: 410, width: 50, align: 'right' },
    { label: 'OT Hrs', x: 460, width: 50, align: 'right' },
    { label: 'Remarks', x: 510, width: 95, align: 'left' },
  ];

  const rowHeight = 22;

  const drawTableHeader = () => {
    doc.rect(startX, startY - 5, doc.page.width - startX * 2, 18).fill('#1F4E78');
    doc.fillColor('white');
    columns.forEach((column) => {
      doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_TABLE_HEADER_SIZE).text(column.label, column.x, startY, { width: column.width, align: column.align || 'left' });
    });
    doc.fillColor('black');
    startY += 18;
  };

  drawTableHeader();

  attendance.forEach((record, index) => {
    if (startY > doc.page.height - 70) {
      addPdfPage(doc, pageContext, () => {
        startY = 50;
        drawTableHeader();
      });
      renderPdfFooter(doc, companyName, pageContext);
    }

    const rowFill = index % 2 === 0 ? '#FFFFFF' : '#F4F7FA';

    doc.rect(startX, startY - 4, doc.page.width - startX * 2, rowHeight).fill(rowFill);
    doc.rect(startX, startY - 4, doc.page.width - startX * 2, rowHeight).stroke('#D9D9D9');

    const renderRow = (cells) => {
      cells.forEach(({ text, column, color }) => {
        doc.font(PDF_FONT_FAMILY).fontSize(PDF_TABLE_ROW_SIZE);
        doc.fillColor(color || 'black');
        doc.text(String(text ?? '-'), column.x, startY, { width: column.width, align: column.align || 'left' });
      });
    };

    renderRow([
      { text: record.worker?.fullName || '-', column: columns[0] },
      { text: record.site?.siteName || '-', column: columns[1] },
      { text: record.attendanceDate ? new Date(record.attendanceDate).toLocaleDateString() : '-', column: columns[2] },
      { text: record.status || '-', column: columns[3] },
      { text: String(record.regularHours ?? 0), column: columns[4] },
      { text: String(record.overtimeHours ?? 0), column: columns[5] },
      { text: record.remarks || '-', column: columns[6] },
    ]);

    startY += rowHeight;
  });

  doc.moveDown(2);

  doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_REPORT_META_SIZE).fillColor('#333333');
  doc.text(`Total Attendance Records : ${attendance.length}`, { align: 'right' });

  doc.moveDown(1.2);

  renderPdfFooter(doc, companyName, pageContext);

  doc.end();
}

/**
 * ==========================================
 * Export Payroll PDF
 * ==========================================
 */
    async exportPayrollPdf(res, query = {}, tenantId = null) {
        const payrolls = await exportRepository.getPayroll(query, tenantId);

        const tenant = await getTenantBranding(tenantId);

        const companyName = tenant?.companyName || 'Company name not configured';

        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margin: 40,
        });

        const fileName = `payroll-report-${Date.now()}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        doc.pipe(res);

        doc.info.Title = 'Payroll Report';
        doc.info.Author = companyName;
        doc.info.Subject = 'Payroll Report';
        doc.info.Creator = companyName;

        registerPdfFonts(doc);

        const pageContext = { pageNumber: 1 };

        const generatedOn = new Date().toLocaleString();

        const formatPeriod = (month, year) => {
            const monthNumber = Number(month);
            const yearNumber = Number(year);

            if (!Number.isFinite(monthNumber) || !Number.isFinite(yearNumber)) {
                return '-';
            }

            return new Date(yearNumber, monthNumber - 1, 1).toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
            });
        };

        const periodLabel = query.attendanceMonth && query.attendanceYear
            ? formatPeriod(query.attendanceMonth, query.attendanceYear)
            : payrolls.length > 0
                ? formatPeriod(payrolls[0].attendanceMonth, payrolls[0].attendanceYear)
                : 'All Periods';

        renderPdfHeader(doc, {
            tenant,
            title: 'PAYROLL REPORT',
            generatedOn,
            periodLabel,
        });

        const financials = payrolls.map((payroll) => calculatePayrollFinancials(payroll));

        const totalGrossSalary = financials.reduce((sum, item) => sum + item.gross, 0);

        const totalNetPayable = financials.reduce((sum, item) => sum + item.netPayable, 0);

        const totalPaid = financials.reduce((sum, item) => sum + item.paid, 0);

        const outstandingBalance = financials.reduce((sum, item) => sum + item.balance, 0);

        doc.moveDown(1.5);

        doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_SECTION_TITLE_SIZE).fillColor(PDF_BRANDING_COLOR);
        doc.text('FINANCIAL SUMMARY', { align: 'center' });

        const summaryRows = [
            ['Total Payroll Records', String(payrolls.length), false],
            ['Total Gross Salary', formatCurrency(totalGrossSalary), false],
            ['Total Net Payable', formatCurrency(totalNetPayable), false],
            ['Total Paid', formatCurrency(totalPaid), false],
            ['Outstanding Balance', formatCurrency(outstandingBalance), true],
        ];

        summaryRows.forEach(([label, value, isTotal]) => {
            const rowY = doc.y;

            doc.font(PDF_FONT_FAMILY).fontSize(PDF_REPORT_META_SIZE).fillColor('#333333');
            doc.text(label, 40, rowY, { width: 300 });

            doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_REPORT_META_SIZE);
            doc.fillColor(isTotal ? '#B91C1C' : PDF_BRANDING_COLOR);
            doc.text(value, 40, rowY, {
                align: 'right',
                width: doc.page.width - 80,
            });

            doc.moveDown(0.85);
        });

        doc.moveDown(1);

        if (payrolls.length === 0) {
            doc.font(PDF_FONT_FAMILY).fontSize(12).fillColor('#666666');
            doc.text('No payroll records found for the selected filters', { align: 'center' });
            renderPdfFooter(doc, companyName, pageContext);
            doc.end();
            return;
        }

        const startX = 40;
        let startY = doc.y;

        const columns = [
            { label: '#', x: 40, width: 28, align: 'left' },
            { label: 'Employee ID', x: 68, width: 55, align: 'left' },
            { label: 'Worker', x: 123, width: 105, align: 'left' },
            { label: 'Site', x: 228, width: 80, align: 'left' },
            { label: 'Period', x: 308, width: 52, align: 'left' },
            { label: 'Basic', x: 360, width: 60, align: 'right' },
            { label: 'Gross', x: 420, width: 60, align: 'right' },
            { label: 'Net Payable', x: 480, width: 70, align: 'right' },
            { label: 'Paid', x: 550, width: 60, align: 'right' },
            { label: 'Balance', x: 610, width: 70, align: 'right' },
            { label: 'Status', x: 680, width: 60, align: 'left' },
        ];

        const rowHeight = 18;

        const drawPayrollHeader = () => {
            doc.rect(startX, startY - 5, doc.page.width - startX * 2, 18).fill('#1F4E78');
            columns.forEach((column) => {
                doc.font(PDF_FONT_FAMILY_BOLD).fontSize(7);
                doc.fillColor('white');
                doc.text(column.label, column.x, startY, { width: column.width });
            });
            doc.fillColor('black');
            startY += 18;
        };

        drawPayrollHeader();

        const statusColors = {
            PAID: '#15803D',
            PARTIALLY_PAID: '#B45309',
            GENERATED: '#1D4ED8',
            PENDING: '#1D4ED8',
            CANCELLED: '#B91C1C',
        };

        payrolls.forEach((payroll, index) => {
            const itemFinancials = calculatePayrollFinancials(payroll);

            if (startY > doc.page.height - 70) {
                addPdfPage(doc, pageContext, () => {
                    startY = 50;
                    drawPayrollHeader();
                });
                renderPdfFooter(doc, companyName, pageContext);
            }

            const rowFill = index % 2 === 0 ? '#FFFFFF' : '#F4F7FA';

            doc.rect(startX, startY - 4, doc.page.width - startX * 2, rowHeight).fill(rowFill);
            doc.rect(startX, startY - 4, doc.page.width - startX * 2, rowHeight).stroke('#D9D9D9');

            const status = derivePayrollStatus(payroll);

            const cells = [
                { text: String(index + 1), column: columns[0], align: columns[0].align },
                { text: payroll.worker?.employeeCode || '-', column: columns[1], align: columns[1].align },
                { text: payroll.worker?.fullName || '-', column: columns[2], align: columns[2].align },
                { text: payroll.site?.siteName || '-', column: columns[3], align: columns[3].align },
                { text: formatPeriod(payroll.attendanceMonth, payroll.attendanceYear), column: columns[4], align: columns[4].align },
                { text: formatCurrency(itemFinancials.basic), column: columns[5], align: columns[5].align },
                { text: formatCurrency(itemFinancials.gross), column: columns[6], align: columns[6].align },
                { text: formatCurrency(itemFinancials.netPayable), column: columns[7], align: columns[7].align },
                { text: formatCurrency(itemFinancials.paid), column: columns[8], align: columns[8].align },
                { text: formatCurrency(itemFinancials.balance), column: columns[9], align: columns[9].align },
                { text: status, column: columns[10], align: columns[10].align, color: statusColors[status] || '#333333' },
            ];

            cells.forEach((cell) => {
                doc.font(PDF_FONT_FAMILY).fontSize(PDF_TABLE_ROW_SIZE);
                doc.fillColor(cell.color || 'black');
                doc.text(cell.text, cell.column.x, startY, {
                    width: cell.column.width,
                    align: cell.align,
                });
            });

            startY += rowHeight;
        });

        doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_REPORT_META_SIZE).fillColor('#1F4E78');
        doc.text('TOTAL', columns[0].x, startY, { width: columns[0].width });

        doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_REPORT_META_SIZE).fillColor('#B91C1C');
        doc.text(formatCurrency(totalNetPayable), columns[7].x, startY, { width: columns[7].width, align: 'right' });
        doc.text(formatCurrency(totalPaid), columns[8].x, startY, { width: columns[8].width, align: 'right' });
        doc.text(formatCurrency(outstandingBalance), columns[9].x, startY, { width: columns[9].width, align: 'right' });

        startY += 18;

        doc.moveDown(2);

        renderPdfFooter(doc, companyName, pageContext);

        doc.end();
    }

/**
 * ==========================================
 * Export Sites PDF
 * ==========================================
 */
async exportSitesPdf(res, query = {}, tenantId = null) {
  const sites = await exportRepository.getSites(query, tenantId);

  const tenant = await getTenantBranding(tenantId);

  const companyName = tenant?.companyName || 'Company name not configured';

  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 40,
  });

  const fileName = `sites-report-${Date.now()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  doc.pipe(res);

  doc.info.Title = 'Sites Report';
  doc.info.Author = companyName;
  doc.info.Subject = 'Sites Report';
  doc.info.Creator = companyName;

  registerPdfFonts(doc);

  const pageContext = { pageNumber: 1 };

  renderPdfHeader(doc, {
    tenant,
    title: 'Sites Report',
    generatedOn: formatDateTime(),
  });

  doc.moveDown(1.5);

  const activeSites = sites.filter((site) => site.status === 'ACTIVE').length;

  doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_SECTION_TITLE_SIZE).fillColor(PDF_BRANDING_COLOR);
  doc.text('SITE SUMMARY', { align: 'center' });

  doc.font(PDF_FONT_FAMILY).fontSize(PDF_REPORT_META_SIZE).fillColor('#333333');
  doc.text(`Total Sites : ${sites.length}`, { align: 'right' });
  doc.text(`Active Sites : ${activeSites}`, { align: 'right' });

  doc.moveDown(1);

  if (sites.length === 0) {
    doc.font(PDF_FONT_FAMILY).fontSize(12).fillColor('#666666');
    doc.text('No site records found for the selected filters', { align: 'center' });
    renderPdfFooter(doc, companyName, pageContext);
    doc.end();
    return;
  }

  const startX = 40;
  let startY = doc.y;

  const columns = [
    { label: 'Site Code', x: startX, width: 60, align: 'left' },
    { label: 'Site Name', x: 100, width: 110, align: 'left' },
    { label: 'Client', x: 210, width: 100, align: 'left' },
    { label: 'Project', x: 310, width: 110, align: 'left' },
    { label: 'City', x: 420, width: 60, align: 'left' },
    { label: 'State', x: 480, width: 60, align: 'left' },
    { label: 'Status', x: 540, width: 45, align: 'left' },
  ];

  const rowHeight = 22;

  const drawTableHeader = () => {
    doc.rect(startX, startY - 5, doc.page.width - startX * 2, 18).fill('#1F4E78');
    doc.fillColor('white');
    columns.forEach((column) => {
      doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_TABLE_HEADER_SIZE).text(column.label, column.x, startY, { width: column.width, align: column.align || 'left' });
    });
    doc.fillColor('black');
    startY += 18;
  };

  drawTableHeader();

  sites.forEach((site, index) => {
    if (startY > doc.page.height - 70) {
      addPdfPage(doc, pageContext, () => {
        startY = 50;
        drawTableHeader();
      });
      renderPdfFooter(doc, companyName, pageContext);
    }

    const rowFill = index % 2 === 0 ? '#FFFFFF' : '#F4F7FA';

    doc.rect(startX, startY - 4, doc.page.width - startX * 2, rowHeight).fill(rowFill);
    doc.rect(startX, startY - 4, doc.page.width - startX * 2, rowHeight).stroke('#D9D9D9');

    const renderRow = (cells) => {
      cells.forEach(({ text, column, color }) => {
        doc.font(PDF_FONT_FAMILY).fontSize(PDF_TABLE_ROW_SIZE);
        doc.fillColor(color || 'black');
        doc.text(String(text ?? '-'), column.x, startY, { width: column.width, align: column.align || 'left' });
      });
    };

    renderRow([
      { text: site.siteCode || '-', column: columns[0] },
      { text: site.siteName || '-', column: columns[1] },
      { text: site.clientName || '-', column: columns[2] },
      { text: site.projectName || '-', column: columns[3] },
      { text: site.city || '-', column: columns[4] },
      { text: site.state || '-', column: columns[5] },
      { text: site.status || '-', column: columns[6] },
    ]);

    startY += rowHeight;
  });

  doc.moveDown(2);

  doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_REPORT_META_SIZE).fillColor('#333333');
  doc.text(`Total Sites : ${sites.length}`, { align: 'right' });

  doc.moveDown(1.2);

  renderPdfFooter(doc, companyName, pageContext);

  doc.end();
}

/**
 * ==========================================
 * Export Dashboard PDF
 * ==========================================
 */
async exportDashboardPdf(res, tenantId = null) {
  const dashboard = await exportRepository.getDashboardData(tenantId);

  const tenant = await getTenantBranding(tenantId);

  const companyName = tenant?.companyName || 'Company name not configured';

  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
  });

  const fileName = `dashboard-report-${Date.now()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  doc.pipe(res);

  doc.info.Title = 'Dashboard Report';
  doc.info.Author = companyName;
  doc.info.Subject = 'Dashboard Report';
  doc.info.Creator = companyName;

  registerPdfFonts(doc);

  const pageContext = { pageNumber: 1 };

  renderPdfHeader(doc, {
    tenant,
    title: 'Dashboard Summary Report',
    generatedOn: formatDateTime(),
  });

  doc.moveDown(2);

  const summary = [
    {
      title: 'Workers',
      values: [
        ['Total Workers', String(dashboard.workers.total)],
        ['Active Workers', String(dashboard.workers.active)],
      ],
    },
    {
      title: 'Sites',
      values: [
        ['Total Sites', String(dashboard.sites.total)],
        ['Active Sites', String(dashboard.sites.active)],
      ],
    },
    {
      title: 'Attendance',
      values: [
        ['Total Attendance', String(dashboard.attendance.total)],
        ['Present', String(dashboard.attendance.present)],
        ['Absent', String(dashboard.attendance.absent)],
        ['Leave', String(dashboard.attendance.leave)],
        ['Half Day', String(dashboard.attendance.halfDay)],
      ],
    },
    {
      title: 'Payroll',
      values: [
        ['Total Payroll', String(dashboard.payroll.total)],
        ['Total Net Salary', formatCurrency(dashboard.payroll.totalNetSalary)],
        ['Pending Salary', formatCurrency(dashboard.payroll.pendingSalary)],
      ],
    },
  ];

  let startY = doc.y;

  summary.forEach((section) => {
    if (startY > doc.page.height - 150) {
      doc.addPage();
      pageContext.pageNumber += 1;
      startY = 50;
    }

    doc.font(PDF_FONT_FAMILY_BOLD).fontSize(12).fillColor(PDF_BRANDING_COLOR);
    doc.rect(40, startY, 515, 24, 4).fill('#1F4E78');
    doc.fillColor('white').font(PDF_FONT_FAMILY_BOLD).fontSize(12);
    doc.text(section.title, 50, startY + 7);
    startY += 35;

    section.values.forEach(([label, value]) => {
      doc.fillColor('black').font(PDF_FONT_FAMILY).fontSize(10);
      doc.text(label, 55, startY);

      doc.font(PDF_FONT_FAMILY_BOLD).text(String(value), 350, startY, { width: 150, align: 'right' });

      doc.moveTo(50, startY + 16).lineTo(550, startY + 16).stroke('#DDDDDD');

      startY += 24;
    });

    startY += 20;
  });

  doc.moveDown(2);

  renderPdfFooter(doc, companyName, pageContext);

  doc.end();
}

};

export default new ExportService();


