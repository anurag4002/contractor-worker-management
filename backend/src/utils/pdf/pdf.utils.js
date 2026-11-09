import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import Tenant from '../../models/Tenant.js';

const FONT_REGULAR_FILE = 'NotoSans-Regular.ttf';
const FONT_BOLD_FILE = 'NotoSans-Bold.ttf';

const resolvePdfFontDir = () => {
    const candidates = [
        path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            '../utils/pdf/fonts'
        ),
        path.resolve(process.cwd(), 'src/utils/pdf/fonts'),
        path.resolve(process.cwd(), 'backend/src/utils/pdf/fonts'),
    ];

    return candidates.find(
        (dir) =>
            fs.existsSync(path.join(dir, FONT_REGULAR_FILE)) &&
            fs.existsSync(path.join(dir, FONT_BOLD_FILE))
    );
};

const COMPANY_NAME_FALLBACK = 'Company name not configured';

export const PDF_FONT_FAMILY = 'NotoSans';
export const PDF_FONT_FAMILY_BOLD = 'NotoSans-Bold';

export const PDF_BRANDING_COLOR = '#1F4E78';

export const PDF_REPORT_TITLE_SIZE = 18;
export const PDF_REPORT_SUBTITLE_SIZE = 14;
export const PDF_REPORT_META_SIZE = 9;
export const PDF_SECTION_TITLE_SIZE = 12;
export const PDF_TABLE_HEADER_SIZE = 10;
export const PDF_TABLE_ROW_SIZE = 9;
export const PDF_FOOTER_SIZE = 8;

/**
 * Registers the embedded Noto Sans fonts (Regular + Bold) on a PDFKit
 * document. Fails clearly when required font assets are missing.
 */
export const registerPdfFonts = (doc) => {
    const PDF_FONT_DIR = resolvePdfFontDir();

    const missingFonts = [
        { file: FONT_REGULAR_FILE, family: PDF_FONT_FAMILY },
        { file: FONT_BOLD_FILE, family: PDF_FONT_FAMILY_BOLD },
    ].filter(
        ({ file }) =>
            !fs.existsSync(path.join(PDF_FONT_DIR, file))
    );

    if (missingFonts.length > 0) {
        throw new Error(
            `Missing required PDF font assets: ${missingFonts
                .map((font) => font.file)
                .join(', ')}. `
            + 'Required fonts: NotoSans-Regular.ttf and NotoSans-Bold.ttf.'
        );
    }

    doc.registerFont(
        PDF_FONT_FAMILY,
        path.join(PDF_FONT_DIR, FONT_REGULAR_FILE)
    );

    doc.registerFont(
        PDF_FONT_FAMILY_BOLD,
        path.join(PDF_FONT_DIR, FONT_BOLD_FILE)
    );

    return doc;
};

/**
 * Shared INR currency formatter using Indian digit grouping.
 * Preserves up to two decimal places (e.g. ₹1,23,456.75).
 */
export const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

export const formatDate = (value) => {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    return date.toLocaleDateString('en-IN');
};

export const formatDateTime = (value) => {
    const date = value ? new Date(value) : new Date();

    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    return date.toLocaleString('en-IN');
};

/**
 * Tenant-scoped branding lookup. Always filters by the authenticated
 * tenant id and soft-deleted tenants are ignored.
 */
export const getTenantBranding = async (tenantId) => {
    if (!tenantId) {
        return null;
    }

    return Tenant.findOne({
        _id: tenantId,
        isDeleted: false,
    }).select(
        'companyName address city district state pincode email mobileNumber'
    );
};

export const getCompanyName = async (tenantId) => {
    const tenant = await getTenantBranding(tenantId);

    return tenant?.companyName || COMPANY_NAME_FALLBACK;
};

/**
 * Renders the shared corporate document header:
 * company name, contact details, report title, generated timestamp and
 * optional reporting period.
 */
export const renderPdfHeader = (doc, { tenant, title, generatedOn, periodLabel }) => {
    const companyName =
        tenant?.companyName || COMPANY_NAME_FALLBACK;

    doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_REPORT_TITLE_SIZE).fillColor(PDF_BRANDING_COLOR);
    doc.text(companyName, { align: 'center' });

    doc.font(PDF_FONT_FAMILY).fontSize(PDF_REPORT_META_SIZE).fillColor('#444444');

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

    doc.font(PDF_FONT_FAMILY_BOLD).fontSize(PDF_REPORT_SUBTITLE_SIZE).fillColor(PDF_BRANDING_COLOR);
    doc.text(title, { align: 'center' });

    doc.font(PDF_FONT_FAMILY).fontSize(PDF_REPORT_META_SIZE).fillColor('#666666');
    doc.text(`Generated On : ${generatedOn}`, { align: 'center' });

    if (periodLabel) {
        doc.text(`Period : ${periodLabel}`, { align: 'center' });
    }

    doc.moveDown(1.5);

    return companyName;
};

/**
 * Renders the shared corporate document footer with company identity and
 * consistent page numbering.
 */
export const renderPdfFooter = (doc, companyName, pageContext) => {
    const pageNumber = pageContext?.pageNumber || 1;
    const footerY = doc.page.height - 50;

    doc.font(PDF_FONT_FAMILY).fontSize(PDF_FOOTER_SIZE).fillColor('#888888');
    doc.text(`Generated by ${companyName}`, 40, footerY, { align: 'center' });

    doc.font(PDF_FONT_FAMILY).fontSize(PDF_FOOTER_SIZE).fillColor('#888888');
    doc.text(`Page ${pageNumber}`, 40, footerY - 14, { align: 'center' });
};

/**
 * Adds a page, advances the shared page counter and re-applies the optional
 * page-reset hook (used to repeat table headers).
 */
export const addPdfPage = (doc, pageContext, onPageReset) => {
    doc.addPage();

    pageContext.pageNumber += 1;

    if (typeof onPageReset === 'function') {
        onPageReset();
    }

    return pageContext.pageNumber;
};
