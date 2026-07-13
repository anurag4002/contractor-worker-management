import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

export const exportToExcel = (
  data,
  fileName = "Report"
) => {

  if (!data || data.length === 0) {

    return;

  }

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(

    workbook,

    worksheet,

    "Report"

  );

  const excelBuffer =
    XLSX.write(workbook, {

      bookType: "xlsx",

      type: "array",

    });

  const fileData = new Blob(

    [excelBuffer],

    {

      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    }

  );

  saveAs(

    fileData,

    `${fileName}.xlsx`

  );

};

export const exportToPDF = (

  title,

  columns,

  rows,

  fileName = "Report"

) => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(title, 14, 20);

  autoTable(doc, {

    head: [columns],

    body: rows,

    startY: 30,

    styles: {

      fontSize: 9,

    },

    headStyles: {

      fillColor: [37, 99, 235],

    },

  });

  doc.save(`${fileName}.pdf`);

};