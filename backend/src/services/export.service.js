import path from 'path';
import { fileURLToPath } from 'url';

import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

import Tenant from '../models/Tenant.js';
import exportRepository from '../repositories/export.repository.js';

const PDF_FONT_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../utils/pdf/fonts'
);

export const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
    })}`;

export const registerPayrollPdfFonts = (doc) => {
    doc.registerFont(
        'NotoSans',
        path.join(PDF_FONT_DIR, 'NotoSans-Regular.ttf'),
        undefined
    );

    doc.registerFont(
        'NotoSans-Bold',
        path.join(PDF_FONT_DIR, 'NotoSans-Bold.ttf'),
        undefined
    );

    return doc;
};

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
async exportWorkersPdf(res, tenantId) {
  /**
   * ------------------------------------------
   * Fetch Workers
   * ------------------------------------------
   */
  const workers =
    await exportRepository.getWorkers({}, tenantId);

  /**
   * ------------------------------------------
   * Create PDF
   * ------------------------------------------
   */
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
  });

  const fileName = `workers-report-${Date.now()}.pdf`;

  res.setHeader(
    'Content-Type',
    'application/pdf'
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );

  doc.pipe(res);

  /**
   * ------------------------------------------
   * PDF Metadata
   * ------------------------------------------
   */
  doc.info.Title =
    'Workers Report';

  doc.info.Author =
    'Contractor Worker Management';

  doc.info.Subject =
    'Workers Report';

  doc.info.Creator =
    'Contractor Worker Management';

  /**
   * ------------------------------------------
   * Report Title
   * ------------------------------------------
   */
  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('Workers Report', {
      align: 'center',
    });

  doc.moveDown();

  doc
    .fontSize(10)
    .font('Helvetica')
    .text(
      `Generated On : ${new Date().toLocaleString()}`
    );

  doc.moveDown(1.5);

  /**
   * ------------------------------------------
   * Table Header
   * ------------------------------------------
   */

  const startX = 40;
  let startY = doc.y;

  const columns = [
    {
      label: 'Emp Code',
      x: startX,
      width: 70,
    },
    {
      label: 'Worker Name',
      x: 110,
      width: 120,
    },
    {
      label: 'Trade',
      x: 235,
      width: 90,
    },
    {
      label: 'Site',
      x: 330,
      width: 120,
    },
    {
      label: 'Status',
      x: 455,
      width: 70,
    },
  ];

  doc
    .rect(
      startX - 5,
      startY - 5,
      500,
      22
    )
    .fill('#1F4E78');

  doc.fillColor('white');

  columns.forEach((column) => {
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(
        column.label,
        column.x,
        startY,
        {
          width: column.width,
        }
      );
  });

  doc.fillColor('black');

  startY += 28;
  /**
   * ------------------------------------------
   * Render Worker Rows
   * ------------------------------------------
   */

  const rowHeight = 22;

  workers.forEach((worker) => {
    /**
     * Page Break
     */
    if (
      startY >
      doc.page.height - 60
    ) {
      doc.addPage();

      startY = 50;

      doc
        .rect(
          startX - 5,
          startY - 5,
          500,
          22
        )
        .fill('#1F4E78');

      doc.fillColor('white');

      columns.forEach((column) => {
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .text(
            column.label,
            column.x,
            startY,
            {
              width: column.width,
            }
          );
      });

      doc.fillColor('black');

      startY += 28;
    }

    /**
     * Row Border
     */
    doc
      .rect(
        startX - 5,
        startY - 4,
        500,
        rowHeight
      )
      .stroke('#D9D9D9');

    /**
     * Employee Code
     */
    doc
      .font('Helvetica')
      .fontSize(9)
      .text(
        worker.employeeCode || '-',
        columns[0].x,
        startY,
        {
          width: columns[0].width,
        }
      );

    /**
     * Worker Name
     */
    doc.text(
      worker.fullName || '-',
      columns[1].x,
      startY,
      {
        width: columns[1].width,
      }
    );

    /**
     * Trade
     */
    doc.text(
      worker.trade || '-',
      columns[2].x,
      startY,
      {
        width: columns[2].width,
      }
    );

    /**
     * Site
     */
    doc.text(
      worker.site?.siteName || '-',
      columns[3].x,
      startY,
      {
        width: columns[3].width,
      }
    );

    /**
     * Status
     */
    doc.text(
      worker.status || '-',
      columns[4].x,
      startY,
      {
        width: columns[4].width,
      }
    );

    startY += rowHeight;
  });
    /**
   * ------------------------------------------
   * Footer
   * ------------------------------------------
   */

  doc.moveDown(2);

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(
      `Total Workers : ${workers.length}`,
      {
        align: 'right',
      }
    );

  doc.moveDown();

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('gray')
    .text(
      `Generated by Contractor Worker Management System`,
      {
        align: 'center',
      }
    );

  /**
   * ------------------------------------------
   * Stream PDF Response
   * ------------------------------------------
   */
  doc.end();
}
/**
 * ==========================================
 * Export Attendance PDF
 * ==========================================
 */
async exportAttendancePdf(res, tenantId) {
  /**
   * ------------------------------------------
   * Fetch Attendance
   * ------------------------------------------
   */
  const attendance =
    await exportRepository.getAttendance({}, tenantId);

  /**
   * ------------------------------------------
   * Create PDF
   * ------------------------------------------
   */
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
  });

  const fileName = `attendance-report-${Date.now()}.pdf`;

  res.setHeader(
    'Content-Type',
    'application/pdf'
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );

  doc.pipe(res);

  /**
   * ------------------------------------------
   * PDF Metadata
   * ------------------------------------------
   */
  doc.info.Title =
    'Attendance Report';

  doc.info.Author =
    'Contractor Worker Management';

  doc.info.Subject =
    'Attendance Report';

  doc.info.Creator =
    'Contractor Worker Management';

  /**
   * ------------------------------------------
   * Report Title
   * ------------------------------------------
   */
  doc
    .font('Helvetica-Bold')
    .fontSize(18)
    .text(
      'Attendance Report',
      {
        align: 'center',
      }
    );

  doc.moveDown();

  doc
    .font('Helvetica')
    .fontSize(10)
    .text(
      `Generated On : ${new Date().toLocaleString()}`
    );

  doc.moveDown(1.5);

  /**
   * ------------------------------------------
   * Table Header
   * ------------------------------------------
   */

  const startX = 20;
  let startY = doc.y;

  const columns = [
    {
      label: 'Emp Code',
      x: startX,
      width: 60,
    },
    {
      label: 'Worker',
      x: 85,
      width: 95,
    },
    {
      label: 'Site',
      x: 185,
      width: 90,
    },
    {
      label: 'Date',
      x: 280,
      width: 70,
    },
    {
      label: 'Status',
      x: 355,
      width: 60,
    },
    {
      label: 'Hours',
      x: 420,
      width: 45,
    },
    {
      label: 'OT',
      x: 470,
      width: 35,
    },
    {
      label: 'Remark',
      x: 510,
      width: 70,
    },
  ];

  doc
    .rect(
      startX - 5,
      startY - 5,
      560,
      22
    )
    .fill('#1F4E78');

  doc.fillColor('white');

  columns.forEach((column) => {
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        column.label,
        column.x,
        startY,
        {
          width: column.width,
        }
      );
  });

  doc.fillColor('black');

  startY += 28;
    /**
   * ------------------------------------------
   * Render Attendance Rows
   * ------------------------------------------
   */

  const rowHeight = 22;

  attendance.forEach((record) => {
    /**
     * Page Break
     */
    if (
      startY >
      doc.page.height - 60
    ) {
      doc.addPage();

      startY = 50;

      doc
        .rect(
          startX - 5,
          startY - 5,
          560,
          22
        )
        .fill('#1F4E78');

      doc.fillColor('white');

      columns.forEach((column) => {
        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .text(
            column.label,
            column.x,
            startY,
            {
              width: column.width,
            }
          );
      });

      doc.fillColor('black');

      startY += 28;
    }

    /**
     * Row Border
     */
    doc
      .rect(
        startX - 5,
        startY - 4,
        560,
        rowHeight
      )
      .stroke('#D9D9D9');

    /**
     * Employee Code
     */
    doc
      .font('Helvetica')
      .fontSize(8)
      .text(
        record.worker?.employeeCode || '-',
        columns[0].x,
        startY,
        {
          width: columns[0].width,
        }
      );

    /**
     * Worker Name
     */
    doc.text(
      record.worker?.fullName || '-',
      columns[1].x,
      startY,
      {
        width: columns[1].width,
      }
    );

    /**
     * Site
     */
    doc.text(
      record.site?.siteName || '-',
      columns[2].x,
      startY,
      {
        width: columns[2].width,
      }
    );

    /**
     * Attendance Date
     */
    doc.text(
      record.attendanceDate
        ? new Date(
            record.attendanceDate
          ).toLocaleDateString()
        : '-',
      columns[3].x,
      startY,
      {
        width: columns[3].width,
      }
    );

    /**
     * Status
     */
    doc.text(
      record.status || '-',
      columns[4].x,
      startY,
      {
        width: columns[4].width,
      }
    );

    /**
     * Regular Hours
     */
    doc.text(
      String(
        record.regularHours ?? 0
      ),
      columns[5].x,
      startY,
      {
        width: columns[5].width,
      }
    );

    /**
     * Overtime Hours
     */
    doc.text(
      String(
        record.overtimeHours ?? 0
      ),
      columns[6].x,
      startY,
      {
        width: columns[6].width,
      }
    );

    /**
     * Remarks
     */
    doc.text(
      record.remarks || '-',
      columns[7].x,
      startY,
      {
        width: columns[7].width,
      }
    );

    startY += rowHeight;
  });
    /**
   * ------------------------------------------
   * Footer
   * ------------------------------------------
   */

  doc.moveDown(2);

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('black')
    .text(
      `Total Attendance Records : ${attendance.length}`,
      {
        align: 'right',
      }
    );

  doc.moveDown();

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('gray')
    .text(
      'Generated by Contractor Worker Management System',
      {
        align: 'center',
      }
    );

  /**
   * ------------------------------------------
   * Stream PDF Response
   * ------------------------------------------
   */
  doc.end();
}
/**
 * ==========================================
 * Export Payroll PDF
 * ==========================================
 */
    async exportPayrollPdf(res, query = {}, tenantId) {
        const payrolls =
            await exportRepository.getPayroll(query, tenantId);

        const tenant = await Tenant.findOne({
            _id: tenantId,
            isDeleted: false,
        }).select(
            'companyName address city district state pincode email mobileNumber'
        );

        const companyName =
            tenant?.companyName ||
            'Company name not configured';

        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margin: 40,
        });

        const fileName = `payroll-report-${Date.now()}.pdf`;

        res.setHeader(
            'Content-Type',
            'application/pdf'
        );

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
        );

        doc.pipe(res);

        doc.info.Title = 'Payroll Report';
        doc.info.Author = companyName;
        doc.info.Subject = 'Payroll Report';
        doc.info.Creator = companyName;

        let docPageNumber = 1;

        registerPayrollPdfFonts(doc);

        const generatedOn = new Date().toLocaleString();

        const formatPeriod = (month, year) => {
            const monthNumber = Number(month);
            const yearNumber = Number(year);

            if (
                !Number.isFinite(monthNumber) ||
                !Number.isFinite(yearNumber)
            ) {
                return '-';
            }

            return new Date(
                yearNumber,
                monthNumber - 1,
                1
            ).toLocaleString(
                'en-US',
                {
                    month: 'long',
                    year: 'numeric',
                }
            );
        };

        const periodLabel =
            query.attendanceMonth && query.attendanceYear
                ? formatPeriod(
                    query.attendanceMonth,
                    query.attendanceYear
                )
                : payrolls.length > 0
                    ? formatPeriod(
                        payrolls[0].attendanceMonth,
                        payrolls[0].attendanceYear
                    )
                    : 'All Periods';

        doc.font('NotoSans-Bold').fontSize(20).fillColor('#1F4E78');
        doc.text(companyName, { align: 'center' });

        doc.font('NotoSans').fontSize(9).fillColor('#444444');

        if (tenant?.address) {
            doc.text(tenant.address, { align: 'center' });
        }

        const locationLine = [
            tenant?.city,
            tenant?.district,
            tenant?.state,
            tenant?.pincode,
        ]
            .filter(Boolean)
            .join(', ');

        if (locationLine) {
            doc.text(locationLine, { align: 'center' });
        }

        if (tenant?.email) {
            doc.text(tenant.email, { align: 'center' });
        }

        if (tenant?.mobileNumber) {
            doc.text(`Mobile : ${tenant.mobileNumber}`, { align: 'center' });
        }

        doc.moveDown(1.25);

        doc.font('NotoSans-Bold').fontSize(16).fillColor('#1F4E78');
        doc.text('PAYROLL REPORT', { align: 'center' });

        doc.font('NotoSans').fontSize(9).fillColor('#666666');
        doc.text(`Generated On : ${generatedOn}`, { align: 'center' });
        doc.text(`Period : ${periodLabel}`, { align: 'center' });

        doc.moveDown(1.5);

        const financials = payrolls.map((payroll) =>
            calculatePayrollFinancials(payroll)
        );

        const totalGrossSalary = financials.reduce(
            (sum, item) => sum + item.gross,
            0
        );

        const totalNetPayable = financials.reduce(
            (sum, item) => sum + item.netPayable,
            0
        );

        const totalPaid = financials.reduce(
            (sum, item) => sum + item.paid,
            0
        );

        const outstandingBalance = financials.reduce(
            (sum, item) => sum + item.balance,
            0
        );

        doc.font('NotoSans-Bold').fontSize(12).fillColor('#1F4E78');
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

            doc.font('NotoSans').fontSize(9).fillColor('#333333');
            doc.text(label, 40, rowY, { width: 300 });

            doc.font('NotoSans-Bold').fontSize(9);
            doc.fillColor(isTotal ? '#B91C1C' : '#1F4E78');
            doc.text(value, 40, rowY, {
                align: 'right',
                width: doc.page.width - 80,
            });

            doc.moveDown(0.85);
        });

        doc.moveDown(1);

        if (payrolls.length === 0) {
            doc.font('NotoSans').fontSize(12).fillColor('#666666');
            doc.text(
                'No payroll records found for the selected filters',
                { align: 'center' }
            );
        } else {
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
                doc.rect(
                    startX,
                    startY - 5,
                    doc.page.width - startX * 2,
                    18
                ).fill('#1F4E78');

                columns.forEach((column) => {
                    doc.font('NotoSans-Bold').fontSize(7);
                    doc.fillColor('white');
                    doc.text(column.label, column.x, startY, {
                        width: column.width,
                    });
                });

                doc.fillColor('black');
                startY += 18;
            };

            drawPayrollHeader();

            payrolls.forEach((payroll, index) => {
                const itemFinancials = calculatePayrollFinancials(payroll);

                if (startY > doc.page.height - 70) {
                    doc.addPage();
                    docPageNumber += 1;
                    startY = 50;
                    drawPayrollHeader();
                }

                const rowFill =
                    index % 2 === 0 ? '#FFFFFF' : '#F4F7FA';

                doc.rect(
                    startX,
                    startY - 4,
                    doc.page.width - startX * 2,
                    rowHeight
                ).fill(rowFill);

                doc.rect(
                    startX,
                    startY - 4,
                    doc.page.width - startX * 2,
                    rowHeight
                ).stroke('#D9D9D9');

                const status = derivePayrollStatus(payroll);

                const statusColors = {
                    PAID: '#15803D',
                    PARTIALLY_PAID: '#B45309',
                    GENERATED: '#1D4ED8',
                    PENDING: '#1D4ED8',
                    CANCELLED: '#B91C1C',
                };

                const cells = [
                    {
                        text: String(index + 1),
                        column: columns[0],
                        align: 'left',
                    },
                    {
                        text: payroll.worker?.employeeCode || '-',
                        column: columns[1],
                        align: 'left',
                    },
                    {
                        text: payroll.worker?.fullName || '-',
                        column: columns[2],
                        align: 'left',
                    },
                    {
                        text: payroll.site?.siteName || '-',
                        column: columns[3],
                        align: 'left',
                    },
                    {
                        text: formatPeriod(
                            payroll.attendanceMonth,
                            payroll.attendanceYear
                        ),
                        column: columns[4],
                        align: 'left',
                    },
                    {
                        text: formatCurrency(itemFinancials.basic),
                        column: columns[5],
                        align: 'right',
                    },
                    {
                        text: formatCurrency(itemFinancials.gross),
                        column: columns[6],
                        align: 'right',
                    },
                    {
                        text: formatCurrency(itemFinancials.netPayable),
                        column: columns[7],
                        align: 'right',
                    },
                    {
                        text: formatCurrency(itemFinancials.paid),
                        column: columns[8],
                        align: 'right',
                    },
                    {
                        text: formatCurrency(itemFinancials.balance),
                        column: columns[9],
                        align: 'right',
                    },
                    {
                        text: status,
                        column: columns[10],
                        align: columns[10].align,
                        color: statusColors[status] || '#333333',
                    },
                ];

                cells.forEach((cell) => {
                    const { column } = cell;

                    doc.font('NotoSans').fontSize(8);

                    doc.fillColor(
                        cell.color || 'black'
                    );

                    doc.text(cell.text, column.x, startY, {
                        width: column.width,
                        align: cell.align,
                    });
                });

                startY += rowHeight;
            });

            doc.font('NotoSans-Bold').fontSize(9).fillColor('#1F4E78');
            doc.text('TOTAL', columns[0].x, startY, {
                width: columns[0].width,
            });

            doc.font('NotoSans-Bold').fontSize(9).fillColor('#B91C1C');
            doc.text(
                formatCurrency(totalNetPayable),
                columns[7].x,
                startY,
                {
                    width: columns[7].width,
                    align: 'right',
                }
            );

            doc.font('NotoSans-Bold').fontSize(9).fillColor('#B91C1C');
            doc.text(
                formatCurrency(totalPaid),
                columns[8].x,
                startY,
                {
                    width: columns[8].width,
                    align: 'right',
                }
            );

            doc.font('NotoSans-Bold').fontSize(9).fillColor('#B91C1C');
            doc.text(
                formatCurrency(outstandingBalance),
                columns[9].x,
                startY,
                {
                    width: columns[9].width,
                    align: 'right',
                }
            );

            startY += 18;
        }

        doc.moveDown(2);

        doc.font('NotoSans').fontSize(8).fillColor('#888888');
        doc.text(`Generated by ${companyName}`, { align: 'center' });

        doc.moveDown(1);

        doc.font('NotoSans').fontSize(8).fillColor('#888888');
        doc.text(`Page ${docPageNumber}`, { align: 'center' });

        doc.end();
    }

/**
 * ==========================================
 * Export Sites PDF
 * ==========================================
 */
async exportSitesPdf(res, tenantId) {
  /**
   * ------------------------------------------
   * Fetch Sites
   * ------------------------------------------
   */
  const sites =
    await exportRepository.getSites({}, tenantId);

  /**
   * ------------------------------------------
   * Create PDF
   * ------------------------------------------
   */
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
  });

  const fileName = `sites-report-${Date.now()}.pdf`;

  res.setHeader(
    'Content-Type',
    'application/pdf'
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );

  doc.pipe(res);

  /**
   * ------------------------------------------
   * PDF Metadata
   * ------------------------------------------
   */
  doc.info.Title =
    'Sites Report';

  doc.info.Author =
    'Contractor Worker Management';

  doc.info.Subject =
    'Sites Report';

  doc.info.Creator =
    'Contractor Worker Management';

  /**
   * ------------------------------------------
   * Report Title
   * ------------------------------------------
   */
  doc
    .font('Helvetica-Bold')
    .fontSize(18)
    .text(
      'Sites Report',
      {
        align: 'center',
      }
    );

  doc.moveDown();

  doc
    .font('Helvetica')
    .fontSize(10)
    .text(
      `Generated On : ${new Date().toLocaleString()}`
    );

  doc.moveDown(1.5);

  /**
   * ------------------------------------------
   * Table Header
   * ------------------------------------------
   */

  const startX = 15;
  let startY = doc.y;

  const columns = [
    {
      label: 'Site Code',
      x: startX,
      width: 60,
    },
    {
      label: 'Site Name',
      x: 80,
      width: 110,
    },
    {
      label: 'Client',
      x: 195,
      width: 100,
    },
    {
      label: 'Project',
      x: 300,
      width: 100,
    },
    {
      label: 'City',
      x: 405,
      width: 60,
    },
    {
      label: 'State',
      x: 470,
      width: 60,
    },
    {
      label: 'Status',
      x: 535,
      width: 45,
    },
  ];

  doc
    .rect(
      startX - 5,
      startY - 5,
      570,
      22
    )
    .fill('#1F4E78');

  doc.fillColor('white');

  columns.forEach((column) => {
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        column.label,
        column.x,
        startY,
        {
          width: column.width,
        }
      );
  });

  doc.fillColor('black');

  startY += 28;
    /**
   * ------------------------------------------
   * Render Site Rows
   * ------------------------------------------
   */

  const rowHeight = 22;

  sites.forEach((site) => {
    /**
     * Page Break
     */
    if (
      startY >
      doc.page.height - 60
    ) {
      doc.addPage();

      startY = 50;

      doc
        .rect(
          startX - 5,
          startY - 5,
          570,
          22
        )
        .fill('#1F4E78');

      doc.fillColor('white');

      columns.forEach((column) => {
        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .text(
            column.label,
            column.x,
            startY,
            {
              width: column.width,
            }
          );
      });

      doc.fillColor('black');

      startY += 28;
    }

    /**
     * Row Border
     */
    doc
      .rect(
        startX - 5,
        startY - 4,
        570,
        rowHeight
      )
      .stroke('#D9D9D9');

    /**
     * Site Code
     */
    doc
      .font('Helvetica')
      .fontSize(8)
      .text(
        site.siteCode || '-',
        columns[0].x,
        startY,
        {
          width: columns[0].width,
        }
      );

    /**
     * Site Name
     */
    doc.text(
      site.siteName || '-',
      columns[1].x,
      startY,
      {
        width: columns[1].width,
      }
    );

    /**
     * Client Name
     */
    doc.text(
      site.clientName || '-',
      columns[2].x,
      startY,
      {
        width: columns[2].width,
      }
    );

    /**
     * Project Name
     */
    doc.text(
      site.projectName || '-',
      columns[3].x,
      startY,
      {
        width: columns[3].width,
      }
    );

    /**
     * City
     */
    doc.text(
      site.city || '-',
      columns[4].x,
      startY,
      {
        width: columns[4].width,
      }
    );

    /**
     * State
     */
    doc.text(
      site.state || '-',
      columns[5].x,
      startY,
      {
        width: columns[5].width,
      }
    );

    /**
     * Status
     */
    doc.text(
      site.status || '-',
      columns[6].x,
      startY,
      {
        width: columns[6].width,
      }
    );

    startY += rowHeight;
  });

  /**
   * ------------------------------------------
   * Footer
   * ------------------------------------------
   */

  doc.moveDown(2);

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('black')
    .text(
      `Total Sites : ${sites.length}`,
      {
        align: 'right',
      }
    );

  doc.moveDown();

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('gray')
    .text(
      'Generated by Contractor Worker Management System',
      {
        align: 'center',
      }
    );

  /**
   * ------------------------------------------
   * Stream PDF Response
   * ------------------------------------------
   */
  doc.end();
}
/**
 * ==========================================
 * Export Dashboard PDF
 * ==========================================
 */
async exportDashboardPdf(res, tenantId) {
  /**
   * ------------------------------------------
   * Fetch Dashboard Data
   * ------------------------------------------
   */
  const dashboard =
    await exportRepository.getDashboardData(tenantId);

  /**
   * ------------------------------------------
   * Create PDF
   * ------------------------------------------
   */
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
  });

  const fileName = `dashboard-report-${Date.now()}.pdf`;

  res.setHeader(
    'Content-Type',
    'application/pdf'
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );

  doc.pipe(res);

  /**
   * ------------------------------------------
   * PDF Metadata
   * ------------------------------------------
   */
  doc.info.Title =
    'Dashboard Report';

  doc.info.Author =
    'Contractor Worker Management';

  doc.info.Subject =
    'Dashboard Report';

  doc.info.Creator =
    'Contractor Worker Management';

  /**
   * ------------------------------------------
   * Report Title
   * ------------------------------------------
   */

  doc
    .font('Helvetica-Bold')
    .fontSize(20)
    .text(
      'Dashboard Summary Report',
      {
        align: 'center',
      }
    );

  doc.moveDown();

  doc
    .font('Helvetica')
    .fontSize(10)
    .text(
      `Generated On : ${new Date().toLocaleString()}`
    );

  doc.moveDown(2);
    /**
   * ------------------------------------------
   * Render Dashboard Summary
   * ------------------------------------------
   */

  const summary = [
    {
      title: 'Workers',
      values: [
        ['Total Workers', dashboard.workers.total],
        ['Active Workers', dashboard.workers.active],
      ],
    },
    {
      title: 'Sites',
      values: [
        ['Total Sites', dashboard.sites.total],
        ['Active Sites', dashboard.sites.active],
      ],
    },
    {
      title: 'Attendance',
      values: [
        ['Total Attendance', dashboard.attendance.total],
        ['Present', dashboard.attendance.present],
        ['Absent', dashboard.attendance.absent],
        ['Leave', dashboard.attendance.leave],
        ['Half Day', dashboard.attendance.halfDay],
      ],
    },
    {
      title: 'Payroll',
      values: [
        ['Total Payroll', dashboard.payroll.total],
        [
          'Total Net Salary',
          `₹${dashboard.payroll.totalNetSalary.toLocaleString()}`,
        ],
      ],
    },
  ];

  let startY = doc.y;

  summary.forEach((section) => {
    /**
     * Page Break
     */
    if (startY > doc.page.height - 150) {
      doc.addPage();
      startY = 50;
    }

    /**
     * Section Header
     */
    doc
      .roundedRect(
        40,
        startY,
        515,
        24,
        4
      )
      .fill('#1F4E78');

    doc
      .fillColor('white')
      .font('Helvetica-Bold')
      .fontSize(12)
      .text(
        section.title,
        50,
        startY + 7
      );

    startY += 35;

    /**
     * Section Rows
     */
    section.values.forEach(
      ([label, value]) => {
        doc
          .fillColor('black')
          .font('Helvetica')
          .fontSize(10)
          .text(
            label,
            55,
            startY
          );

        doc
          .font('Helvetica-Bold')
          .text(
            String(value),
            350,
            startY,
            {
              width: 150,
              align: 'right',
            }
          );

        doc
          .moveTo(
            50,
            startY + 16
          )
          .lineTo(
            550,
            startY + 16
          )
          .stroke('#DDDDDD');

        startY += 24;
      }
    );

    startY += 20;
  });
    /**
   * ------------------------------------------
   * Footer
   * ------------------------------------------
   */

  doc.moveDown(2);

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('black')
    .text(
      'Dashboard Summary Generated Successfully',
      {
        align: 'right',
      }
    );

  doc.moveDown();

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor('gray')
    .text(
      'Generated by Contractor Worker Management System',
      {
        align: 'center',
      }
    );

  /**
   * ------------------------------------------
   * Stream PDF Response
   * ------------------------------------------
   */
  doc.end();
}

};

export default new ExportService();


