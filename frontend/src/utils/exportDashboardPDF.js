import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportDashboardPDF = ({
  workers,
  attendanceSummary,
  expenseReport,
  activeSites,
}) => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(
    "Contractor Worker Management System",
    14,
    18
  );

  doc.setFontSize(13);

  doc.text(
    "Dashboard Report",
    14,
    28
  );

  doc.setFontSize(10);

  doc.text(
    `Generated : ${new Date().toLocaleString(
      "en-IN"
    )}`,
    14,
    36
  );

  autoTable(doc, {

    startY: 45,

    head: [["Summary", "Value"]],

    body: [

      [
        "Total Workers",
        workers.length,
      ],

      [
        "Present Today",
        attendanceSummary.present || 0,
      ],

      [
        "Absent Today",
        attendanceSummary.absent || 0,
      ],

      [
        "Leave",
        attendanceSummary.leave || 0,
      ],

      [
        "Active Sites",
        activeSites.length,
      ],

      [
        "Gross Salary",
        `₹${Number(
          expenseReport.totalGross || 0
        ).toLocaleString("en-IN")}`,
      ],

      [
        "Advance Paid",
        `₹${Number(
          expenseReport.totalAdvance || 0
        ).toLocaleString("en-IN")}`,
      ],

      [
        "Salary Paid",
        `₹${Number(
          expenseReport.totalPaid || 0
        ).toLocaleString("en-IN")}`,
      ],

      [
        "Pending Salary",
        `₹${Number(
          expenseReport.totalBalance || 0
        ).toLocaleString("en-IN")}`,
      ],

    ],

  });

  doc.save("Dashboard_Report.pdf");

};

export default exportDashboardPDF;