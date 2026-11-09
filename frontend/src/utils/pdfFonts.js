import {
  NOTO_SANS_REGULAR_BASE64,
  NOTO_SANS_BOLD_BASE64,
  registerSalarySlipFonts,
} from "./salarySlipFonts";

/**
 * Reusable jsPDF font registration for all generated PDFs (salary slips,
 * reports, dashboard exports) so the Indian Rupee sign (₹, U+20B9) renders
 * with the embedded Noto Sans font instead of the Helvetica substitute.
 */
export const registerPdfFonts = registerSalarySlipFonts;

export {
  NOTO_SANS_REGULAR_BASE64,
  NOTO_SANS_BOLD_BASE64,
  registerSalarySlipFonts,
};

const registerPdfFont = (doc) => registerSalarySlipFonts(doc);

export default registerPdfFont;
