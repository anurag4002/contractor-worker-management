import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportDashboardPDF = ({
  dashboard,
}) => {
  if (!dashboard) return;

  const {
    workers = {},
    attendance = {},
    sites = {},
    payroll = {},
  } = dashboard;

  const workersTotal = Number(workers.total || 0);
  const workersActive = Number(workers.active || 0);
  const present = Number(attendance.present || 0);
  const absent = Number(attendance.absent || 0);
  const leave = Number(attendance.leave || 0);
  const sitesActive = Number(sites.active || 0);
  const pendingSalary = Number(payroll.pendingSalary || 0);

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
        workersTotal,
      ],

      [
        "Active Workers",
        workersActive,
      ],

      [
        "Present Today",
        present,
      ],

      [
        "Absent Today",
        absent,
      ],

      [
        "Leave",
        leave,
      ],

      [
        "Active Sites",
        sitesActive,
      ],

      [
        "Pending Salary",
        `₹${pendingSalary.toLocaleString("en-IN")}`,
      ],

    ],

  });

  doc.save("Dashboard_Report.pdf");

};

export default exportDashboardPDF;
