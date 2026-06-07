const ExcelJS = require('exceljs');

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('public/template.xlsx');
  const worksheet = workbook.worksheets[0];
  
  // Find header row (row 11)
  const headerRow = worksheet.getRow(11);
  console.log("Before splice:", headerRow.getCell(13).value, headerRow.getCell(14).value);
  
  worksheet.spliceColumns(13, 0, []);
  
  const newHeaderRow = worksheet.getRow(11);
  newHeaderRow.getCell(13).value = "15th APRIL";
  
  console.log("After splice:", newHeaderRow.getCell(13).value, newHeaderRow.getCell(14).value);
  await workbook.xlsx.writeFile('public/template_modified.xlsx');
}
main();
