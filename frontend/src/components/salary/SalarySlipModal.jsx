import React, { useEffect, useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { registerPdfFonts } from "../../utils/pdfFonts";
import authService from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { showError } from "../../components/common/toast";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Grid,
  Item,
  Label,
  Value,
  Footer,
  Button,
  SecondaryButton,
} from "./SalarySlipModal.style";

const COMPANY_NAME_FALLBACK = "Company name not configured";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatMonthYear = (month, year) => {
  if (!month || !year) return "-";
  return new Date(Number(year), Number(month) - 1, 1).toLocaleString(
    "en-IN",
    { month: "long", year: "numeric" }
  );
};

const sanitizeFileName = (name) =>
  String(name || "salary-slip").replace(/[^a-zA-Z0-9 _-]/g, "_").trim();

const SalarySlipModal = ({ open, worker, onClose }) => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState(COMPANY_NAME_FALLBACK);

  useEffect(() => {
    let cancelled = false;

    const loadCompanyName = async () => {
      try {
        const tenant = await authService.getMyTenant();
        if (!cancelled) {
          setCompanyName(
            tenant?.companyName || user?.tenant?.companyName || user?.companyName || COMPANY_NAME_FALLBACK
          );
        }
      } catch {
        if (!cancelled) {
          setCompanyName(user?.tenant?.companyName || user?.companyName || COMPANY_NAME_FALLBACK);
        }
      }
    };

    if (open) {
      loadCompanyName();
    }

    return () => {
      cancelled = true;
    };
  }, [open, user]);

  const grossSalary = Number(worker?.grossSalary || 0);

  const deduction = Number(worker?.deduction || 0);

  const advanceDeduction = Number(worker?.advanceDeduction || 0);

  const paid = Number(worker?.paid || 0) + Number(worker?.advanceDeduction || 0);

  const netPayable = Math.max(0, grossSalary - deduction - advanceDeduction);

  const balance = Math.max(0, netPayable - Number(worker?.paid || 0));

  const status =
    worker?.status === "CANCELLED"
      ? "Cancelled"
      : balance <= 0
      ? "Paid"
      : paid > 0
      ? "Partially Paid"
      : "Pending";

  const downloadSalarySlipPDF = async () => {
    if (!worker) return;

    try {
      const workerObj = worker.worker || {};
      const site = worker.site || {};

      const employeeId = workerObj.employeeCode || workerObj._id || "-";
      const workerName = workerObj.fullName || "-";
      const mobile = workerObj.mobileNumber || "-";
      const siteName = site.siteName || "-";
      const workType = workerObj.trade || "-";
      const period = formatMonthYear(worker.attendanceMonth, worker.attendanceYear);
      const daysWorked = worker.workingDays || 0;
      const month = worker.attendanceMonth;
      const year = worker.attendanceYear;

      const doc = new jsPDF();

      // Embed a Unicode-capable font (Noto Sans) so the Indian Rupee sign (₹)
      // renders correctly instead of the Helvetica substitute ("¹").
      registerPdfFonts(doc);
      doc.setFont("NotoSans");

      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42);
      doc.text("Salary Slip", 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(companyName, 14, 32);
      doc.text(`Generated : ${new Date().toLocaleString("en-IN")}`, 14, 40);

      const infoStartY = 52;

      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text("Worker Details", 14, infoStartY);

      const infoRows = [
        ["Worker ID", employeeId],
        ["Worker Name", workerName],
        ["Mobile", mobile],
        ["Site", siteName],
        ["Work Type", workType],
        ["Payroll Period", period],
        ["Days Worked", String(daysWorked)],
      ];

      autoTable(doc, {
        startY: infoStartY + 6,
        head: [["Field", "Value"]],
        body: infoRows,
        theme: "plain",
        styles: { font: "NotoSans", fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
        columnStyles: { 0: { fontStyle: "bold", textColor: [100, 116, 139] } },
        margin: { left: 14 },
      });

      const tableStartY = doc.lastAutoTable.finalY + 12;

      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text("Salary Summary", 14, tableStartY);

      const summaryRows = [
        ["Wage Type", "Daily Wage"],
        ["Wage Rate", `${formatCurrency(worker.dailyWage || 0)} / Day`],
        ["Gross Salary", formatCurrency(grossSalary)],
        ["Deduction", formatCurrency(deduction)],
        ["Advance Deduction", formatCurrency(advanceDeduction)],
        ["Net Payable", formatCurrency(netPayable)],
        ["Salary Paid", formatCurrency(Number(worker.paid || 0))],
        ["Remaining Balance", formatCurrency(balance)],
        ["Payment Status", status],
      ];

      autoTable(doc, {
        startY: tableStartY + 6,
        head: [["Field", "Amount"]],
        body: summaryRows,
        theme: "plain",
        styles: { font: "NotoSans", fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
        columnStyles: { 0: { fontStyle: "bold", textColor: [100, 116, 139] } },
        margin: { left: 14 },
      });

      const finalY = doc.lastAutoTable.finalY + 14;

      doc.setFont("NotoSans");
      doc.setFontSize(8);
      doc.setTextColor(136, 136, 136);
      doc.text(`Generated by ${companyName}`, 14, finalY);
      doc.text("Page 1", 14, finalY + 10);

      const fileName = `salary-slip-${sanitizeFileName(workerName)}-${sanitizeFileName(String(year))}-${sanitizeFileName(String(month))}.pdf`;

      doc.save(fileName);
    } catch {
      console.error("Salary slip PDF generation failed:");
      showError("Failed to generate salary slip PDF.");
    }
  };

  if (!open || !worker) return null;

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>Salary Slip</Title>
          <CloseButton onClick={onClose}>
            ×
          </CloseButton>
        </Header>
        <Body>
          <Grid>
            <Item>
              <Label>Worker ID</Label>
              <Value>{worker._id}</Value>
            </Item>
            <Item>
              <Label>Worker Name</Label>
              <Value>{worker.worker?.fullName || "-"}</Value>
            </Item>
            <Item>
              <Label>Mobile</Label>
              <Value>{worker.mobile || "-"}</Value>
            </Item>
            <Item>
              <Label>Site</Label>
              <Value>{worker.site?.siteName || "-"}</Value>
            </Item>
            <Item>
              <Label>Work Type</Label>
              <Value>{worker.worker?.trade || "-"}</Value>
            </Item>
            <Item>
              <Label>Wage Type</Label>
              <Value>Daily Wage</Value>
            </Item>
            <Item>
              <Label>Wage Rate</Label>
              <Value>{`${formatCurrency(worker.dailyWage || 0)} / Day`}</Value>
            </Item>
            <Item>
              <Label>Days Worked</Label>
              <Value>{worker.workingDays || 0}</Value>
            </Item>
            <Item>
              <Label>Gross Salary</Label>
              <Value>{formatCurrency(grossSalary)}</Value>
            </Item>
            <Item>
              <Label>Deduction</Label>
              <Value>{formatCurrency(deduction)}</Value>
            </Item>
            <Item>
              <Label>Advance Deduction</Label>
              <Value>{formatCurrency(advanceDeduction)}</Value>
            </Item>
            <Item>
              <Label>Net Payable</Label>
              <Value>{formatCurrency(netPayable)}</Value>
            </Item>
            <Item>
              <Label>Salary Paid</Label>
              <Value>{formatCurrency(Number(worker.paid || 0))}</Value>
            </Item>
            <Item>
              <Label>Remaining Balance</Label>
              <Value>{formatCurrency(balance)}</Value>
            </Item>
            <Item>
              <Label>Payment Status</Label>
              <Value>{status}</Value>
            </Item>
          </Grid>
        </Body>
        <Footer>
          <SecondaryButton onClick={downloadSalarySlipPDF}>Download PDF</SecondaryButton>
          <Button onClick={onClose}>Close</Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default SalarySlipModal;
