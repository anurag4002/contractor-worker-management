import React from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatMonthYear = (month, year) => {
  if (!month || !year) return "-";
  return new Date(Number(year), Number(month) - 1, 1).toLocaleString(
    "en-IN",
    { month: "long", year: "numeric" }
  );
};

const sanitizeFileName = (name) =>
  String(name || "salary-slip").replace(/[^a-zA-Z0-9 _-]/g, "_").trim();

const SalarySlipModal = ({
  open,
  worker,
  onClose,
}) => {

  if (!open || !worker) return null;

  const grossSalary =
    Number(worker.grossSalary || 0);

  const advance =
    Number(worker.advanceDeduction || 0);

  const paid =
    Number(worker.paid || 0) + Number(worker.advanceDeduction || 0);

  const balance =
    worker.status === "PAID" ? 0 : Number(worker.netSalary || 0);

  const netSalary =
    grossSalary - advance;

  const status =
    balance <= 0
      ? "Paid"
      : paid > 0
      ? "Partial"
      : "Pending";

  const downloadSalarySlipPDF = () => {
    if (!worker) return;

    try {
      const workerObj = worker.worker || {};
      const site = worker.site || {};

      const employeeId =
        workerObj.employeeCode || workerObj._id || "-";
      const workerName = workerObj.fullName || "-";
      const mobile = workerObj.mobileNumber || "-";
      const siteName = site.siteName || "-";
      const workType = workerObj.trade || "-";

      const month = worker.attendanceMonth;
      const year = worker.attendanceYear;
      const period = formatMonthYear(month, year);

      const daysWorked = worker.workingDays || 0;
      const netSalaryVal = grossSalary - advance;

      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42);
      doc.text("Salary Slip", 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text("Contractor Worker Management", 14, 32);
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
        styles: { fontSize: 10, cellPadding: 3 },
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
        ["Wage Rate", formatCurrency(worker.dailyWage || 0) + " / Day"],
        ["Gross Salary", formatCurrency(grossSalary)],
        ["Advance Paid", formatCurrency(advance)],
        ["Net Salary", formatCurrency(netSalaryVal)],
        ["Salary Paid", formatCurrency(paid)],
        ["Remaining Balance", formatCurrency(balance)],
        ["Payment Status", status],
      ];

      autoTable(doc, {
        startY: tableStartY + 6,
        head: [["Field", "Amount"]],
        body: summaryRows,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
        columnStyles: { 0: { fontStyle: "bold", textColor: [100, 116, 139] } },
        margin: { left: 14 },
      });

      const fileName = `salary-slip-${sanitizeFileName(workerName)}-${sanitizeFileName(String(year))}-${sanitizeFileName(String(month))}.pdf`;

      doc.save(fileName);
    } catch (error) {
      console.error("Salary slip PDF generation failed:", error);
      showError(error);
    }
  };

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Salary Slip

          </Title>

          <CloseButton
            onClick={onClose}
          >

            ×

          </CloseButton>

        </Header>

        <Body>

          <Grid>

            <Item>

              <Label>

                Worker ID

              </Label>

              <Value>

                {worker._id}

              </Value>

            </Item>

            <Item>

              <Label>

                Worker Name

              </Label>

              <Value>

                {worker.worker?.fullName || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Mobile

              </Label>

              <Value>

                {worker.mobile || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Site

              </Label>

              <Value>

                {worker.site?.siteName || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Work Type

              </Label>

              <Value>

                {worker.worker?.trade || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Wage Type

              </Label>

              <Value>

                {

                  "Daily Wage"

                }

              </Value>

            </Item>

            <Item>

              <Label>

                Wage Rate

              </Label>

              <Value>

                {

                  `₹${Number(worker.dailyWage || 0).toLocaleString("en-IN")} / Day`

                }

              </Value>

            </Item>

            <Item>

              <Label>

                Days Worked

              </Label>

              <Value>

                {worker.workingDays || 0}

              </Value>

            </Item>

            <Item>

              <Label>

                Gross Salary

              </Label>

              <Value>

                ₹{grossSalary.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Advance Paid

              </Label>

              <Value>

                ₹{advance.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Net Salary

              </Label>

              <Value>

                ₹{netSalary.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Salary Paid

              </Label>

              <Value>

                ₹{paid.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Remaining Balance

              </Label>

              <Value>

                ₹{balance.toLocaleString("en-IN")}

              </Value>

            </Item>

            <Item>

              <Label>

                Payment Status

              </Label>

              <Value>

                {status}

              </Value>

            </Item>

          </Grid>

        </Body>

        <Footer>

          <SecondaryButton
            onClick={downloadSalarySlipPDF}
          >

            Download PDF

          </SecondaryButton>

          <Button
            onClick={onClose}
          >

            Close

          </Button>

        </Footer>

      </Modal>

    </Overlay>

  );

};

export default SalarySlipModal;