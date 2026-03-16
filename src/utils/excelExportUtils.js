import ExcelJS from 'exceljs';
import { parseLooseNumber } from './numberFormatUtils.js';

function coerceLooseNumberOrOriginal(value) {
  const n = parseLooseNumber(value);
  return n === null ? value : n;
}

function defaultColumnWidth(header) {
  const h = (header ?? '').toString();
  const lower = h.toLowerCase();
  if (lower === 'ano') return 12;
  if (lower.includes('munic')) return 35;
  // Comfortable default for numeric columns.
  return Math.min(40, Math.max(14, h.length + 4));
}

/**
 * Creates a workbook with a consistent "Observatorio" layout:
 * - Title on first row (merged)
 * - Blank row
 * - Header row with gray fill
 * - Data rows (numeric formatting on selected columns)
 * - Blank row + source line
 */
export async function buildStyledWorkbook({
  creator = 'OPEPI/UFPI',
  sheetName = 'Dados',
  title,
  headers,
  rows,
  source = 'Fonte: SIOPE/FNDE - Elaboração: OPEPI/UFPI',
  numericColumns = null, // array of 0-based indices. If null, defaults to all except first.
  columnWidths = null, // array of widths (same length as headers)
}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = creator;
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName);
  const numCols = Math.max(1, headers?.length ?? 1);

  let currentRow = 1;

  if (title) {
    worksheet.addRow([title]);
    worksheet.mergeCells(currentRow, 1, currentRow, numCols);
    const titleCell = worksheet.getCell(currentRow, 1);
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    currentRow += 1;
    worksheet.addRow([]);
    currentRow += 1;
  }

  const safeHeaders = (headers && headers.length > 0) ? headers : [''];
  const headerRow = worksheet.addRow(safeHeaders);
  headerRow.font = { bold: true };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  currentRow += 1;

  const numericIdx =
    Array.isArray(numericColumns) ? numericColumns : safeHeaders.map((_, idx) => idx).filter((idx) => idx !== 0);

  (rows ?? []).forEach((row) => {
    const values = Array.isArray(row) ? row : [];
    const coerced = values.map((v, idx) =>
      numericIdx.includes(idx) ? coerceLooseNumberOrOriginal(v) : v
    );
    worksheet.addRow(coerced);
    currentRow += 1;
  });

  worksheet.addRow([]);
  currentRow += 1;
  if (source) {
    worksheet.addRow([source]);
    currentRow += 1;
  }

  // Column widths
  const widths =
    Array.isArray(columnWidths) && columnWidths.length === safeHeaders.length
      ? columnWidths
      : safeHeaders.map((h) => defaultColumnWidth(h));

  widths.forEach((w, idx) => {
    const col = worksheet.getColumn(idx + 1);
    col.width = w;
  });

  // Alignment + numeric format
  safeHeaders.forEach((h, idx) => {
    const col = worksheet.getColumn(idx + 1);
    const lower = (h ?? '').toString().toLowerCase();
    if (numericIdx.includes(idx)) {
      col.numFmt = '#,##0.00';
      col.alignment = { horizontal: 'right', vertical: 'middle' };
    } else if (lower === 'ano') {
      col.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
      col.alignment = { horizontal: 'left', vertical: 'middle' };
    }
  });

  return workbook;
}
